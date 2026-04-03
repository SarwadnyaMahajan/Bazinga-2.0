"""
scripts/verify_system.py — End-to-end verification of the Insurance STP pipeline.
Checks: imports, config, data contracts, pipeline flow, and DB connectivity.
"""
import sys, os, traceback, asyncio
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

PASS = "✅"
FAIL = "❌"
WARN = "⚠️"
results = []

def check(name, fn):
    try:
        result = fn()
        if result is True or result is None:
            results.append((PASS, name, ""))
        elif isinstance(result, str):
            results.append((WARN, name, result))
        else:
            results.append((PASS, name, str(result) if result else ""))
    except Exception as e:
        results.append((FAIL, name, f"{type(e).__name__}: {e}"))

# ════════════════════════════════════════════════════════════════════
# 1. MODULE IMPORTS
# ════════════════════════════════════════════════════════════════════
print("=" * 60)
print("1. CHECKING MODULE IMPORTS")
print("=" * 60)

check("app.config (Settings)", lambda: __import__("app.config", fromlist=["settings"]))
check("app.db.mongodb", lambda: __import__("app.db.mongodb", fromlist=["connect_to_mongo"]))
check("app.db.crud", lambda: __import__("app.db.crud", fromlist=["create_claim"]))
check("app.db.models", lambda: __import__("app.db.models", fromlist=["Claim"]))
check("app.models.car", lambda: __import__("app.models.car", fromlist=["CarClaimResponse"]))
check("app.models.travel", lambda: __import__("app.models.travel", fromlist=["TravelClaimResponse"]))
check("app.models.scoring", lambda: __import__("app.models.scoring", fromlist=["ReviewDecision"]))
check("app.pipeline.car.metadata_check", lambda: __import__("app.pipeline.car.metadata_check", fromlist=["check_metadata"]))
check("app.pipeline.car.validation", lambda: __import__("app.pipeline.car.validation", fromlist=["validate_claim"]))
check("app.pipeline.car.yolo_extractor", lambda: __import__("app.pipeline.car.yolo_extractor", fromlist=["run_yolo"]))
check("app.pipeline.travel.metadata_check", lambda: __import__("app.pipeline.travel.metadata_check", fromlist=["check_metadata"]))
check("app.pipeline.travel.validation", lambda: __import__("app.pipeline.travel.validation", fromlist=["validate_claim"]))
check("app.pipeline.travel.ocr_extractor", lambda: __import__("app.pipeline.travel.ocr_extractor", fromlist=["run_ocr"]))
check("app.pipeline.shared.consistency_scorer", lambda: __import__("app.pipeline.shared.consistency_scorer", fromlist=["compute_consistency_score"]))
check("app.pipeline.shared.evidence_scorer", lambda: __import__("app.pipeline.shared.evidence_scorer", fromlist=["compute_evidence_score"]))
check("app.pipeline.shared.policy_retriever", lambda: __import__("app.pipeline.shared.policy_retriever", fromlist=["retrieve_policy_chunks"]))
check("app.pipeline.shared.policy_scorer", lambda: __import__("app.pipeline.shared.policy_scorer", fromlist=["compute_policy_score"]))
check("app.pipeline.shared.scoring_engine", lambda: __import__("app.pipeline.shared.scoring_engine", fromlist=["compute_final_score"]))
check("app.pipeline.shared.stp_engine", lambda: __import__("app.pipeline.shared.stp_engine", fromlist=["make_stp_decision"]))
check("app.services.settlement_service", lambda: __import__("app.services.settlement_service", fromlist=["process_settlement"]))
check("app.services.notification_service", lambda: __import__("app.services.notification_service", fromlist=["notify_auto_approve"]))
check("app.api.car.routes", lambda: __import__("app.api.car.routes", fromlist=["router"]))
check("app.api.travel.routes", lambda: __import__("app.api.travel.routes", fromlist=["router"]))
check("app.api.review.routes", lambda: __import__("app.api.review.routes", fromlist=["router"]))
check("app.api.health", lambda: __import__("app.api.health", fromlist=["router"]))
check("app.main (FastAPI app)", lambda: __import__("app.main", fromlist=["app"]))

