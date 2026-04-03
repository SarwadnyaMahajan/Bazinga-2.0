import os
import shutil
from fastapi import UploadFile
from app.config import settings


def save_upload(file: UploadFile, claim_type: str, claim_id: int) -> str:
    """Save uploaded file and return its path."""
    folder = os.path.join(settings.upload_dir, claim_type)
    os.makedirs(folder, exist_ok=True)

    ext = os.path.splitext(file.filename)[-1] or ".jpg"
    filename = f"{claim_id}_{file.filename}"
    filepath = os.path.join(folder, filename)

    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    return filepath
