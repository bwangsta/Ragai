from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
from src.app.pipeline_shop import create_hf_ds_from_db, add_item_to_inventory
from routers import images, items
from database import client


class Image(BaseModel):
    url: str


app = FastAPI()
namespace = uuid.NAMESPACE_URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(images.router)
app.include_router(items.router)

# Create a new client and connect to the server
try:
    client.admin.command("ping")
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.clothing
collection = db.items
hf_dataset = create_hf_ds_from_db(collection)


@app.post("/image")
def post_image(image: Image):
    return add_item_to_inventory(image.url, hf_dataset)
