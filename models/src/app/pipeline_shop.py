import os 
import requests
import uuid
import pinecone
from PIL import Image
from io import BytesIO

from src.embedding.search import get_most_similar_items
from src.embedding.item_processing import create_single_item_from_image
from src.embedding.vdb_index import add_items_to_index
from src.tagging.tagging import create_tags

from constants import INDEX


from dotenv import load_dotenv

load_dotenv()
namespace = uuid.NAMESPACE_URL


index = pinecone.Index('clothes1')



def add_single_item_to_inventory(image_url, index, namespace):
    item = create_single_item_from_image(image_url)
    add_items_to_index(item, index, namespace)

def delete_with_most_similar_picture(image_url, index, namespace):
    item_to_delete = get_most_similar_items(image_url, index, k=1)
    id_to_delete = item_to_delete['matches'][0]['id']
    delete_response = index.delete(ids=[id_to_delete], namespace=namespace)
