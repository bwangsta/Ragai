import requests
import torch
from PIL import Image
from io import BytesIO
from torchvision import models, transforms
from torchvision.models import VGG11_Weights


weights = VGG11_Weights.DEFAULT
model = models.vgg11(weights=weights)
model.classifier = model.classifier[:-1]
model.eval()



def get_image(image_URL):

    response = requests.get(image_URL)
    image = Image.open(BytesIO(response.content)).convert("RGB")

    return image

def preprocess_image(image):
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    image = preprocess(image).unsqueeze(0)
    return image

def get_single_image_embedding(image):

  image = preprocess_image(image)
  with torch.no_grad():
    embeddings = model(image)

  # convert the embeddings to numpy array
  embedding_as_np = embeddings.cpu().detach().numpy()

  return embedding_as_np
