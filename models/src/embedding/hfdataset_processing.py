from datasets import concatenate_datasets, Dataset

from src.prompting.cleaning import clean_tags, generate_description
from src.tagging.tagging import create_tags


def create_dict_from_image(image, create_tags_and_desc=False):
    if create_tags_and_desc == True:
        new_item = {
            'image': [image],
            'tags': [clean_tags(create_tags(image))],
            'random_id': [None],
        }
        new_item['description'] = generate_description(new_item['tags'][0])
    else:
        new_item = {
            'image': [image],
            'tags': [None],
            'description': [None],
            'random_id': [None]
        }

    return new_item

def create_hf_ds_from_dict(dict):

    dataset = Dataset.from_dict(dict)
    return dataset

def add_image_to_hf_dataset(single_image_dataset: Dataset, hf_dataset: Dataset) -> Dataset:
    new_dataset = concatenate_datasets([single_image_dataset, hf_dataset])
    return new_dataset
