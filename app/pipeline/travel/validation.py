from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db import crud
import hashlib
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Mock active policies — replace with DB/external lookup
ACTIVE_POLICIES = {"POL001", "POL002", "POL003", "TRAVEL001", "TRAVEL002", "POL12345"}

def compute_image_hash(file_path: str) -> str:
    """Compute SHA256 hash of a file."""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

async def validate_claim(db: AsyncIOMotorDatabase, policy_number: str, evidence_path: str, required_fields: dict) -> tuple[bool, str]:
    """
    Returns (passed: bool, result: str)
    """
    # 1. Policy active check
    if policy_number not in ACTIVE_POLICIES:
        return False, f"Policy {policy_number} is not active or does not exist."

    # 2. Required fields check
    missing = [k for k, v in required_fields.items() if not v]
    if missing:
        return False, f"Missing required fields: {', '.join(missing)}"

    # 3. Duplicate image hash check
    image_hash = compute_image_hash(evidence_path)
    existing = await crud.get_claim_by_hash(db, image_hash)
    if existing:
        return False, f"This document was already submitted in claim #{existing['_id']}."

    return True, image_hash
