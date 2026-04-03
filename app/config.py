from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Roboflow
    roboflow_api_key: str = ""
    roboflow_model_id: str = ""
    roboflow_api_url: str = "https://detect.roboflow.com"

    # Groq (LLM for RAG)
    groq_api_key: str = ""
    groq_model_name: str = "llama3-8b-8192"

    # MongoDB
    mongo_uri: str = "mongodb://localhost:27017"
    mongo_db_name: str = "insurance_stp"

    # STP Thresholds
    auto_approve_threshold: float = 0.75
    reject_threshold: float = 0.5

    # Scoring weights (User defined: 0.25*C + 0.35*E + 0.40*P)
    consistency_weight: float = 0.25
    evidence_weight: float = 0.35
    policy_weight: float = 0.40

    # Email
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    email_from: str = ""

    # Telegram
    telegram_bot_token: str = ""
    telegram_reviewer_chat_id: str = ""

    # Upload
    upload_dir: str = "uploads"

    class Config:
        env_file = ".env"


settings = Settings()
