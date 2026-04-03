from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.mongodb import get_database
from app.db import crud
from app.db.models import ClaimStatus
from app.models.scoring import ReviewDecision, ReviewQueueItem
from app.services.settlement_service import process_settlement
from app.services import notification_service as notify
from app.utils.logger import get_logger
from typing import List

router = APIRouter(prefix="/review", tags=["Manual Review"])
logger = get_logger(__name__)


@router.get("/queue", response_model=List[ReviewQueueItem])
async def get_review_queue(db: AsyncIOMotorDatabase = Depends(get_database)):
    """Returns all claims awaiting manual review."""
    claims = await crud.get_manual_review_queue(db)
    return [
        ReviewQueueItem(
            claim_id=c["_id"],
            claim_type=c["claim_type"],
            claimant_name=c["claimant_name"],
            claimant_email=c["claimant_email"],
            policy_number=c["policy_number"],
            description=c.get("intake_data", {}).get("description", ""),
            final_score=c.get("final_score", 0.0),
            created_at=str(c.get("created_at", ""))
        )
        for c in claims
    ]


@router.post("/{claim_id}/decision")
async def submit_review_decision(
    claim_id: str,
    decision: ReviewDecision,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Reviewer approves or rejects a claim in the manual queue."""
    claim = await crud.get_claim(db, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail=f"Claim #{claim_id} not found.")

    if claim["status"] != ClaimStatus.manual_review:
        raise HTTPException(
            status_code=400,
            detail=f"Claim #{claim_id} is not in manual review queue (status: {claim['status']})."
        )

    if decision.decision not in ("approve", "reject"):
        raise HTTPException(status_code=400, detail="Decision must be 'approve' or 'reject'.")

    if decision.decision == "approve":
        amount = claim.get("estimated_amount", 0.0) or 0.0
        settlement = process_settlement(claim_id, claim["claimant_name"], amount)
        await crud.update_claim(db, claim_id, {
            "status": ClaimStatus.settled,
            "transaction_id": settlement["transaction_id"],
            "settlement_amount": settlement["amount"]
        })
        
        notify.notify_reviewer_decision(
            claim_id, claim["claimant_name"], claim["claimant_email"],
            claim.get("claimant_telegram_id"), approved=True,
            transaction_id=settlement["transaction_id"],
            amount=settlement["amount"],
            notes=decision.notes
        )
        
        return {
            "claim_id": claim_id,
            "decision": "approved",
            "transaction_id": settlement["transaction_id"],
            "message": f"Claim #{claim_id} approved and settled by {decision.reviewer_name}."
        }

    else:  # reject
        reason = decision.notes or "Rejected after manual review."
        await crud.update_claim(db, claim_id, {
            "status": ClaimStatus.rejected,
            "rejection_reason": reason
        })
        
        notify.notify_reviewer_decision(
            claim_id, claim["claimant_name"], claim["claimant_email"],
            claim.get("claimant_telegram_id"), approved=False, notes=reason
        )
        
        return {
            "claim_id": claim_id,
            "decision": "rejected",
            "message": f"Claim #{claim_id} rejected by {decision.reviewer_name}."
        }
