from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import uuid
import os

load_dotenv()
from routers import images, items, models


app = FastAPI()
namespace = uuid.NAMESPACE_URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(images.router)
app.include_router(items.router)
app.include_router(models.router)

if __name__ == "__main__":
    uvicorn.run(app="main:app", reload=True, host=os.environ["HOST"])
