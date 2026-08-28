import os
from pymongo import MongoClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

# Short serverSelectionTimeoutMS prevents blocking backend startup when MongoDB is not running
client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=1000)
db = client["krishirakshak"]

farmers_collection = db["farmers"]


def check_mongo_connection() -> bool:
    try:
        client.admin.command("ping")
        return True
    except Exception:
        return False
from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"

# Keep MongoDB connection optional during local development.
client = MongoClient(
    MONGO_URL,
    serverSelectionTimeoutMS=2000
)

db = client["krishirakshak"]

farmers_collection = db["farmers"]

try:
    client.admin.command("ping")
    print("MongoDB connected successfully!")
except Exception:
    print("MongoDB not running - continuing without database.")
