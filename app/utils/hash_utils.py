import hashlib


def compute_image_hash(filepath: str) -> str:
    """Compute SHA256 hash of an image file for duplicate detection."""
    sha256 = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            sha256.update(chunk)
    return sha256.hexdigest()
