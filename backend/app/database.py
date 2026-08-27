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