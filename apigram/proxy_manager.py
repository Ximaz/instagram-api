import requests


__BASE_HEADERS = {
    "Host": "www.instagram.com",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0",
    "Accept": "*/*",
    "Accept-Language": "en,en-US;q=0.8",
    "DNT": "1",
    "Connection": "keep-alive",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "Pragma": "no-cache",
    "Cache-Control": "no-cache",
    "TE": "trailers"
}


def proxy_session(proxies: dict[str, str] = None):
    """
    Args:
    -   proxies: dict of http/https proxy
    """
    __proxies = {
        k: v for k, v in proxies.items() if k in ("https", "http")
    } if None is not proxies else None
    session = requests.Session()

    if None is not __proxies:
        session.verify = False
        session.trust_env = False
        session.proxies.update(__proxies)
    session.headers.update(__BASE_HEADERS)
    return session
