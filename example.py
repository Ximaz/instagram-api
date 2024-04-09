import json
import typing


import apigram


def save_obj(obj: typing.Any, name: str):
    with open(f"typings/{name}.json", "w+") as stream:
        json.dump(obj, stream)
    stream.close()


def main():
    target = "TEST"
    api = apigram.ApiGram(username=target, proxies=None)
    recent_posts = api.fetch_posts()
    data = recent_posts["data"]["user"]["edge_owner_to_timeline_media"]["edges"]
    for post in data:
        print(post["node"]["display_url"])

    
if __name__ == "__main__":
    main()
