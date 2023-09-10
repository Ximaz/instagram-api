try:
    from .fetch_requirements import Identity, BASE_HEADERS
except ImportError:
    from fetch_requirements import Identity, BASE_HEADERS

import re
import requests

class APÏ:
    def __init__(self, target_username: str):
        self.__identity = Identity(target_username=target_username)

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

