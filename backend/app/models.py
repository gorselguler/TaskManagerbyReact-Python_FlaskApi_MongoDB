from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to MongoDB
# We read the connection string from a .env file (keeps secrets safe)
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017')

client = MongoClient(MONGO_URI)
db = client['taskmanager']       # Database name
tasks_collection = db['tasks']  # Collection (like a table) name
users_collection = db['users']  # User collection for Auth
