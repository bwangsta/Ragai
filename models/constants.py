import os
from dotenv import load_dotenv


load_dotenv()


LLM_URL="https://us-south.ml.cloud.ibm.com"
LLM_ID="google/flan-ul2"
DEFAULT_LLM_PARAMS={
    "decoding_method": "greedy",
    "max_new_tokens": 20,
    "repetition_penalty": 1
}
CREDENTIALS = {
    "url"    : LLM_URL,
    "apikey" : os.getenv('LLM_API_KEY')
}
GEN_PARAMS   = None
SPACE_ID    = None
VERIFY      = False
TAGS_PROMPT=f"""prompt_input = 
Given a list of tags, generate a new list of cleaned tags that only include the wearable aspects of a garment, such as type, color, pattern, material, etc. Exclude woman. Exclude words related to the human body  such as "muscle", "skin" or limbs. 
Exclude other body parts or body areas such as "waist", or "hip". 
Exclude things like the words “garment” and “image,” the items in the background, the person wearing the garment, etc.
If there are similar tags like “shirt,” “t shirt,” “t-shirt,” “tee,” only keep “t-shirt”. Or tags like “pants” and “pant,” only keep “pants.” If both the “jeans” and “pant” or “pants” tags are present, only keep “jeans.” 
If both the “dress shirt” and “shirt” tags are present, only keep “dress shirt.”
If the list of tags doesn't contain anything related to clothing, return "No relevant tags found".
Format the cleaned tags as a list of items separated by |.  The list of tags has to be suited for ecommerce websites.
Here are some examples:
EXAMPLE 1
Tags: blue | wall | closet | clothesline | hang | hanger | room | shirt | t shirt | t-shirt | tee | face
Cleaned tags: blue | t-shirt
EXAMPLE 2
Tags: button | dress shirt | garment | neckband | shirt | sleeve | white
Cleaned tags: dress shirt | sleeve | white
EXAMPLE 3
Tags: pant | pants | pink | waist 
Cleaned tags: pants | pink 
Now try:
Tags:"""
DESCRIPTION_PROMPT=f"""Given a list of cleaned tags, create a short product description for an e-commerce fashion brand and capitalize the first letter. 
Cleaned tags:"""
VISION_TRANSFORMER_CKPT="google/vit-base-patch16-224-in21k"
DEVICE="cpu"

