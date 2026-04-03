from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Union, Dict, Literal
from datetime import datetime
import enum

# Car Damage Classes (23)
CAR_DAMAGE_CLASSES = Literal[
    "bonnet-dent", 
    "doorouter-dent", 
    "doorouter-paint-trace", 
    "doorouter-scratch", 
    "fender-dent", 
    "front-bumper-dent", 
    "front-bumper-scratch", 
    "Front-Windscreen-Damage", 
    "Headlight-Damage", 
    "Major-Rear-Bumper-Dent", 
    "medium-Bodypanel-Dent", 
    "paint-chip", 
    "paint-trace", 
    "pillar-dent", 
    "quaterpanel-dent", 
    "rear-bumper-dent", 
    "rear-bumper-scratch", 
    "Rear-windscreen-Damage", 
    "roof-dent", 
    "RunningBoard-Dent", 
    "Sidemirror-Damage", 
    "Signlight-Damage", 
    "Taillight-Damage"
]

# Travel Damage Classes (3)
TRAVEL_DAMAGE_CLASSES = Literal[
    "Luggage Lost", 
    "Flight Delay", 
    "Flight Cancellation"
]

class ClaimType(str, enum.Enum):
    car = "car"
    travel = "travel"

class ClaimStatus(str, enum.Enum):
    pending = "pending"
    auto_approved = "auto_approved"
    manual_review = "manual_review"
    rejected = "rejected"
    settled = "settled"

class CarIntake(BaseModel):
    selected_damage: str
    description: str
    reported_damage_type: Optional[str] = None # For legacy compatibility

class TravelIntake(BaseModel):
    selected_category: str
    description: str
    trip_origin: str
    trip_destination: str
    travel_date: str

class Metadata(BaseModel):
    gps: Optional[str] = None
    timestamp: Optional[datetime] = None
    is_edited: Optional[bool] = False

class Claim(BaseModel):
    claim_type: ClaimType
    claimant_name: str
    claimant_email: EmailStr
    claimant_telegram_id: Optional[str] = None
    policy_number: str
    
    # Intake Data (Form Fields)
    intake_data: Union[CarIntake, TravelIntake]
    
    # Evidence Info
    evidence_path: Optional[str] = None
    image_hash: Optional[str] = None
    
    # AI Extraction Results
    extraction_results: Dict = {}
    
    # Scores
    consistency_score: Optional[float] = None
    evidence_score: Optional[float] = None
    policy_score: Optional[float] = None
    estimated_amount: Optional[float] = None
    final_score: Optional[float] = None
    
    # Decision & Reasoning
    status: ClaimStatus = ClaimStatus.pending
    stp_decision: Optional[str] = None
    rejection_reason: Optional[str] = None
    groq_reasoning: Optional[str] = None
    
    # Settlement
    transaction_id: Optional[str] = None
    settlement_amount: Optional[float] = None
    
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
