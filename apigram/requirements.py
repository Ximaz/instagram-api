import json
import math
import urllib.parse
import random
import re

import bs4 # python3 -m pip install bs4
import requests # python3 -m pip install requests


def __webpack_requirements(document: bs4.BeautifulSoup):
    requirements = document.select(selector="script[type=\"application/json\"]")
    
    return [
        { "name": m[0], "description": m[1], "content": m[3] }
        for requirement in requirements
        for m in json.loads(s=requirement.get_text()).get("require", [])
    ]


def __get_jazoest(document: bs4.BeautifulSoup):
    data = json.loads(s=document.select_one(selector="script[type=\"application/json\"][id]:not([id=\"envjson\"])").get_text())
    url_data = urllib.parse.parse_qs(urllib.parse.urlparse(data["u"]).query)

    return {
        "lsd": data["l"],
        "jazoest": int(url_data["jazoest"][0]),
        "__a": int(url_data["__a"][0]),
        "__user": int(url_data["__user"][0]),
        "__comet_req": int(url_data["__comet_req"][0])
    }

def __get_relay_api_config_defaults(data: dict):
    return {
        "__d": data["customHeaders"]["X-IG-D"],
        "app_id": data["customHeaders"]["X-IG-App-ID"]
    }


def __get_site_data(data: dict):
    return {
        "__hs": data["haste_session"],
        "dpr": data["pr"],
        "__hsi": data["hsi"],
        "__spin_r": data["__spin_r"],
        "__spin_b": data["__spin_b"],
        "__spin_t": data["__spin_t"]
    }


def __get_bootloader_revision(document: bs4.BeautifulSoup):
    script = document.select_one(selector="script[data-btmanifest]:not([data-btmanifest=\"\"])")

    return {
        "__rev": int(script.get_attribute_list("data-btmanifest")[0].split("_")[0])
    }


def __get_connection_classserver_guess(data: dict):
    return {
        "__ccg": data["connectionClass"]
    }


def __number_to_base(n, b):
    digits = []

    if n == 0:
        return [0]
    while n:
        digits.append(int(n % b))
        n //= b
    return digits[::-1]


def __get_query_doc_id(query_name: str, session: requests.Session, document: bs4.BeautifulSoup):
    scripts = document.select("link[rel=\"preload\"][as=\"script\"]")
    query_regex = re.compile("__d\\(\"%s\\$Parameters\",\\[\\],\\(function\\(.,.,.,.,.,.\\){\"use strict\";.={kind:\"PreloadableConcreteRequest\",params:{id:\"(\\d+)\",metadata:{},name:\"%s\",operationKind:\"query\",text:null}};.\\.exports=.}\\),null\\);" % (query_name, query_name), re.M)
    asbd_id_regex = re.compile("__d\\(\"PolarisBDHeaderConfig\",\\[\\],\\(function\\(.,.,.,.,.,.\\){\"use strict\";.=\"(\\d+)\";.\\.ASBD_ID=.}\\),\\d+\\);", re.M)
    query_hashes = re.compile("__d\\(\"PolarisProfilePostsActions\",.+.=\"(\\d+)\";.+.=\"(\\d+)\"", re.M)
    data = {}

    for script in scripts:
        url = script.attrs.get("href", None)
        if None is url:
            continue
        javascript = session.get(url=url).text
        groups = query_regex.findall(javascript)
        if 1 == len(groups):
            data["doc_id"] = groups[0]
            data["fb_api_req_friendly_name"] = query_name
        groups = asbd_id_regex.findall(javascript)
        if 1 == len(groups):
            data["asbd_id"] = groups[0]
        groups = query_hashes.findall(javascript)
        if 1 == len(groups) and 2 == len(groups[0]):
            data["posts_query_hash"] = groups[0][0]
            data["highlights_query_hash"] = groups[0][1]
    return data


def __get_identity_claim(data: dict):
    return {
        "claim": data["identity"]["claim"]
    }


def __generate_websession_id():
    base = 36
    j = 6
    k = base ** j
    alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"
    a = math.floor(random.random() * k)
    a = "".join([alphabet[i] for i in __number_to_base(a, base)])
    p = "0" * (j - len(a)) + a

    return {
        "__s": f"::{p}"
    }

def __get_csrftoken(data: dict):
    return {
        "csrftoken": data["csrf_token"]
    }

def __get_target(props: dict):
    return {
        "user": props,
        "query_id": props["polaris_preload"]["profile_extras"]["request"]["params"]["query"]["query_id"]
    }


