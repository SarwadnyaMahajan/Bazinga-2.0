from datetime import datetime
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from app.db.models import Claim, ClaimStatus

async def create_claim(db: AsyncIOMotorDatabase, claim: Claim) -> str:
    claim_dict = claim.model_dump()
    result = await db.claims.insert_one(claim_dict)
    return str(result.inserted_id)

async def get_claim(db: AsyncIOMotorDatabase, claim_id: str) -> Optional[dict]:
    if not ObjectId.is_valid(claim_id):
        return None
    claim = await db.claims.find_one({"_id": ObjectId(claim_id)})
    if claim:
        claim["_id"] = str(claim["_id"])
    return claim

async def update_claim(db: AsyncIOMotorDatabase, claim_id: str, updates: dict) -> bool:
    if not ObjectId.is_valid(claim_id):
        return False
    updates["updated_at"] = datetime.now()
    result = await db.claims.update_one({"_id": ObjectId(claim_id)}, {"$set": updates})
    return result.modified_count > 0

async def get_manual_review_queue(db: AsyncIOMotorDatabase) -> List[dict]:
    cursor = db.claims.find({"status": ClaimStatus.manual_review})
    claims = []
    async for claim in cursor:
        claim["_id"] = str(claim["_id"])
        claims.append(claim)
    return claims

async def get_claim_by_hash(db: AsyncIOMotorDatabase, image_hash: str) -> Optional[dict]:
    claim = await db.claims.find_one({"image_hash": image_hash})
    if claim:
        claim["_id"] = str(claim["_id"])
    return claim
