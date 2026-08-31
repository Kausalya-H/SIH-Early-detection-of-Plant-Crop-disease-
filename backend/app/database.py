import os
from pymongo import MongoClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=2000)
db = client["krishirakshak"]

farmers_collection = db["farmers"]
users_collection = db["users"]
farms_collection = db["farms"]
crops_collection = db["crops"]
disease_reports_collection = db["disease_reports"]

try:
    client.admin.command("ping")
    print("MongoDB connected successfully!")
except Exception:
    print("MongoDB not running - continuing without database.")


def check_mongo_connection() -> bool:
    try:
        client.admin.command("ping")
        return True
    except Exception:
        return False
