from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


class Database:
    client: AsyncIOMotorClient = None
    db = None


db = Database()


async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.mongo_uri)
    db.db = db.client[settings.mongo_db_name]
    logger.info(f"Connected to MongoDB: {settings.mongo_db_name}")


async def close_mongo_connection():
    db.client.close()
    logger.info("Closed MongoDB connection.")


def get_database():
    return db.db
