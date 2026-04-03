import os
import shutil
from fastapi import APIRouter, File, UploadFile, Form, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.mongodb import get_database
from app.db import crud
from app.db.models import Claim, ClaimType, ClaimStatus, CarIntake
from app.models.car import CarClaimResponse
from app.pipeline.car.metadata_check import check_metadata
from app.pipeline.car.validation import validate_claim
from app.pipeline.car.yolo_extractor import run_yolo
from app.pipeline.shared.consistency_scorer import compute_consistency_score
from app.pipeline.shared.evidence_scorer import compute_evidence_score
from app.pipeline.shared.policy_retriever import retrieve_policy_chunks
from app.pipeline.shared.policy_scorer import compute_policy_score
from app.pipeline.shared.scoring_engine import compute_final_score
from app.pipeline.shared.stp_engine import make_stp_decision
from app.services.settlement_service import process_settlement
from app.services import notification_service as notify
from app.utils.logger import get_logger

router = APIRouter(prefix="/car", tags=["Car Claims"])
logger = get_logger(__name__)


@router.post("/submit", response_model=CarClaimResponse)
async def submit_car_claim(
    claimant_name: str = Form(...),
    claimant_email: str = Form(...),
    claimant_telegram_id: str = Form(None),
    policy_number: str = Form(...),
    description: str = Form(...),
    selected_damage: str = Form(...),       # Dropdown — exact YOLO class name
    estimated_amount: float = Form(...),    # Fix 4: added
    evidence: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    logger.info(f"Car claim received from {claimant_email} for {selected_damage}")

    # ── Step 1: Save file temporarily ──────────────────────────────────────
    os.makedirs("uploads/car", exist_ok=True)
    temp_path = f"uploads/car/temp_{evidence.filename}"
    contents = await evidence.read()
    with open(temp_path, "wb") as f:
        f.write(contents)

    # ── Step 2: Metadata Check ──────────────────────────────────────────────
    meta_ok, meta_msg = check_metadata(temp_path)
    if not meta_ok:
        os.remove(temp_path)
        intake = CarIntake(selected_damage=selected_damage, description=description)
        claim_obj = Claim(
            claim_type=ClaimType.car,
            claimant_name=claimant_name,
            claimant_email=claimant_email,
            claimant_telegram_id=claimant_telegram_id,
            policy_number=policy_number,
            intake_data=intake,
            status=ClaimStatus.rejected,
            rejection_reason=meta_msg
        )
        claim_id = await crud.create_claim(db, claim_obj)   # Fix 2: use real claim_id
        notify.notify_reject(claim_id, claimant_name, claimant_email, claimant_telegram_id, meta_msg)
        raise HTTPException(status_code=400, detail=meta_msg)

    # ── Step 3: Validation ──────────────────────────────────────────────────
    required = {
        "claimant_name": claimant_name,
        "policy_number": policy_number,
        "description": description,
        "selected_damage": selected_damage
    }
    val_ok, val_result = await validate_claim(db, policy_number, temp_path, required)
    if not val_ok:
        os.remove(temp_path)
        raise HTTPException(status_code=400, detail=val_result)

    image_hash = val_result

    # ── Step 4: Create claim record ─────────────────────────────────────────
    intake = CarIntake(selected_damage=selected_damage, description=description)
    claim_obj = Claim(
        claim_type=ClaimType.car,
        claimant_name=claimant_name,
        claimant_email=claimant_email,
        claimant_telegram_id=claimant_telegram_id,
        policy_number=policy_number,
        intake_data=intake,
        image_hash=image_hash,
        estimated_amount=estimated_amount,
        status=ClaimStatus.pending
    )
    claim_id = await crud.create_claim(db, claim_obj)

    final_path = f"uploads/car/{claim_id}_{evidence.filename}"
    os.rename(temp_path, final_path)
    await crud.update_claim(db, claim_id, {"evidence_path": final_path})

    # ── Step 5: YOLO Extraction ─────────────────────────────────────────────
    extraction = run_yolo(final_path)
    await crud.update_claim(db, claim_id, {"extraction_results": extraction})

    # ── Step 6: Scoring ─────────────────────────────────────────────────────
    consistency = compute_consistency_score("car", {"selected_damage": selected_damage}, extraction)
    evidence_score = compute_evidence_score(extraction)

    chunks = retrieve_policy_chunks(description, "car")
    policy_res = compute_policy_score(
        chunks, 
        description, 
        "car",
        consistency_score=consistency,
        detected_labels=extraction.get("labels", [])
    )
    policy_score = policy_res["score"]
    groq_reasoning = policy_res["reasoning"]

    scores = compute_final_score(consistency, evidence_score, policy_score)

    # ── Step 7: STP Decision ────────────────────────────────────────────────
    stp = make_stp_decision(scores)

    await crud.update_claim(db, claim_id, {
        "consistency_score": scores["consistency_score"],
        "evidence_score": scores["evidence_score"],
        "policy_score": scores["policy_score"],
        "final_score": scores["final_score"],
        "stp_decision": stp["decision"],
        "groq_reasoning": groq_reasoning
    })

    # ── Step 8: Act on Decision ─────────────────────────────────────────────
    if stp["decision"] == "AUTO_APPROVE":
        settlement = process_settlement(claim_id, claimant_name, estimated_amount)  # Fix 4
        await crud.update_claim(db, claim_id, {
            "status": ClaimStatus.settled,
            "transaction_id": settlement["transaction_id"],
            "settlement_amount": settlement["amount"]
        })
        notify.notify_auto_approve(
            claim_id, claimant_name, claimant_email, claimant_telegram_id,
            settlement["transaction_id"], settlement["amount"], settlement["settled_at"]
        )
        return CarClaimResponse(
            claim_id=claim_id, status="settled",
            stp_decision=stp["decision"], final_score=scores["final_score"],
            message="Claim approved and settled automatically.",
            transaction_id=settlement["transaction_id"], reasoning=groq_reasoning
        )

    elif stp["decision"] == "MANUAL_REVIEW":
        await crud.update_claim(db, claim_id, {"status": ClaimStatus.manual_review})
        notify.notify_manual_review(
            claim_id, claimant_name, claimant_email,
            claimant_telegram_id, scores["final_score"]
        )
        return CarClaimResponse(
            claim_id=claim_id, status="manual_review",
            stp_decision=stp["decision"], final_score=scores["final_score"],
            message="Claim is under manual review. You will be notified within 24-48 hours.",
            reasoning=groq_reasoning
        )

    else:  # REJECT
        await crud.update_claim(db, claim_id, {
            "status": ClaimStatus.rejected,
            "rejection_reason": stp["reason"]
        })
        notify.notify_reject(
            claim_id, claimant_name, claimant_email, claimant_telegram_id, stp["reason"]
        )
        return CarClaimResponse(
            claim_id=claim_id, status="rejected",
            stp_decision=stp["decision"], final_score=scores["final_score"],
            message=stp["reason"], reasoning=groq_reasoning
        )