# ════════════════════════════════════════════════════════════════════
# 2. CONFIGURATION VALIDATION
# ════════════════════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("2. CHECKING CONFIGURATION")
print("=" * 60)

from app.config import settings

def check_config():
    issues = []
    if "cluster0" not in settings.mongo_uri and "localhost" not in settings.mongo_uri:
        issues.append("mongo_uri looks invalid")
    if settings.mongo_uri.startswith("mongodb+srv://<"):
        issues.append("mongo_uri still has placeholder")
    if settings.groq_api_key == "your_groq_api_key" or not settings.groq_api_key:
        issues.append("groq_api_key not set")
    if not settings.roboflow_api_key or settings.roboflow_api_key == "your_roboflow_api_key":
        issues.append("roboflow_api_key not set")
    if issues:
        return ", ".join(issues)
    return True

check("MongoDB URI configured", lambda: True if "cluster0" in settings.mongo_uri else "URI might not be set correctly")
check("MongoDB DB name", lambda: f"db={settings.mongo_db_name}")
check("Groq API key set", lambda: True if settings.groq_api_key and settings.groq_api_key != "your_groq_api_key" else "NOT SET")
check("Groq model name", lambda: f"model={settings.groq_model_name}")
check("Roboflow API key set", lambda: True if settings.roboflow_api_key and settings.roboflow_api_key != "your_roboflow_api_key" else "NOT SET")
check("Roboflow model ID", lambda: f"model={settings.roboflow_model_id}")
check("Scoring weights sum", lambda: True if abs(settings.consistency_weight + settings.evidence_weight + settings.policy_weight - 1.0) < 0.01 else f"Weights sum to {settings.consistency_weight + settings.evidence_weight + settings.policy_weight}, expected 1.0")
check("STP thresholds valid", lambda: True if settings.reject_threshold < settings.auto_approve_threshold else "reject_threshold >= auto_approve_threshold!")

# ════════════════════════════════════════════════════════════════════
# 3. DATA CONTRACT VERIFICATION (Pipeline Stage I/O)
# ════════════════════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("3. CHECKING PIPELINE DATA CONTRACTS")
print("=" * 60)

from app.pipeline.shared.consistency_scorer import compute_consistency_score
from app.pipeline.shared.evidence_scorer import compute_evidence_score
from app.pipeline.shared.scoring_engine import compute_final_score
from app.pipeline.shared.stp_engine import make_stp_decision
from app.services.settlement_service import process_settlement

# Simulate CAR flow
def test_car_consistency():
    # YOLO returns: {"labels": [...], "confidence": float}
    mock_yolo = {"labels": ["front-bumper-dent", "bonnet-dent"], "confidence": 0.85}
    score = compute_consistency_score("car", {"selected_damage": "front-bumper-dent"}, mock_yolo)
    assert isinstance(score, float), f"Expected float, got {type(score)}"
    assert score == 1.0, f"Exact match should be 1.0, got {score}"
    return f"score={score}"

def test_car_consistency_mismatch():
    mock_yolo = {"labels": ["bonnet-dent"], "confidence": 0.85}
    score = compute_consistency_score("car", {"selected_damage": "front-bumper-dent"}, mock_yolo)
    assert score == 0.3, f"Mismatch should be 0.3, got {score}"
    return f"score={score}"

def test_car_consistency_empty():
    mock_yolo = {"labels": [], "confidence": 0.0}
    score = compute_consistency_score("car", {"selected_damage": "front-bumper-dent"}, mock_yolo)
    assert score == 0.0, f"No detection should be 0.0, got {score}"
    return f"score={score}"

# Simulate TRAVEL flow
def test_travel_consistency():
    mock_ocr = {"extracted_fields": {"booking_ref": "AI302", "airline": "Air India", "date": "15/03/2024"}, "confidence": 0.78}
    score = compute_consistency_score("travel", {"selected_category": "Flight Delay"}, mock_ocr)
    assert isinstance(score, float)
    assert score == 1.0, f"All 3 fields found should be 1.0, got {score}"
    return f"score={score}"

