from fastapi import APIRouter
from schemas.item import Item
from database import index
from constants import DIMENSIONS

router = APIRouter(prefix="/items", tags=["items"])


# Retrieve all clothing items in database
@router.get("", response_model=list[Item])
def get_items():
    try:
        items = index.query(
            vector=[0] * DIMENSIONS,
            top_k=1000,
            include_values=True,
            include_metadata=True,
        )

        return items.matches
    except Exception as e:
        print(e)


# Add clothing image, description, tags, and embeddings to database
@router.post("", status_code=201)
def add_item_to_database(item: Item):
    # Converts Pydantic Item model into Python dictionary
    item_dict = item.model_dump(exclude={"score"})
    try:
        index.upsert(vectors=[item_dict])
    except Exception as e:
        print(e)