def __get_deferred_cookies(data: dict):
    return {
        "ig_did": data["deferredCookies"]["_js_ig_did"]["value"],
        "mid": data["deferredCookies"]["_js_mid"]["value"],
        "datr": data["deferredCookies"]["_js_datr"]["value"],
    }


def __lookup_module(name: str, parent: list[list]):
    for m in parent:
        if name == m[0]:
            return m
    return []


def get_natives(session: requests.Session, target: str):
    profile = f"https://www.instagram.com/{target}/"
    html = session.get(url=profile).text
    document = bs4.BeautifulSoup(markup=html, features="html.parser")
    modules = __webpack_requirements(document=document)
    parent = modules[13]["content"][0]["__bbox"]
    cookies = modules[27]["content"][0]["__bbox"]

    return {
        **__get_relay_api_config_defaults(data=__lookup_module(name="RelayAPIConfigDefaults", parent=parent["define"])[2]),
        **__get_site_data(data=__lookup_module(name="SiteData", parent=parent["define"])[2]),
        **__get_connection_classserver_guess(data=__lookup_module(name="WebConnectionClassServerGuess", parent=parent["define"])[2]),
        **__get_csrftoken(data=__lookup_module(name="InstagramSecurityConfig", parent=parent["define"])[2]),
        **__get_identity_claim(data=__lookup_module(name="AnalyticsCoreData", parent=parent["define"])[2]),
        **__get_target(props=parent["require"][3][3][3]["rootView"]["props"]),
        **__get_bootloader_revision(document=document),
        **__get_jazoest(document=document),
        **__generate_websession_id(),
        **__get_deferred_cookies(data=__lookup_module(name="CometPlatformRootClient", parent=cookies["require"])[3][0]),
        **__get_query_doc_id("PolarisProfilePageContentQuery", session=session, document=document),
        "fb_api_caller_class": "RelayModern",
        "server_timestamps": 1,
        "__req": 1,  # Always returns 1 inside the sources, but it's post incremented. Useful ?
        "__dyn": "", # ??
        "__csr": "", # ??
        "av": 0,     # ??
    }

def native_to_target(natives: dict) -> dict:
    return natives["user"]

def natives_to_graphql(natives: dict, variables: dict) -> dict:
    return {
        "av": natives.get("av", ""),
        "__d": natives.get("__d", ""),
        "__user": natives.get("__user", ""),
        "__a": natives.get("__a", ""),
        "__req": natives.get("__req", ""),
        "__hs": natives.get("__hs", ""),
        "dpr": natives.get("dpr", ""),
        "__ccg": natives.get("__ccg", ""),
        "__rev": natives.get("__rev", ""),
        "__s": natives.get("__s", ""),
        "__hsi": natives.get("__hsi", ""),
        "__dyn": natives.get("__dyn", ""),
        "__csr": natives.get("__csr", ""),
        "__comet_req": natives.get("__comet_req", ""),
        "lsd": natives.get("lsd", ""),
        "jazoest": natives.get("jazoest", ""),
        "__spin_r": natives.get("__spin_r", ""),
        "__spin_b": natives.get("__spin_b", ""),
        "__spin_t": natives.get("__spin_t", ""),
        "fb_api_caller_class": natives.get("fb_api_caller_class", ""),
        "fb_api_req_friendly_name": natives.get("fb_api_req_friendly_name", ""),
        "variables": json.dumps(variables),
        "server_timestamps": natives.get("server_timestamps", ""),
        "doc_id": natives.get("doc_id", ""),
    }

def natives_to_headers(natives: dict) -> dict:
    return {
        "X-ASBD-ID": natives.get("asbd_id", ""),
        "X-CSRFToken": natives.get("csrftoken", ""),
        "X-FB-Friendly-Name": natives.get("fb_api_req_friendly_name", ""),
        "X-FB-LSD": natives.get("lsd", ""),
        "X-IG-App-ID": natives.get("app_id", ""),
        "X-IG-Mid": natives.get("mid", ""),
        "X-IG-WWW-Claim": natives.get("claim", "0"),
        "Cookie": f"csrfoken={natives.get("csrftoken", "")}; ig_did={natives.get("ig_did", "")}; mid={natives.get("mid", "")}; _js_datr={natives.get("datr", "")}; dpr={natives.get("dpr", "")}"
    }


def natives_to_query_id(natives: dict) -> str:
    return natives.get("query_id", "")


def natives_to_highlights_query_hash(natives: dict) -> str:
    return natives.get("highlights_query_hash", "")


def natives_to_posts_query_hash(natives: dict) -> str:
    return natives.get("posts_query_hash", "")
