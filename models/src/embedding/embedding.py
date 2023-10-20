import os
import numpy as np
import pandas as pd 
import torch
import torchvision.transforms as T
from transformers import AutoFeatureExtractor, AutoModel

from constants import VISION_TRANSFORMER_CKPT, DEVICE


extractor = AutoFeatureExtractor.from_pretrained(VISION_TRANSFORMER_CKPT)
model = AutoModel.from_pretrained(VISION_TRANSFORMER_CKPT)
hidden_dim = model.config.hidden_size
transformation_chain = T.Compose( #Does a bunch of modifications to the images in the dataset 
[
    # We first resize the input image to 256x256 and then we take center crop.
    T.Resize(int((256 / 224) * extractor.size["height"])),
    T.CenterCrop(extractor.size["height"]),
    T.ToTensor(),
    T.Normalize(mean=extractor.image_mean, std=extractor.image_std),
]
)

def _transform_images(images):
    transformation_chain = T.Compose( #Does a bunch of modifications to the images in the dataset 
    [
    # We first resize the input image to 256x256 and then we take center crop.
    T.Resize(int((256 / 224) * extractor.size["height"])),
    T.CenterCrop(extractor.size["height"]),
    T.ToTensor(),
    T.Normalize(mean=extractor.image_mean, std=extractor.image_std),
    ]
)

    processed_images = torch.stack([transformation_chain(image) for image in images])
    return processed_images

def extract_embeddings(model: torch.nn.Module):
    """Utility to compute embeddings."""
    device = model.device

    def pp(batch): #preprocessing
        images = batch["image"]
        # image_batch_transformed = torch.stack([transformation_chain(image) for image in images])
        image_batch_transformed = _transform_images(images)
        new_batch = {"pixel_values": image_batch_transformed.to(device)} #creates a batch with the modified images
        with torch.no_grad():
            embeddings = model(**new_batch).last_hidden_state[:, 0].cpu() #inference with cpu, creates embeddings from images
        return {"embeddings": embeddings}

    return pp

extract_fn = extract_embeddings(model.to(DEVICE))

def add_embeddings(extraction_function, hf_dataset):
    hf_dataset_w_embeddings = hf_dataset.map(extraction_function, batched=True, batch_size=len(hf_dataset["image"]))
    return hf_dataset_w_embeddings
