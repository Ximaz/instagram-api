import io
import json

import requests

try:
    from .fetch_requirements import Identity, BASE_HEADERS
except ImportError:
    from fetch_requirements import Identity, BASE_HEADERS

class API:
    """
    The API class provides the necessary data to perform Instagram API web requests.

    To prevent flooding Instagram requests for the same target API, you can use the
    `export_api` function to create an API cache.

    You can also load a previous API cache using the 'load_from' constructor parameter.
    """

    def __init__(self, username: str = None, load_from: dict = None):
        """
        API constructor

        :param username: The target's account usrename. Used for fresh API.
        :type username: str

        :param load_from: The Identity class in self.__dict__() format. Used for cache API.
        :type load_from: dict
        """

        if load_from is not None:
            self.__identity = Identity(load_from=load_from, username=None)
        elif load_from is None and username is not None:
            self.__identity = Identity(username=username, load_from=None)
        else:
            raise Exception("You must either supply a username or a valid cache.")
        
        self.__session = requests.Session()
        self.__session.headers = BASE_HEADERS.copy()

        self.__session.headers = {**self.__session.headers, **self.identity.build_headers()}

    @property
    def identity(self) -> Identity:
        return self.__identity
    
    @property
    def session(self) -> requests.Session:
        return self.__session

    def fetch_user_metadata(self) -> dict:
        url = "https://www.instagram.com/api/v1/users/web_profile_info/"
        response = self.session.get(url, params={
            "username": self.identity.username
        })
        response.raise_for_status()
        return response.json()
    
    def fetch_posts(self, first: int = 12, after: str = None) -> dict:
        url = "https://www.instagram.com/graphql/query/"
        response = self.session.get(url, params={
            "doc_id": self.identity.doc_ids["PolarisProfilePostsActions"][0],
            "variables": json.dumps({
                "id": self.identity.target_id,
                "after": after,
                "first": first
            })
        })
        response.raise_for_status()
        return response.json()
    
    def fetch_highlights(self) -> dict:
        url = "https://www.instagram.com/graphql/query/"
        response = self.session.get(url, params={
            "doc_id": self.identity.doc_ids["PolarisProfilePostsActions"][1],
            "variables": json.dumps({
                "include_chaining": True,
                "include_highlight_reels": True,
                "include_live_status": True,
                "include_logged_out_extras": True,
                "include_reel": True,
                "include_suggested_users": True,
                "user_id": self.identity.target_id
            })
        })
        response.raise_for_status()
        return response.json()

    def fetch_reels(self, page_size: int = 12, max_id: str = None) -> dict:
        url = "https://www.instagram.com/api/v1/clips/user/"
        data = {
            "include_feed_video": True,
            "page_size": page_size,
            "target_user_id": self.identity.target_id
        }
        if max_id is not None:
            data["max_id"] = max_id
        response = self.session.post(url, headers={
            "Content-Type": "application/x-www-form-urlencoded"
        }, data=data)
        response.raise_for_status()
        return response.json()

    def fetch_post_metadata(self, shortcode: str) -> dict:
        url = "https://www.instagram.com/graphql/query/"
        response = self.session.get(url, params={
            "doc_id": self.identity.doc_ids["PolarisPostActionLoadPost"][0],
            "variables": json.dumps({
                "child_comment_count": 3,
                "fetch_comment_count": 40,
                "has_threaded_comments": True,
                "parent_comment_count": 24,
                "shortcode": shortcode
            })
        })
        response.raise_for_status()
        return response.json()

    def export_api(self, writable_stream: io.BytesIO):
        if not writable_stream.writable():
            print("[WARN] Unable to write data.")
            return
        
        json.dump(dict(self.__identity), writable_stream)
