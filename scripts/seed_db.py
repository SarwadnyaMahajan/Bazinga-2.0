"""
scripts/seed_db.py — seed a dummy claim into MongoDB for local testing.
Usage: python scripts/seed_db.py
"""
import sys
import os
import asyncio
from datetime import datetime

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.mongodb import connect_to_mongo, close_mongo_connection, get_database
from app.db.crud import create_claim
from app.db.models import Claim, ClaimType, ClaimStatus, CarIntake


async def seed():
    await connect_to_mongo()
    db = get_database()

    intake = CarIntake(
        selected_damage="front-bumper-dent",
        description="Front bumper damaged in a parking lot collision"
    )

    sample = Claim(
        claim_type=ClaimType.car,
        claimant_name="Test User",
        claimant_email="test@example.com",
        policy_number="CAR001",
        intake_data=intake,
        status=ClaimStatus.manual_review,
        consistency_score=0.65,
        evidence_score=0.60,
        policy_score=0.55,
        final_score=0.61,
        stp_decision="MANUAL_REVIEW"
    )

    claim_id = await create_claim(db, sample)
    print(f"Seeded claim ID: {claim_id}")

    await close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(seed())
