"""
ml_models/ocr/engine.py
EasyOCR wrapper — lazy loads the reader on first use.
"""
from app.utils.logger import get_logger

logger = get_logger(__name__)

_reader = None


def get_ocr_reader():
    global _reader
    if _reader is None:
        try:
            import easyocr
            logger.info("Loading EasyOCR reader (first use — may take a moment)...")
            _reader = easyocr.Reader(["en"], gpu=False)
            logger.info("EasyOCR reader loaded.")
        except ImportError:
            logger.error("EasyOCR not installed. Run: pip install easyocr")
            raise
    return _reader


def read_image(image_path: str) -> list:
    """
    Returns list of (bbox, text, confidence) tuples.
    """
    reader = get_ocr_reader()
    return reader.readtext(image_path)
