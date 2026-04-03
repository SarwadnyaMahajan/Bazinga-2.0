from pydantic import BaseModel
from typing import Optional


class ScoreBreakdown(BaseModel):
    consistency_score: float
    evidence_score: float
    policy_score: float
    final_score: float


class STPDecision(BaseModel):
    decision: str           # AUTO_APPROVE / MANUAL_REVIEW / REJECT
    score_breakdown: ScoreBreakdown
    reason: str


class ReviewDecision(BaseModel):
    decision: str           # approve / reject
    reviewer_name: str
    notes: Optional[str] = None


class ReviewQueueItem(BaseModel):
    claim_id: str # MongoDB string ID
    claim_type: str
    claimant_name: str
    claimant_email: str
    policy_number: str
    description: str
    final_score: float
    created_at: str

    class Config:
        from_attributes = True
