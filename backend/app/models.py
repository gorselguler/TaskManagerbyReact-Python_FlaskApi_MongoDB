from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to MongoDB
# We read the connection string from a .env file (keeps secrets safe)
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')

client = MongoClient(MONGO_URI)
db = client['todoapp']          # Database name
todos_collection = db['todos']  # Collection (like a table) name
