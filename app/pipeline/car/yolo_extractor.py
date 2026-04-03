from inference_sdk import InferenceHTTPClient
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


def run_yolo(image_path: str) -> dict:
    """
    Calls Roboflow inference API using inference_sdk.
    Returns: { "labels": [...], "confidence": float, "raw": {...} }
    """
    try:
        client = InferenceHTTPClient(
            api_url="https://serverless.roboflow.com",
            api_key=settings.roboflow_api_key
        )

        result = client.infer(image_path, model_id=settings.roboflow_model_id)

        predictions = result.get("predictions", [])

        if not predictions:
            logger.warning("YOLO: No damage detected in image.")
            return {"labels": [], "confidence": 0.0, "raw": result}

        labels = list({p["class"] for p in predictions})
        avg_confidence = sum(p["confidence"] for p in predictions) / len(predictions)

        logger.info(f"YOLO detected: {labels} | avg confidence: {avg_confidence:.2f}")

        return {
            "labels": labels,
            "confidence": round(avg_confidence, 4),
            "raw": result
        }

    except Exception as e:
        logger.error(f"Roboflow inference error: {e}")
        return {"labels": [], "confidence": 0.0, "raw": {}, "error": str(e)}
