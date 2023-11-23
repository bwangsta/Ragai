from dotenv import load_dotenv
import os
import requests
import uuid
from PIL import Image
from io import BytesIO

from src.prompting.cleaning import clean_tags, generate_description
from src.embedding.hfdataset_processing import create_dict_from_image, create_dict_from_image2, create_hf_ds_from_dict, add_image_to_hf_dataset
from src.embedding.search import add_faiss_index_to_hfdataset
from src.embedding.embedding import add_embeddings, extract_embeddings
from src.tagging.tagging import create_tags

from transformers import AutoFeatureExtractor, AutoModel
from datasets import Dataset

from constants import VISION_TRANSFORMER_CKPT, DEVICE
extractor = AutoFeatureExtractor.from_pretrained(VISION_TRANSFORMER_CKPT)
model = AutoModel.from_pretrained(VISION_TRANSFORMER_CKPT)
hidden_dim = model.config.hidden_size
extract_fn = extract_embeddings(model.to(DEVICE))


load_dotenv()
namespace = uuid.NAMESPACE_URL

# def create_hf_ds_from_db(collection):
#     test_brian_hf_dataset = Dataset.from_dict({})
#     for item in collection.find():
#         image_uri = item["image"]
#         response = requests.get(image_uri)
#         img_data = BytesIO(response.content)
#         # Open and display the image using PIL
#         img = Image.open(img_data)
#         brian_setup_dict = create_dict_from_image(img)
#         brian_setup_dict['image_uri'] = [image_uri]
#         brian_setup_dict['image'] = [img]
#         brian_setup_dict['random_id'] = [uuid.uuid5(namespace, image_uri).hex]
#         brian_setup_hf_dataset = create_hf_ds_from_dict(brian_setup_dict)
#         test_brian_hf_dataset = add_image_to_hf_dataset(brian_setup_hf_dataset, test_brian_hf_dataset)

#     test_brian_hf_dataset = add_embeddings(extract_fn, test_brian_hf_dataset)
#     return test_brian_hf_dataset


def create_hf_ds_from_db(collection):
    test_brian_hf_dataset = Dataset.from_dict({})
    size = 0
    for item in collection.find():
        image_uri = item["image"]
        response = requests.get(image_uri)
        img_data = BytesIO(response.content)
        # Open and display the image using PIL
        img = Image.open(img_data)
        brian_setup_dict = create_dict_from_image2(img)
        brian_setup_dict['image_uri'] = [image_uri]
        brian_setup_dict['random_id'] = [uuid.uuid5(namespace, image_uri).hex]
        brian_setup_hf_dataset = create_hf_ds_from_dict(brian_setup_dict)
        test_brian_hf_dataset = add_image_to_hf_dataset(
            brian_setup_hf_dataset, test_brian_hf_dataset)
        size += 1

    if size > 0:
        test_brian_hf_dataset = add_embeddings(
            extract_fn, test_brian_hf_dataset)

    return test_brian_hf_dataset


# def add_item_to_inventory(image_uri, shop_hf_ds, return_new_item_json=False):

#     response = requests.get(image_uri)
#     img_data = BytesIO(response.content)
#     # Open and display the image using PIL
#     img = Image.open(img_data)
#     new_item_dict = create_dict_from_image(img)
#     new_item_dict['image_uri'] = [image_uri]
#     new_item_dict['random_id'] = [uuid.uuid5(namespace, image_uri).hex]
#     new_item_dict['tags'] = [clean_tags(''.join(map(str,create_tags(image_uri))))]
#     new_item_dict['description'] = [generate_description(new_item_dict['tags'][0])]
#     new_item_hf_dataset = create_hf_ds_from_dict(new_item_dict)
#     new_item_hf_dataset = add_embeddings(extract_fn, new_item_hf_dataset)
#     # new_item_hf_dataset = add_faiss_index_to_hfdataset(new_item_hf_dataset)
#     new_item_hf_dataset_df = new_item_hf_dataset.to_pandas()
#     cols = new_item_hf_dataset_df.columns.to_list()
#     if "image" in cols:
#         cols.remove("image")
#     new_item_json = new_item_hf_dataset_df[cols].to_json(orient='records')
#     hf_ds_w_new_item = add_image_to_hf_dataset(new_item_hf_dataset, shop_hf_ds)
#     # if return_new_item_json:

#     #     return hf_ds_w_new_item, new_item_json
#     # else:
#     #     return hf_ds_w_new_item
#     return new_item_json

def add_item_to_inventory(image_uri, shop_hf_ds):
    response = requests.get(image_uri)
    img_data = BytesIO(response.content)
    # Open and display the image using PIL
    img = Image.open(img_data)
    new_item_dict = create_dict_from_image2(img)
    new_item_dict['image_uri'] = [image_uri]
    new_item_dict['random_id'] = [uuid.uuid5(namespace, image_uri).hex]
    # new_item_dict['tags'] = [clean_tags(''.join(map(str,create_tags(image_uri))))]
    # new_item_dict['description'] = [generate_description(new_item_dict['tags'][0])]

    new_item_hf_dataset = create_hf_ds_from_dict(new_item_dict)
    new_item_hf_dataset = add_embeddings(extract_fn, new_item_hf_dataset)
    # new_item_hf_dataset = add_faiss_index_to_hfdataset(new_item_hf_dataset)
    new_item_hf_dataset_df = new_item_hf_dataset.to_pandas()
    cols = new_item_hf_dataset_df.columns.to_list()
    if "image" in cols:
        cols.remove("image")
    new_item_json = new_item_hf_dataset_df[cols].to_json(orient='records')
    hf_ds_w_new_item = add_image_to_hf_dataset(new_item_hf_dataset, shop_hf_ds)
    hf_ds_w_new_item = add_faiss_index_to_hfdataset(hf_ds_w_new_item)
    # if return_new_item_json:

    #     return hf_ds_w_new_item, new_item_json
    # else:
    #     return hf_ds_w_new_item
    return new_item_json
