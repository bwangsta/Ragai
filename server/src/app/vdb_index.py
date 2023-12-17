import pinecone      

def add_items_to_index(items, index, namespace):
    index.upsert(vectors=items, namespace=namespace)

def delete_with_id(id, index, namespace):
    delete_response = index.delete(ids=[id], namespace=namespace)
