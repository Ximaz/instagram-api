import json
import random
import re

import requests
from bs4 import BeautifulSoup as soup

B36_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz"
def __base36(number: int):
    base36 = ''
    if 0 <= number < 36:
        return B36_ALPHABET[number]
    while number != 0:
        number, i = divmod(number, 36)
        base36 = B36_ALPHABET[i] + base36
    return base36

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
    def __init__(self, target_username: str) -> None:
        headers = BASE_HEADERS.copy()
        headers["Referer"] = "https://www.instagram.com/{0}/".format(target_username)

        self.__username = target_username

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
        self.__machine_id = self.__generate_mid()

        self.__asbd_id_regex = re.compile(r"^__d\(\"BDHeaderConfig\",\[\],\(function\([a-z,]+\){\"use strict\";[a-z]=\"(\d+)\";[a-z]\.ASBD_ID=[a-z]}\),\d+\);$", re.MULTILINE)
        self.__asbd_id = self.__get_asbd_id()

        self.__doc_ids = []


    @staticmethod
    def __generate_mid() -> str:
        mid = ""
        _min = 2**29
        _max = 2**32

        for _ in range(8):
            mid += __base36(random.randint(_min, _max))
        return mid
    

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
        
    def __repr__(self):
        return f"""Identity(
    username = {self.username},
    target_id = {self.target_id},
    csrf_token = {self.csrf_token},
    app_id = {self.app_id},
    claim = {self.claim},
    device_id = {self.device_id},
    machine_id = {self.machine_id},
    asbd_id = {self.asbd_id},
    doc_ids = {', '.join(self.doc_ids)}
)"""