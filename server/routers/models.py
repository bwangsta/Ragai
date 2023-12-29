from fastapi import APIRouter
from pydantic import BaseModel
import uuid
from src.prompting.cleaning import clean_tags, generate_description
from src.tagging.tagging import create_tags
from src.embedding.embedding import get_single_image_embedding, get_image

router = APIRouter(prefix="/models", tags=["models"])


class Image(BaseModel):
    url: str


class ModelResponse(BaseModel):
    id: str
    tags: list[str]
    description: str
    embeddings: list[float]


@router.post("/", response_model=ModelResponse)
def send_image_to_model(image: Image):
    id = uuid.uuid4().hex
    tags = clean_tags(create_tags(image.url))
    tags_array = tags.split("|")
    formatted_tags = [tag.strip().lower() for tag in tags_array]
    description = generate_description(image.url)
    embeddings = get_single_image_embedding(get_image(image.url))[0].tolist()
    return {
        "id": id,
        "tags": formatted_tags,
        "description": description,
        "embeddings": embeddings,
    }
