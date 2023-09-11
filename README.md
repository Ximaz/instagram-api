# Instagram API

This project is an Instagram API guest-oriented, meaning you can perform actions of data collection without having to register. However, you may be facing some Ratelimits, so I recommend you to put some delay between operations.

## Licence
Licence can be found at ``LICENCE``, it's ``GNU GPLv3``.

## Documentation

```python
# from src.api import API

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

    def fetch_user_metadata(self) -> dict: ...

    def fetch_posts(self, first: int = 12, after: str = None) -> dict: ...

    def fetch_highlights(self) -> dict: ...

    def fetch_reels(self, page_size: int = 12, max_id: str = None) -> dict: ...

    def fetch_post_metadata(self, shortcode: str) -> dict: ...

    def export_api(self, writable_stream: io.BytesIO): ...

```