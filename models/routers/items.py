from fastapi import APIRouter, UploadFile, File
from PIL import Image
from io import BytesIO
from schemas.item import Item
from src.embedding.embedding import get_single_image_embedding
from database import index
from constants import DIMENSIONS

router = APIRouter(prefix="/items", tags=["items"])


# Retrieve all clothing items in database
@router.get("/", response_model=list[Item])
def get_items() -> list[Item]:
    try:
        items = index.query(
            vector=[0] * DIMENSIONS,
            top_k=1000,
            include_values=False,
            include_metadata=True,
        )

        return items.matches
    except Exception as e:
        print(e)


# Add clothing image, description, tags, and embeddings to database
@router.post("/", status_code=201)
def add_item(item: Item):
    # Converts Pydantic Item model into Python dictionary
    item_dict = item.model_dump(exclude={"score"})
    try:
        index.upsert(vectors=[item_dict])
    except Exception as e:
        print(e)


@router.post("/similar", response_model=list[Item])
async def similar_items(file: UploadFile = File(...)) -> list[Item]:
    try:
        contents = await file.read()
        with Image.open(BytesIO(contents)).convert("RGB") as image:
            embeddings = get_single_image_embedding(image)[0].tolist()
        items = index.query(
            vector=embeddings,
            top_k=1000,
            include_values=False,
            include_metadata=True,
        )

        return items.matches
    except Exception as e:
        print(e)
