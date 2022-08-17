import os
import json
import store
import models
from typing import Union
from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware


app = FastAPI()
store = store.Store()


host = os.getenv("DETA_SPACE_APP_HOSTNAME")
origin = f"https://{host}"
origins = [origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

"""
Routes
"""


@app.get("/")
def hello():
    return {"msg": "hello from dock backend api!! 🦍"}


@app.get("/primary")
def primary_micro():
    return {"primary": origins}


@app.post("/api/add", status_code=201)
async def add_post(request: Request):
    body = await request.body()
    post = models.Post.parse_obj(json.loads(body))
    res = store.add(post.content)
    return res


@app.get("/api/fetch")
async def fetch_posts(limit: int = 10, last: Union[str, None] = None):
    # res = store.fetch(last, limit)
    res = store.fetch_all()
    return res

@app.get("/api/fetch/{key}")
async def fetch_post(key: str):
    res = store.get(key)
    return res

@app.get("/api/delete/{key}")
def delete_post(key: str):
    return store.delete(key)
