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
    Host: "www.instagram.com",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0",
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    "Alt-Used": "www.instagram.com",
    Connection: "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "cross-site",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
    TE: "trailers",
};
async function getUserPage(username) {
    return (await axios_1.default.get(`https://www.instagram.com/${username}/`, {
        headers: defaultHeaders,
    })).data;
}
async function getIGABSDId(html) {
    const script = (0, node_html_parser_1.default)(html)
        .querySelectorAll('link[rel="preload"][as="script"]')[2]
        ?.getAttribute("href");
    if (!script)
        throw new Error("Unable to find the magic script");
    const magicScript = (await axios_1.default.get(script)).data, ASBD_ID = /\w+="(\d+)";\w+.ASBD_ID=\w+/gm.exec(magicScript)?.at(1);
    if (!ASBD_ID)
        throw new Error("Unable to find the ASBD ID.");
    return parseInt(ASBD_ID);
}
async function getQueries(html) {
    const script = (0, node_html_parser_1.default)(html)
        .querySelectorAll('link[rel="preload"][as="script"]')[1]
        ?.getAttribute("href");
    if (!script)
        throw new Error("Unable to find the magic script");
    const magicScript = (await axios_1.default.get(script)).data, match = [...magicScript.matchAll(/[a-f0-9]{32}/gm)];
    console.log(match);
    if (!match)
        throw new Error("Unable to find queries in magic script.");
    const posts = match[0].at(0);
    if (!posts)
        throw new Error("Unable to find posts query hash.");
    const highlights = match[0].at(1);
    if (!highlights)
        throw new Error("Unable to find highlights query hash.");
    const docId = /^__d\("PolarisCookieModalActions",\[["A-Za-z0-9\-\.,]+\],\(function\(.+\)\{"use strict";.+"(\d+)"/gm
        .exec(magicScript)
        ?.at(1);
    if (!docId)
        throw new Error("Unable to find docId.");
    return [posts, highlights, docId];
}
function getCSRFToken(html) {
    const csrfToken = /\\"csrf_token\\":\\"(\w+)\\"/gm.exec(html)?.at(1);
    if (!csrfToken)
        throw new Error("Unable to find CSRF token.");
    return csrfToken;
}
function getIGAppId(html) {
    const appId = /"X-IG-App-ID":"(\d+)"/gm.exec(html)?.at(1);
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
        "X-Requested-With": "XMLHttpRequest",
    }, { headers } = await axios_1.default.get(`https://www.instagram.com/api/v1/web/get_ruling_for_content/?content_type=PROFILE&target_id=${targetId}`, { headers: reqHeaders });
    if (headers["access-control-expose-headers"] == "X-IG-Set-WWW-Claim")
        return "0";
    throw new Error("Unable to find X-IG-Set-WWW-Claim header.");
}
function getIgDeviceId(html) {
    const did = /"_js_ig_did":{"value":"([A-F0-9\-]+)"/gm.exec(html)?.at(1);
    if (!did)
        throw new Error("Unable to find the device ID.");
    return did;
}
function getIgAjax(html) {
    const ajax = /"app_version":"\d+.\d+.\d+.\d+ \((\d+)\)"/gm.exec(html)?.at(1);
    if (!ajax)
        throw new Error("Unable to find AJAX version.");
    return parseInt(ajax);
}
function buildXMid() {
    let token = "";
    const min = Math.pow(2, 29), max = Math.pow(2, 32);
    for (let i = 0; i < 8; i++)
        token += getRandomInt(min, max).toString(36);
    return token;
}
async function grpahQLAuth(ctx, docId) {
    let headers = {
        Host: "graphql.instagram.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/111.0",
        Accept: "*/*",
        "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
        "Accept-Encoding": "gzip, deflate, br",
        "X-Mid": ctx.headers["X-Mid"],
        "X-Instagram-AJAX": ctx.headers["X-Instagram-AJAX"],
        "X-IG-App-ID": ctx.headers["X-IG-App-ID"],
        "X-ASBD-ID": ctx.headers["X-ASBD-ID"],
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: "https://www.instagram.com",
        DNT: "1",
        Connection: "keep-alive",
        Referer: "https://www.instagram.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        TE: "trailers",
    };
    const variables = JSON.stringify({
        ig_did: ctx.headers["X-Web-Device-Id"],
        first_party_tracking_opt_in: true,
        third_party_tracking_opt_in: false,
        input: { client_mutation_id: 0 },
    }), res = (await axios_1.default.post("https://graphql.instagram.com/graphql/", { doc_id: docId, variables }, {
        headers,
    })).data;
    return res.data.ig_browser_terminal_consent_mutation.success;
}
async function default_1(target) {
    const page = await getUserPage(target), target_id = getTargetId(page), ig_app_id = getIGAppId(page), ig_did = getIgDeviceId(page), ig_ajax = getIgAjax(page), csrftoken = getCSRFToken(page), ig_mid = buildXMid(), ig_asbd_id = await getIGABSDId(page), [posts, highlights, docId] = await getQueries(page);
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
        "X-Instagram-AJAX": ig_ajax.toString(),
        Referer: `https://www.instagram.com/${target}/`,
        Cookie: "",
    };
    headers["Cookie"] = craftCookie(headers);
    const ctx = {
        queries: {
            posts,
            highlights,
        },
        headers,
    };
    if (!(await grpahQLAuth(ctx, docId)))
        console.warn(`Unable to auth to GraphQL (docId: ${docId})`);
    return ctx;
}
exports.default = default_1;
