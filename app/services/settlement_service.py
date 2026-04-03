"""
Settlement Service
Simulates payment processing and generates a transaction ID.
In production, replace with actual payment gateway integration.
"""
import uuid
import hashlib
from datetime import datetime
from app.utils.logger import get_logger

logger = get_logger(__name__)


def process_settlement(claim_id: str, claimant_name: str, estimated_amount: float) -> dict:
    """
    Simulates payment settlement.
    Returns: { "transaction_id": str, "amount": float, "settled_at": str }
    """
    # Generate deterministic-looking transaction ID
    raw = f"{claim_id}-{claimant_name}-{datetime.utcnow().isoformat()}-{uuid.uuid4()}"
    txn_hash = hashlib.sha256(raw.encode()).hexdigest()[:16].upper()
    transaction_id = f"TXN-{txn_hash}"

    settled_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

    logger.info(f"Settlement processed: claim={claim_id}, txn={transaction_id}, amount={estimated_amount}")

    return {
        "transaction_id": transaction_id,
        "amount": estimated_amount,
        "settled_at": settled_at
    }
