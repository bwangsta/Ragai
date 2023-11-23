import os
import ibm_boto3
from ibm_botocore.client import Config

s3 = ibm_boto3.client(
    "s3",
    ibm_api_key_id=os.environ["API_KEY_ID"],
    ibm_service_instance_id=os.environ["SERVICE_INSTANCE_ID"],
    config=Config(signature_version="oauth"),
    endpoint_url=os.environ["ENDPOINT"]
)
