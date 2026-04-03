from app.utils.logger import get_logger

logger = get_logger(__name__)

def compute_evidence_score(model_output: dict) -> float:
    """
    Evidence Score (E): 
    This is based on the confidence score of the AI extraction.
    
    model_output: { "confidence": float, ... }
    """
    try:
        confidence = model_output.get("confidence", 0.0)
        logger.info(f"Evidence score (Confidence): {confidence}")
        return round(float(confidence), 4)
    except Exception as e:
        logger.error(f"Evidence score error: {e}")
        return 0.0
