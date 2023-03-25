"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIGAppId = exports.getUserPage = void 0;
const node_html_parser_1 = __importDefault(require("node-html-parser"));
const axios_1 = __importDefault(require("axios"));
async function getUserPage(username) {
    return (await axios_1.default.get(`https://www.instagram.com/${username}/`, { headers: {
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
        } })).data;
}
exports.getUserPage = getUserPage;
function getIGAppId(html) {
    const content = Array.from((0, node_html_parser_1.default)(html).querySelectorAll("script")).at(27)?.innerHTML;
    if (!content)
        return undefined;
    const appId = /\"X\-IG\-App\-ID\":\"(\d+)\"/gm.exec(content)?.at(1);
    if (!appId)
        return undefined;
    return parseInt(appId);
}
exports.getIGAppId = getIGAppId;