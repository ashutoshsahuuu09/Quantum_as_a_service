from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings

client = AsyncIOMotorClient(settings.mongo_uri)
db: AsyncIOMotorDatabase = client[settings.mongo_db]


def users_collection():
    return db["users"]


def projects_collection():
    return db["projects"]
