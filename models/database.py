import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi

uri = os.environ["DB_URI"]
ca = certifi.where()

client = MongoClient(uri, server_api=ServerApi("1"), tlsCAFile=ca)
