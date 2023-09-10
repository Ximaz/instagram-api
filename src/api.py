try:
    from .fetch_requirements import Identity, BASE_HEADERS
except ImportError:
    from fetch_requirements import Identity, BASE_HEADERS

import io
import json

import requests

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

    @property
    def identity(self):
        return self.__identity

    def get_metadata(self) -> dict:
        url = "https://www.instagram.com/api/v1/users/web_profile_info/?username={0}".format(self.identity.username)
        headers = BASE_HEADERS.copy()

        headers = {**headers, **self.identity.build_headers()}
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()

    def export_api(self, writable_stream: io.BytesIO):
        if not writable_stream.writable():
            print("[WARN] Unable to write data.")
            return
        
        json.dump(dict(self.__identity), writable_stream)
