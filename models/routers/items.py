from fastapi import APIRouter
from schemas.item import Item
from database import index
from constants import DIMENSIONS

router = APIRouter(prefix="/items", tags=["items"])


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
