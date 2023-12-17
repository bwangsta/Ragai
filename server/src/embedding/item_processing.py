import pandas as pd
import uuid
from src.prompting.cleaning import clean_tags, generate_description
from src.tagging.tagging import create_tags
from src.embedding.embedding import get_single_image_embedding, get_image

def create_single_item_from_image(image_url):
    embeddings = get_single_image_embedding(get_image(image_url))[0].tolist()
    unique_id = uuid.uuid4().hex
    metadata = {}
    metadata['url'] = image_url
    metadata['tags'] = clean_tags(create_tags(image_url))
    metadata['desc'] = generate_description(image_url)
    item = {'id': unique_id, 'values': embeddings, 'metadata':metadata}
    return [item] 

def create_items_from_df(df_items):
    items_dict = df_items[['id', 'values', 'metadata']].to_dict(orient='records')    
    return items_dict


def create_items_from_image_urls(url_list):

    df_items = pd.DataFrame({'url': url_list, 'desc': [generate_description(url) for url in url_list], 'tags':[clean_tags(create_tags(url)) for url in url_list], 'values':[get_single_image_embedding(get_image(url))[0].tolist() for url in url_list], 'id': [uuid.uuid4().hex for _ in range(len(url_list))]})
    # df_items['values'] = df_items['url'].map(lambda x: get_single_image_embedding_from_url(x))
    # df_items['id'] = 
    df_items['metadata'] = df_items.apply(lambda row: {'url': row['url'], 'desc': row['desc'], 'tags':row['tags']}, axis=1)
    items_dict = create_items_from_df(df_items)

    return items_dict

