"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const node_html_parser_1 = __importDefault(require("node-html-parser"));
function getRandomInt(min, max) {
    min = Math.ceil(min);
    return Math.floor(Math.random() * (Math.floor(max) - min)) + min;
}
function craftCookie(headers) {
    return `csrftoken=${headers["X-CSRFToken"]}; mid=${headers["X-Mid"]}; ig_did=${headers["X-Web-Device-Id"]}`;
}
const defaultHeaders = {
    "Host": "www.instagram.com",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "Alt-Used": "www.instagram.com",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site",
    "Pragma": "no-cache",
    "Cache-Control": "no-cache",
    "TE": "trailers",
};
async function getUserPage(username) {
    return (await axios_1.default.get(`https://www.instagram.com/${username}/`, { headers: defaultHeaders })).data;
}
async function getIGABSDId(html) {
    const script = (0, node_html_parser_1.default)(html).querySelectorAll("link[rel=\"preload\"][as=\"script\"]")[1]?.getAttribute("href");
    if (!script)
        throw new Error("Unable to find the magic script");
    const magicScript = (await axios_1.default.get(script)).data, ASBD_ID = /\w+="(\d+)";\w+.ASBD_ID=\w+/gm.exec(magicScript)?.at(1);
    if (!ASBD_ID)
        throw new Error("Unable to find the ASBD ID.");
    return parseInt(ASBD_ID);
}
async function getQueries(html) {
    const script = (0, node_html_parser_1.default)(html).querySelectorAll("link[rel=\"preload\"][as=\"script\"]")[2]?.getAttribute("href");
    if (!script)
        throw new Error("Unable to find the magic script");
    const magicScript = (await axios_1.default.get(script)).data, match = /^__d\("PolarisProfilePostsActions",\[["A-Za-z0-9\-\.,]+\],\(function\(.+\)\{"use strict";.+"([a-f0-9]{32})".+"([a-f0-9]{32})/gm.exec(magicScript);
    if (!match)
        throw new Error("Unable to find queries in magic script.");
    const posts = match.at(1);
    if (!posts)
        throw new Error("Unable to find posts query hash.");
    const highlights = match.at(2);
    if (!highlights)
        throw new Error("Unable to find highlights query hash.");
    return [posts, highlights];
}
function getCSRFToken(html) {
    const csrfToken = /\\"csrf_token\\":\\"(\w+)\\"/gm.exec(html)?.at(1);
    if (!csrfToken)
        throw new Error("Unable to find CSRF token.");
    return csrfToken;
}
function getIGAppId(html) {
    const appId = /\"X\-IG\-App\-ID\":\"(\d+)\"/gm.exec(html)?.at(1);
    if (!appId)
        throw new Error("Unable to find the app ID.");
    return parseInt(appId);
}
function getTargetId(html) {
    const targetId = /"props":{"id":"(\d+)"/gm.exec(html)?.at(1);
    if (!targetId)
        throw new Error("Unable to find the target ID.");
    return parseInt(targetId);
}
async function getIGWWWClaim(targetId, deviceId, ASBDId, IGAppId, XMid) {
    const reqHeaders = {
        ...defaultHeaders,
        "X-Web-Device-Id": deviceId,
        "X-ASBD-ID": ASBDId.toString(),
        "X-IG-App-ID": IGAppId.toString(),
        "X-Mid": XMid,
        "X-Requested-With": "XMLHttpRequest"
    };
    const { headers } = await axios_1.default.get(`https://www.instagram.com/api/v1/web/get_ruling_for_content/?content_type=PROFILE&target_id=${targetId}`, { headers: reqHeaders });
    if (headers["access-control-expose-headers"] == "X-IG-Set-WWW-Claim")
        return "0";
    return undefined;
}
function getIgDeviceId(html) {
    const did = /"_js_ig_did":{"value":"([A-F0-9\-]+)"/gm.exec(html)?.at(1);
    if (!did)
        throw new Error("Unable to find the device ID.");
    return did;
}
function buildXMid() {
    let token = "";
    const min = Math.pow(2, 29), max = Math.pow(2, 32);
    for (let i = 0; i < 8; i++)
        token += getRandomInt(min, max).toString(36);
    return token;
}
async function default_1(target) {
    const page = await getUserPage(target), target_id = getTargetId(page), ig_app_id = getIGAppId(page), ig_did = getIgDeviceId(page), csrftoken = getCSRFToken(page), ig_mid = buildXMid(), ig_asbd_id = await getIGABSDId(page), queries = await getQueries(page);
    if (!target_id || !ig_app_id || !ig_did || !ig_asbd_id)
        throw new Error(`One of the required fields is missing : target_id (${target_id}), ig_app_id (${ig_app_id}), ig_did (${ig_did}), ig_asbd_id (${ig_asbd_id})`);
    const ig_www_claim = await getIGWWWClaim(target_id, ig_did, ig_asbd_id, ig_app_id, ig_mid);
    if (!ig_www_claim)
        throw new Error("Unable to fetch the WWW-Claim value.");
    const headers = {
        ...defaultHeaders,
        "X-Mid": ig_mid,
        "X-IG-App-ID": ig_app_id.toString(),
        "X-ASBD-ID": ig_asbd_id.toString(),
        "X-IG-WWW-Claim": ig_www_claim,
        "X-Web-Device-Id": ig_did,
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": csrftoken,
        "Referer": `https://www.instagram.com/${target}/`,
        "Cookie": ""
    };
    headers["Cookie"] = craftCookie(headers);
    return {
        queries: {
            posts: queries[0],
            highlights: queries[1],
        },
        headers
    };
}
exports.default = default_1;
