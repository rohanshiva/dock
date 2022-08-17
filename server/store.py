from deta import Deta
from models import Post
import util
from fastapi.responses import StreamingResponse

deta = Deta()

"""
Store
"""


class Store:
    def __init__(self):
        self._base = deta.Base("dock_posts")

    def add(self, content):
        item = {
            "content": content,
            "key": str(util.now_in_millis()),
        }

        self._base.put(item)
        return item

    def fetch(self, last=None, limit=50, query={}):
        res = self._base.fetch(query=query, limit=limit, last=last)
        return res.items
    
    def get(self, key):
        res = self._base.get(key)
        return res

    def delete(self, key: str):
        self._base.delete(key)
        return key

    def fetch_all(self):
        res = self._base.fetch()
        all_posts = res.items

        while res.last:
            res = self._base.fetch(last=res.last)
            all_posts += res.items
        return all_posts

    def delete_all(self):
        posts = self.fetch_all()
        for post in posts:
            self._base.delete(post["key"])

