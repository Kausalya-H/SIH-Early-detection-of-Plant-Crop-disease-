import os
from pymongo import MongoClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=2000)
db = client["krishirakshak"]

# Collections
users_collection = db["users"]
farms_collection = db["farms"]
crops_collection = db["crops"]
reports_collection = db["disease_reports"]
farmers_collection = db["farmers"]  # keep old one for backwards compat

def check_mongo_connection():
    try:
        client.admin.command("ping")
        return True
    except Exception:
        return False

try:
    client.admin.command("ping")
    print("MongoDB connected successfully!")
except Exception:
    print("MongoDB not running - continuing without database.")