def test_evidence_score():
    mock_output = {"confidence": 0.82}
    score = compute_evidence_score(mock_output)
    assert isinstance(score, float)
    assert score == 0.82, f"Expected 0.82, got {score}"
    return f"score={score}"

def test_final_scoring():
    scores = compute_final_score(1.0, 0.85, 0.7)
    assert "final_score" in scores
    assert "consistency_score" in scores
    assert "evidence_score" in scores
    assert "policy_score" in scores
    expected = 0.4 * 1.0 + 0.35 * 0.85 + 0.25 * 0.7
    assert abs(scores["final_score"] - expected) < 0.01, f"Expected ~{expected:.4f}, got {scores['final_score']}"
    return f"final={scores['final_score']}"

def test_stp_approve():
    scores = {"final_score": 0.85}
    decision = make_stp_decision(scores)
    assert decision["decision"] == "AUTO_APPROVE", f"Expected AUTO_APPROVE, got {decision['decision']}"
    return f"decision={decision['decision']}"

def test_stp_review():
    scores = {"final_score": 0.60}
    decision = make_stp_decision(scores)
    assert decision["decision"] == "MANUAL_REVIEW", f"Expected MANUAL_REVIEW, got {decision['decision']}"
    return f"decision={decision['decision']}"

def test_stp_reject():
    scores = {"final_score": 0.35}
    decision = make_stp_decision(scores)
    assert decision["decision"] == "REJECT", f"Expected REJECT, got {decision['decision']}"
    return f"decision={decision['decision']}"

def test_settlement():
    result = process_settlement("test123", "John Doe", 15000.0)
    assert "transaction_id" in result
    assert result["transaction_id"].startswith("TXN-")
    assert result["amount"] == 15000.0
    return f"txn={result['transaction_id']}"

check("Car consistency — exact match", test_car_consistency)
check("Car consistency — mismatch", test_car_consistency_mismatch)
check("Car consistency — no detection", test_car_consistency_empty)
check("Travel consistency — all fields", test_travel_consistency)
check("Evidence score extraction", test_evidence_score)
check("Final scoring (weighted)", test_final_scoring)
check("STP → AUTO_APPROVE (0.85)", test_stp_approve)
check("STP → MANUAL_REVIEW (0.60)", test_stp_review)
check("STP → REJECT (0.35)", test_stp_reject)
check("Settlement service", test_settlement)

# ════════════════════════════════════════════════════════════════════
# 4. POLICY RETRIEVAL CHECK
# ════════════════════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("4. CHECKING POLICY RETRIEVAL")
print("=" * 60)

from app.pipeline.shared.policy_retriever import retrieve_policy_chunks

def test_policy_retrieval():
    chunks_dir = "policy_store/chunks"
    if not os.path.exists(chunks_dir) or not os.listdir(chunks_dir):
        return "No chunks found — run build_policy_index.py first (will use fallback)"
    chunks = retrieve_policy_chunks("front bumper damage repair", "car")
    assert isinstance(chunks, list)
    assert len(chunks) > 0, "Should return at least 1 chunk"
    assert "text" in chunks[0]
    assert "score" in chunks[0]
    return f"Retrieved {len(chunks)} chunks, top score={chunks[0]['score']}"

check("Policy chunk retrieval", test_policy_retrieval)

# ════════════════════════════════════════════════════════════════════
# 5. PYDANTIC MODEL VALIDATION
# ════════════════════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("5. CHECKING PYDANTIC MODELS")
print("=" * 60)

from app.db.models import Claim, ClaimType, ClaimStatus, CarIntake, TravelIntake
from app.models.car import CarClaimResponse
from app.models.travel import TravelClaimResponse
from app.models.scoring import ReviewDecision, ReviewQueueItem

