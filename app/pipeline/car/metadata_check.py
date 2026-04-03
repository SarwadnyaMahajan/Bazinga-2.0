from PIL import Image
from PIL.ExifTags import TAGS
from app.utils.logger import get_logger

logger = get_logger(__name__)

EDITING_SOFTWARE = [
    "photoshop", "lightroom", "gimp", "snapseed", "picsart",
    "pixlr", "facetune", "afterlight", "vsco"
]


def check_metadata(filepath: str) -> tuple[bool, str]:
    """
    Only checks for known editing software in EXIF.
    No EXIF = pass (gallery photos, browser uploads are fine).
    """
    try:
        img = Image.open(filepath)
        exif_data = img._getexif()

        if exif_data is None:
            logger.info("No EXIF data — passing through.")
            return True, "Metadata check passed."

        exif = {TAGS.get(k, k): v for k, v in exif_data.items()}
        software = str(exif.get("Software", "")).lower()

        for editor in EDITING_SOFTWARE:
            if editor in software:
                return False, f"Image appears edited with {software}. Please upload an original photo."

        return True, "Metadata check passed."

    except Exception as e:
        logger.warning(f"Metadata check skipped: {e}")
        return True, "Metadata check skipped."
