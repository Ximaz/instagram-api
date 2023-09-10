import json
import random
import re

import requests
from bs4 import BeautifulSoup as soup

B36_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz"

BASE_HEADERS = {
    "Host": "www.instagram.com",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0",
    "Accept": "*/*",
    "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
    "DNT": "1",
    "Connection": "keep-alive",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "Pragma": "no-cache",
    "Cache-Control": "no-cache",
    "TE": "trailers",
}

class Identity:
    """
    The Identity class provides the necessary data to perform Instagram API web requests,
    allowing you to build an identity for a specific target account.

    To prevent flooding Instagram with new identity requests for the same target, you can
    save this object as a JSON file using the `dict()` function.

    You can also load a previous Identity using the 'load_from' constructor parameter.

    :param username: target's account username.
    :type username: str

    :param target_id: target's account ID captured.
    :type target_id: str

    :param machine_id: required header, generated.
    :type machine_id: str

    :param csrf_token: required header, captured.
    :type csrf_token: str

    :param app_id: required header, captured.
    :type app_id: str

    :param claim: required header, captured.
    :type claim: str

    :param device_id: required header, captured.
    :type device_id: str

    :param asbd_id: required header, captured.
    :type asbd_id: str

    :param doc_ids: list of hashed GraphQL endpoints :
        - 0 : the Posts endpoint,
        - 1 : the Reels endpoint
    :type doc_ids: list[str]
    """

    def __init__(self, username: str = None, load_from: dict = None) -> None:
        """
        Identity constructor

        :param username: The target's account usrename. Used for fresh Identity.
        :type username: str

        :param load_from: The Identity class in self.__dict__() format. Used for cache Identity.
        :type load_from: dict
        """

        headers = BASE_HEADERS.copy()
        headers["Referer"] = "https://www.instagram.com/{0}/".format(username)

        if load_from is None and username is not None:
            self.__username = username
            self.__machine_id = ''.join([self.__base36(random.randint(2**29, 2**32)) for _ in range(8)])
            self.__page = requests.get(headers["Referer"], headers=headers)
            self.__page.raise_for_status() # Probably wrong username or Instagram is unreachable.
            self.__soup = soup(self.__page.text, "html.parser")
            self.__csrf_token = ""
            self.__json_identity = self.__get_json_identity()
            first_require = self.__json_identity["require"][0]
            self.__target_id = re.findall(r"\"target_id\":\"([^\"]*)\"", json.dumps(first_require, separators=(",",":")), re.MULTILINE)[0]
            define = json.dumps(first_require[3][0]["__bbox"]["define"], separators=(",",":"))
            self.__app_id = re.findall(r"\"APP_ID\":\"([^\"]*)\"", define, re.MULTILINE)[0]
            self.__claim = re.findall(r"\"claim\":\"([^\"]*)\"", define, re.MULTILINE)[0]
            self.__device_id = re.findall(r"\"device_id\":\"([^\"]*)\"", define, re.MULTILINE)[1]
            self.__doc_ids = []
            self.__asbd_id_regex = re.compile(r"^__d\(\"BDHeaderConfig\",\[\],\(function\([a-z,]+\){\"use strict\";[a-z]=\"(\d+)\";[a-z]\.ASBD_ID=[a-z]}\),\d+\);$", re.MULTILINE)
            self.__asbd_id = self.__get_asbd_id()
        elif load_from is not None:
            self.__username = load_from["username"]
            self.__target_id = load_from["target_id"]
            self.__csrf_token = load_from["csrf_token"]
            self.__app_id = load_from["app_id"]
            self.__claim = load_from["claim"]
            self.__device_id = load_from["device_id"]
            self.__machine_id = load_from["machine_id"]
            self.__asbd_id = load_from["asbd_id"]
            self.__doc_ids = load_from["doc_ids"]
        else:
            raise Exception("You must either supply a username or a valid cache.")

    @staticmethod
    def __base36(number: int):
        base36 = ''
        if 0 <= number < 36:
            return B36_ALPHABET[number]
        while number != 0:
            number, i = divmod(number, 36)
            base36 = B36_ALPHABET[i] + base36
        return base36

    def __get_json_identity(self) -> dict:
        scripts_list = self.__soup.select("script[type=\"application/json\"]")
        for s in scripts_list:
            data = {}
            try:
                data = json.loads(s.text)
            except json.decoder.JSONDecodeError:
                continue

            try:
                define = data["require"][0][3][0]["__bbox"]["define"]
                identity = None
                for i in range(len(define)):
                    if len(define[i]) < 3:
                        continue
                    if "raw" in define[i][2].keys():
                        identity = define[i][2]["raw"]
                        break
            except:
                continue

            try:
                identity = json.loads(identity)
                self.__csrf_token = identity["config"]["csrf_token"]
                return data
            except json.decoder.JSONDecodeError:
                continue
        raise Exception("Unable to find the identity script")

    def __get_asbd_id(self) -> str:
        urls_list = [link.get("href") for link in self.__soup.select("link[rel=\"preload\"][as=\"script\"]")]
        profile_posts_actions = re.compile(r"__d\(\"PolarisProfilePostsActions\",\[(?:[^]]*)\],\(function\((?:[^)]*)\){\"use strict\";[a-z]=\d+;[a-z]=\"([^\"]*)\";var [a-z]=\"([^\"]*)\",", re.MULTILINE)
        asbd_id = ""
        i = 0
        for u in urls_list:
            s = requests.get(u)
            s.raise_for_status()
            doc_ids = profile_posts_actions.findall(s.text)

            if len(doc_ids) > 0:
                self.__doc_ids = doc_ids[0]
            try:
                asbd_id = self.__asbd_id_regex.findall(s.text)[0]
            except IndexError:
                continue
        return asbd_id

    @property
    def username(self):
        return self.__username
    
    @property
    def target_id(self):
        return self.__target_id

    @property
    def csrf_token(self):
        return self.__csrf_token

    @property
    def app_id(self):
        return self.__app_id

    @property
    def claim(self):
        return self.__claim

    @property
    def device_id(self):
        return self.__device_id

    @property
    def machine_id(self):
        return self.__machine_id

    @property
    def asbd_id(self):
        return self.__asbd_id
    
    @property
    def doc_ids(self):
        return self.__doc_ids
    
    def build_headers(self):
        return {
            "X-ASBD-ID": self.asbd_id,
            "X-CSRFToken": self.csrf_token,
            "X-IG-App-ID": self.app_id,
            "X-IG-WWW-Claim": self.claim,
            "X-Mid": self.machine_id,
            "X-Web-Device-Id": self.device_id
        }
        
    def __dict__(self):
        return {
            "username": self.username,
            "target_id": self.target_id,
            "csrf_token": self.csrf_token,
            "app_id": self.app_id,
            "claim": self.claim,
            "device_id": self.device_id,
            "machine_id": self.machine_id,
            "asbd_id": self.asbd_id,
            "doc_ids": self.doc_ids
        }

    def __repr__(self):
        d = self.__dict__()
        return f"""Identity(
    username = {d["username"]},
    target_id = {d["target_id"]},
    csrf_token = {d["csrf_token"]},
    app_id = {d["app_id"]},
    claim = {d["claim"]},
    device_id = {d["device_id"]},
    machine_id = {d["machine_id"]},
    asbd_id = {d["asbd_id"]},
    doc_ids = {', '.join(d["doc_ids"])}
)"""

    def __iter__(self):
        for k, v in self.__dict__().items():
            yield (k, v)
