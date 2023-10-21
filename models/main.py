import os
import uuid
from fastapi import FastAPI
from src.app.pipeline_shop import create_hf_ds_from_db, add_item_to_inventory
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi


app = FastAPI()
ca = certifi.where()
namespace = uuid.NAMESPACE_URL
uri = os.environ["DB_URI"]

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'), tlsCAFile=ca)
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.clothing
collection = db.items

@app.get("/")
def read_root():
    # dataset = create_hf_ds_from_db(collection)
    # print(dataset)
    return {"dataset": "test"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: None):
    return {"item_id": item_id, "q": q}
