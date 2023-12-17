import os 
import requests
import uuid
import json
from PIL import Image
from io import BytesIO

from src.tagging.tagging import create_tags
from src.embedding.search import add_faiss_index_to_hfdataset, find_k_most_similar
from src.embedding.search import get_most_similar_items
from src.embedding.embedding import get_image, get_single_image_embedding

from dotenv import load_dotenv

load_dotenv()

def get_most_similar_items_user(image_url, index, k, namespace=None): #gotta find a better way to do this 
    return get_most_similar_items(image_url, index, k, namespace=namespace) 
