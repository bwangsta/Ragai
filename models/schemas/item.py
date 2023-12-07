from pydantic import BaseModel
from datetime import datetime


class Item(BaseModel):
    _id: str
    name: str
    image: str
    tags: list[str]
    embeddings: list[float]
    created_at: datetime = datetime.now()
