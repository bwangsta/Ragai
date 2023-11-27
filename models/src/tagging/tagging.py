from google.cloud import vision
from gradio_client import Client

def create_tags2(img_uri) -> vision.EntityAnnotation:

    # Instantiates a client
    client = vision.ImageAnnotatorClient()

    image = vision.Image()
    image.source.image_uri = img_uri 

    # Performs label detection on the image file
    response = client.label_detection(image=image)
    labels = response.label_annotations

    print("Labels:")
    tags = []
    for label in labels:
        tags.append(label.description)
    return tags


def create_tags(img_uri):

    client = Client("https://xinyu1205-recognize-anything.hf.space/")
    tags = client.predict(
                    img_uri,	# str (filepath or URL to image) in 'parameter_5' Image component
                    fn_index=2
    )
    tags = tags[0].split(' | ')
    return tags