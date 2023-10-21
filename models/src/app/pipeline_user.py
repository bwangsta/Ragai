import os 
import requests
import uuid
import json
from PIL import Image
from io import BytesIO
from pymongo import MongoClient
from pymongo.server_api import ServerApi


from src.tagging.tagging import create_tags
from src.embedding.hfdataset_processing import create_dict_from_image, create_hf_ds_from_dict, add_image_to_hf_dataset
from src.embedding.search import add_faiss_index_to_hfdataset, find_k_most_similar

from src.embedding.embedding import add_embeddings, extract_embeddings
from transformers import AutoFeatureExtractor, AutoModel
from datasets import Dataset

from constants import VISION_TRANSFORMER_CKPT, DEVICE
extractor = AutoFeatureExtractor.from_pretrained(VISION_TRANSFORMER_CKPT)
model = AutoModel.from_pretrained(VISION_TRANSFORMER_CKPT)
hidden_dim = model.config.hidden_size
extract_fn = extract_embeddings(model.to(DEVICE))


from dotenv import load_dotenv

load_dotenv()

namespace = uuid.NAMESPACE_URL
uri = os.environ["DB_URI"]
client = MongoClient(uri, server_api=ServerApi('1'))
db = client.clothing
collection = db.items

def search_k_most_similar_items(image_uri, hf_dataset, k = 5):
    response = requests.get(image_uri)
    img_data = BytesIO(response.content)
    # Open and display the image using PIL
    img = Image.open(img_data)
    new_item_dict = create_dict_from_image(img, create_tags_and_desc=False)
    new_item_dict['image_uri'] = [image_uri]
    new_item_dict['random_id'] = [uuid.uuid5(namespace, image_uri).hex]
    new_item_hf_dataset = create_hf_ds_from_dict(new_item_dict)
    new_item_hf_dataset = add_embeddings(extract_fn, new_item_hf_dataset)
    hf_dataset_w_user_image = add_image_to_hf_dataset(new_item_hf_dataset, hf_dataset)
    hf_dataset_w_user_image = add_faiss_index_to_hfdataset(hf_dataset_w_user_image)
    k_most_similar_items = find_k_most_similar(hf_dataset_w_user_image, k)
    k_most_similar_items = {key: value[1:] for key, value in k_most_similar_items.items()}
    del k_most_similar_items['image']
    with open('most_similar_items.json', 'w') as json_file:
        json.dump(k_most_similar_items, json_file)
    return k_most_similar_items
