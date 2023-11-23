import os
from io import BytesIO
from fastapi import APIRouter, UploadFile, File
from s3 import s3

router = APIRouter(prefix="/images", tags=["images"])
BUCKET_NAME = os.environ["BUCKET_NAME"]


# Upload image from mobile app to IBM Cloud Object Storage
@router.post("")
async def upload_image(image: UploadFile = File(...)):
    key = os.path.basename(image.filename)
    url = f"{os.environ['ENDPOINT']}/{BUCKET_NAME}/{key}"
    try:
        contents = await image.read()
        with BytesIO(contents) as data:
            s3.upload_fileobj(data, BUCKET_NAME, key)
        print(f"Uploaded image {key}")
    except Exception as e:
        print(e)
        print(f"Failed to upload image {key}")

    return {"key": key, "url": url}


# Uploads temporary images from the website to IBM Cloud Object Storage
@router.post("/upload")
def upload_temporary_image(image: UploadFile = File(...)):
    pass


# Delete image from IBM Cloud Object Storage
@router.delete("/{key}")
def delete_image(key: str):
    try:
        s3.delete_object(Bucket=BUCKET_NAME, Key=key)
        print(f"Deleted image {key}")
    except Exception as e:
        print(e)
        print(f"Failed to delete image {key}")
