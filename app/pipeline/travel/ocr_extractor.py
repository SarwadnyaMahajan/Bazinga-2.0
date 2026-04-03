import re
from app.utils.logger import get_logger

logger = get_logger(__name__)

try:
    import easyocr
    _reader = None

    def get_reader():
        global _reader
        if _reader is None:
            _reader = easyocr.Reader(["en"], gpu=False)
        return _reader

except ImportError:
    logger.warning("EasyOCR not installed. OCR will return mock data.")
    get_reader = None


def run_ocr(image_path: str) -> dict:
    """
    Runs OCR on the travel document image.
    Returns: { "extracted_fields": {...}, "confidence": float, "raw_text": str }
    """
    try:
        if get_reader is None:
            raise ImportError("EasyOCR not available")

        reader = get_reader()
        results = reader.readtext(image_path)

        if not results:
            return {"extracted_fields": {}, "confidence": 0.0, "raw_text": ""}

        raw_text = " ".join([text for _, text, _ in results])
        avg_confidence = sum(conf for _, _, conf in results) / len(results)

        extracted = _parse_fields(raw_text)

        logger.info(f"OCR extracted fields: {list(extracted.keys())} | confidence: {avg_confidence:.2f}")

        return {
            "extracted_fields": extracted,
            "confidence": round(avg_confidence, 4),
            "raw_text": raw_text
        }

    except Exception as e:
        logger.error(f"OCR error: {e}")
        return {"extracted_fields": {}, "confidence": 0.0, "raw_text": "", "error": str(e)}


def _parse_fields(text: str) -> dict:
    """Extract key fields from raw OCR text using simple patterns."""
    fields = {}

    # Amount patterns: $1,234.56 or INR 5000 or Rs. 2500
    amount_match = re.search(r"(?:rs\.?|inr|usd|\$|€|£)\s*([\d,]+\.?\d*)", text, re.IGNORECASE)
    if amount_match:
        fields["amount"] = amount_match.group(1).replace(",", "")

    # Date pattern
    date_match = re.search(r"\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b", text)
    if date_match:
        fields["date"] = date_match.group(1)

    # Flight/booking number
    booking_match = re.search(r"\b([A-Z]{2}\d{3,6}|[A-Z0-9]{6,8})\b", text)
    if booking_match:
        fields["booking_ref"] = booking_match.group(1)

    # Airline name (common ones)
    airlines = ["indigo", "air india", "spicejet", "vistara", "emirates", "lufthansa", "british airways"]
    for airline in airlines:
        if airline in text.lower():
            fields["airline"] = airline.title()
            break

    return fields
