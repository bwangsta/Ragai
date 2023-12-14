from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid

load_dotenv()
from routers import images, items


# class Image(BaseModel):
#     url: str


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

# @app.post("/image")
# def post_image(image: Image):
#     return add_item_to_inventory(image.url, hf_dataset)
