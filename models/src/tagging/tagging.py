from google.cloud import vision

def create_tags(img_uri) -> vision.EntityAnnotation:

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
