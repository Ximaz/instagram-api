import apigram


def main():
    target = "TEST"
    api = apigram.ApiGram(username=target, proxies=None)
    recent_posts = api.fetch_posts()
    print(recent_posts)
    data = recent_posts["data"]["user"]["edge_owner_to_timeline_media"]["edges"]
    for post in data:
        print(post["node"]["display_url"])

if __name__ == "__main__":
    main()
