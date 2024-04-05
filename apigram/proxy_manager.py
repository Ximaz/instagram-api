import requests


def proxy_session(proxies: list[list[str, str, int]] = None):
    """
    Args:
    -   proxies: list of [ PROTOCOL, HOST_IP_ADDR, HOST_PORT ], "PROTOCOL"
                 being either "https" or "http"
    """
    __proxies = {
        proto: f"{proto}://{host}:{port}" for proto, host, port in proxies
    } if None is not proxies else None
    session = requests.Session()

    if None is not __proxies:
        session.verify = False
        session.trust_env = False
        session.proxies.update(__proxies)
    return session
