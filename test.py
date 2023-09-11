import json
from src.api import API

# api = API(username="drake", load_from=None)
# with open("drake_api.json", "w") as s:
#     api.export_api(s)
with open("drake_api.json", "r") as s:
    api = API(load_from=json.load(s), username=None)

posts = api.fetch_highlights()
with open("save.json", "w+") as s:
    json.dump(posts, s)