def test_claim_model():
    intake = CarIntake(selected_damage="front-bumper-dent", description="Test")
    claim = Claim(
        claim_type=ClaimType.car,
        claimant_name="Test User",
        claimant_email="test@example.com",
        policy_number="CAR001",
        intake_data=intake
    )
    d = claim.model_dump()
    assert d["claim_type"] == "car"
    assert d["status"] == "pending"
    assert d["intake_data"]["selected_damage"] == "front-bumper-dent"
    return f"fields={len(d)}"

def test_travel_intake():
    intake = TravelIntake(
        selected_category="Flight Delay",
        description="Flight delayed by 5 hours",
        trip_origin="Mumbai",
        trip_destination="Delhi",
        travel_date="2024-03-15"
    )
    claim = Claim(
        claim_type=ClaimType.travel,
        claimant_name="Travel User",
        claimant_email="travel@example.com",
        policy_number="TRAVEL001",
        intake_data=intake
    )
    d = claim.model_dump()
    assert d["claim_type"] == "travel"
    assert d["intake_data"]["trip_origin"] == "Mumbai"
    return True

def test_car_response():
    resp = CarClaimResponse(
        claim_id="abc123", status="settled",
        stp_decision="AUTO_APPROVE", final_score=0.85,
        message="Approved", transaction_id="TXN-ABC", reasoning="Good claim"
    )
    assert resp.claim_id == "abc123"
    return True

def test_review_decision():
    rd = ReviewDecision(decision="approve", reviewer_name="Admin", notes="Looks good")
    assert rd.decision == "approve"
    return True

def test_review_queue_item():
    item = ReviewQueueItem(
        claim_id="abc123", claim_type="car", claimant_name="Test",
        claimant_email="t@t.com", policy_number="CAR001",
        description="Bumper damage", final_score=0.62, created_at="2024-01-01"
    )
    assert item.claim_id == "abc123"
    return True

check("Claim model (car intake)", test_claim_model)
check("Claim model (travel intake)", test_travel_intake)
check("CarClaimResponse", test_car_response)
check("ReviewDecision", test_review_decision)
check("ReviewQueueItem", test_review_queue_item)

# ════════════════════════════════════════════════════════════════════
# 6. MONGODB CONNECTIVITY
# ════════════════════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("6. CHECKING MONGODB CONNECTIVITY")
print("=" * 60)

from app.db.mongodb import connect_to_mongo, close_mongo_connection, get_database

async def test_mongo():
    await connect_to_mongo()
    db = get_database()
    # Simple ping
    result = await db.command("ping")
    assert result.get("ok") == 1.0, f"Ping failed: {result}"
    await close_mongo_connection()
    return f"ping ok=1.0, db={settings.mongo_db_name}"

def run_mongo_check():
    return asyncio.run(test_mongo())

check("MongoDB Atlas connectivity", run_mongo_check)

# ════════════════════════════════════════════════════════════════════
# 7. FASTAPI APP CREATION
# ════════════════════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("7. CHECKING FASTAPI APP")
print("=" * 60)

def test_fastapi_app():
    from app.main import app
    routes = [r.path for r in app.routes]
    expected = ["/car/submit", "/travel/submit", "/review/queue", "/health", "/"]
    missing = [r for r in expected if r not in routes]
    if missing:
        return f"Missing routes: {missing}"
    return f"All {len(expected)} routes registered"

check("FastAPI app + routes", test_fastapi_app)

# ════════════════════════════════════════════════════════════════════
# RESULTS SUMMARY
# ════════════════════════════════════════════════════════════════════
print("\n" + "=" * 60)
print("RESULTS SUMMARY")
print("=" * 60)
passed = sum(1 for r in results if r[0] == PASS)
warned = sum(1 for r in results if r[0] == WARN)
failed = sum(1 for r in results if r[0] == FAIL)

for status, name, detail in results:
    detail_str = f" — {detail}" if detail else ""
    print(f"  {status} {name}{detail_str}")

print(f"\n{'=' * 60}")
print(f"  Total: {len(results)} | {PASS} Passed: {passed} | {WARN} Warnings: {warned} | {FAIL} Failed: {failed}")
print(f"{'=' * 60}")

if failed > 0:
    sys.exit(1)
