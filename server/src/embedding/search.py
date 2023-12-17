from src.embedding.embedding import get_single_image_embedding, get_image

def get_most_similar_items(image_url, index, k, namespace):
    image_query = get_image(image_url)
    query_embedding = get_single_image_embedding(image_query).tolist()
    return index.query(query_embedding, top_k=k, include_metadata=True, namespace=namespace)    
