from pydantic import BaseModel, EmailStr
from typing import Optional


class TravelClaimResponse(BaseModel):
    claim_id: str
    status: str
    stp_decision: str
    final_score: float
    message: str
    transaction_id: Optional[str] = None
    reasoning: Optional[str] = None
