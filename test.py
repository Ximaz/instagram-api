import json

from src.api import API

with open("drake_api.json", "r") as s:
    data = json.load(s)
    api = API(load_from=data, username=None)

metadata = api.get_metadata()
print(metadata)