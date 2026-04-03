from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)

def compute_final_score(consistency: float, evidence: float, policy: float) -> dict:
    """
    Final Score Calculation:
    0.20 * Consistency + 0.20 * Evidence + 0.60 * Policy
    
    Returns: { 
        "consistency_score": float, 
        "evidence_score": float, 
        "policy_score": float, 
        "final_score": float 
    }
    """
    try:
        # Use user-defined weights (0.2, 0.2, 0.6)
        # Final Score = (0.2 * C) + (0.2 * E) + (0.6 * P)
        
        final_score = (
            (settings.consistency_weight * consistency) +
            (settings.evidence_weight * evidence) +
            (settings.policy_weight * policy)
        )
        
        scores = {
            "consistency_score": round(consistency, 4),
            "evidence_score": round(evidence, 4),
            "policy_score": round(policy, 4),
            "final_score": round(final_score, 4)
        }
        
        logger.info(f"Final combined score: {scores['final_score']}")
        return scores
        
    except Exception as e:
        logger.error(f"Final scoring error: {e}")
        return {
            "consistency_score": 0.0,
            "evidence_score": 0.0,
            "policy_score": 0.0,
            "final_score": 0.0
        }
