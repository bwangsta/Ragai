import os
import uuid
from fastapi import FastAPI
from src.app.pipeline_shop import create_hf_ds_from_db, add_item_to_inventory
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from routers import images


class Image(BaseModel):
    url: str


app = FastAPI()
ca = certifi.where()
namespace = uuid.NAMESPACE_URL
uri = os.environ["DB_URI"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(images.router)

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'), tlsCAFile=ca)
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.clothing
collection = db.items
hf_dataset = create_hf_ds_from_db(collection)


@app.post("/image")
def post_image(image: Image):
    return add_item_to_inventory(image.url, hf_dataset)
