import io
import json
import urllib.error


from . import                              \
    proxy_session,                         \
    get_natives,                           \
    natives_to_graphql,                    \
    natives_to_headers,                    \
    native_to_target,                      \
    natives_to_query_id,                   \
    natives_to_highlights_query_hash,      \
    natives_to_posts_query_hash,           \
    natives_to_post_metadata_query_hash,   \
    natives_to_comments_parent_query_hash, \
    natives_to_comments_child_query_hash,  \
    natives_to_post_stats_doc_id


class ApiGram:
    def __init__(self, username: str, api_path: str = None, proxies: dict[str, str] = None):
        self.__username = username
        if api_path is not None:
            with open(api_path, "r") as stream:
                self.import_api(readable_stream=stream)
            stream.close()
        else:
            self.__session = self.__make_session(proxies=proxies)
            self.__natives = get_natives(session=self.__session, target=self.__username)
            self.__user = native_to_target(self.__natives)
            self.__update_session()

    def __make_session(self, proxies: dict[str, str] = None):
        return proxy_session(proxies=proxies)
    
    def __update_session(self):
        self.__session.headers.update({
            **self.__session.headers,
            **natives_to_headers(self.__natives)
        })

    @property
    def session(self):
        return self.__session

    def fetch_user_metadata(self) -> dict:
        url = "https://www.instagram.com/api/graphql/"
        data = natives_to_graphql(natives=self.__natives, variables={
            "id": str(self.__user["id"]),
            "relay_header": False,
            "render_surface": "PROFILE"
        })
        response = self.__session.post(url=url, data=data, headers={
            "Content-Type": "application/x-www-form-urlencoded"
        })
        response.raise_for_status()
        return response.json()

    def fetch_user_profile(self) -> dict:
        url = "https://www.instagram.com/api/v1/users/web_profile_info/"
        response = self.session.get(url=url, params={
            "username": self.__username
        })
        response.raise_for_status()
        return response.json()

    def fetch_posts(self, first: int = 12, after: str = None) -> dict:
        url = "https://www.instagram.com/graphql/query/"
        response = self.session.get(url=url, params={
            "doc_id": natives_to_posts_query_hash(self.__natives),
            "variables": json.dumps({
                "id": self.__user["id"],
                "after": after,
                "first": first
            })
        })
        response.raise_for_status()
        return response.json()

    def __fetch_highlights_v1(self) -> dict:
        url = "https://www.instagram.com/graphql/query/"
        response = self.session.get(url=url, params={
            "doc_id": natives_to_highlights_query_hash(self.__natives),
            "variables": json.dumps({
                "include_chaining": True,
                "include_highlight_reels": True,
                "include_live_status": True,
                "include_logged_out_extras": True,
                "include_reel": True,
                "include_suggested_users": True,
                "user_id": self.__user["id"]
            })
        })
        response.raise_for_status()
        return response.json()

    def __fetch_highlights_v2(self) -> dict:
        url = "https://www.instagram.com/graphql/query/"
        response = self.session.get(url=url, params={
            "query_id": natives_to_query_id(self.__natives),
            "include_chaining": True,
            "include_highlight_reels": True,
            "include_live_status": True,
            "include_logged_out_extras": True,
            "include_reel": True,
            "include_suggested_users": True,
            "user_id": self.__user["id"]
        })
        response.raise_for_status()
        return response.json()
    
    def fetch_highlights(self) -> dict:
        try:
            return self.__fetch_highlights_v1()
        except urllib.error.HTTPError:
            return self.__fetch_highlights_v2()

    def fetch_reels(self, page_size: int = 12, max_id: str = None) -> dict:
        url = "https://www.instagram.com/api/v1/clips/user/"
        data = {
            "include_feed_video": True,
            "page_size": page_size,
            "target_user_id": self.__user["id"]
        }
        if max_id is not None:
            data["max_id"] = max_id
        response = self.session.post(url=url, data=data, headers={
            "Content-Type": "application/x-www-form-urlencoded"
        })
        response.raise_for_status()
        return response.json()

    def fetch_post_metadata(self, shortcode: str) -> dict:
        url = "https://www.instagram.com/graphql/query/"
        response = self.session.get(url=url, params={
            "doc_id": natives_to_post_metadata_query_hash(self.__natives),
            "variables": json.dumps({
                "child_comment_count": 40,
                "fetch_comment_count": True,
                "fetch_like_count": 10,
                "fetch_preview_comment_count": 2,
                "fetch_tagged_user_count": None,
                "has_threaded_comments": True,
                "hoisted_comment_id": None,
                "hoisted_reply_id": None,
                "parent_comment_count": None,
                "shortcode": shortcode
            })
        })
        response.raise_for_status()
        return response.json()

    def fetch_post_stats(self, shortcode: str) -> dict:
        url = "https://www.instagram.com/api/graphql/"
        response = self.session.post(url=url, data={
            **natives_to_graphql(self.__natives, {
                "shortcode": shortcode,
                "fetch_comment_count": 40,
                "fetch_related_profile_media_count": 3,
                "parent_comment_count": 24,
                "child_comment_count": 3,
                "fetch_like_count": 10,
                "fetch_tagged_user_count": None,
                "fetch_preview_comment_count": 2,
                "has_threaded_comments": True,
                "hoisted_comment_id": None,
                "hoisted_reply_id": None,
            }),
            "fb_api_req_friendly_name": "PolarisPostActionLoadPostQueryLegacyQuery",
            "doc_id": natives_to_post_stats_doc_id(self.__natives)
        }, headers={
            "Content-Type": "application/x-www-form-urlencoded",
        })
        response.raise_for_status()
        return response.json()

    def export_api(self, writable_stream: io.BytesIO):
        if writable_stream.writable():
            json.dump(obj=self.__dict__(), fp=writable_stream)

    def import_api(self, readable_stream: io.BytesIO):
        if readable_stream.readable():
            data = json.load(fp=readable_stream)
            self.__natives = data["natives"]
            self.__username = data["username"]
            self.__session = self.__make_session(proxies=data["proxies"])
            self.__update_session()
            self.__user = native_to_target(natives=self.__natives)

    def __dict__(self):
        return {
            "natives": self.__natives,
            "username": self.__username,
            "proxies": self.__session.proxies
        }
