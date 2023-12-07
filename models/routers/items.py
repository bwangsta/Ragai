from fastapi import APIRouter
from schemas.item import Item
from database import client

router = APIRouter(prefix="/items", tags=["items"])
db = client.clothing.items


@router.get("", response_model=list[Item])
def get_items():
    try:
        items = db.find()
        return items
    except Exception as e:
        print(e)
