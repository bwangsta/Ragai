from pydantic import BaseModel
from datetime import datetime


class Metadata(BaseModel):
    desc: str
    tags: list[str]
    url: str


class Item(BaseModel):
    id: str
    metadata: Metadata
    score: float
    values: list[float]
