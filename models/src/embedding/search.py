import numpy as np
from datasets import Dataset


def add_faiss_index_to_hfdataset(hf_dataset: Dataset) -> Dataset:
    hf_dataset_w_index = hf_dataset.add_faiss_index(column='embeddings')
    return hf_dataset_w_index

def find_k_most_similar(hf_dataset: Dataset, k: int, return_scores=False):
    scores, retrieved_examples = hf_dataset.get_nearest_examples('embeddings', np.array(hf_dataset['embeddings'][0]), k+1)
    if return_scores == True:
        return scores, retrieved_examples
    else: 
        return retrieved_examples    
