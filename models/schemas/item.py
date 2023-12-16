from pydantic import BaseModel
from datetime import datetime


class Metadata(BaseModel):
    desc: str
    tags: list[str]
    url: str


class Item(BaseModel):
    id: str
    metadata: Metadata
    score: float = 0.0
    values: list[float]
