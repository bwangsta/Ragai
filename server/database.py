import pinecone
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi
from constants import INDEX


pinecone.init(api_key=os.environ["DATABASE_API_KEY"], environment="gcp-starter")
index = pinecone.Index(INDEX)
