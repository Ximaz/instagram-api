"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserHighlights = exports.getUserPosts = exports.getUser = void 0;
const axios_1 = __importDefault(require("axios"));
function craftCookie(csrftoken, ctx) {
    return `csrftoken=${csrftoken}; mid=${ctx.headers["X-Mid"]}; ig_did=${ctx.headers["X-Web-Device-Id"]}`;
}
async function getUser(username, ctx) {
    return (await axios_1.default.get(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, { headers: ctx.headers })).data.data.user;
}
exports.getUser = getUser;
async function getUserPosts(user, ctx, { first, after }) {
    const variables = encodeURIComponent(JSON.stringify({ id: user.id, first, after })), headers = ctx.headers;
    headers["Referer"] = `https://www.instagram.com/${user.username}/`;
    headers["X-CSRFToken"] = "08bpX105Hm2jA0BmYDuO3WsANDXxVpWf";
    headers["Cookie"] = craftCookie(headers["X-CSRFToken"], ctx);
    delete headers["X-Web-Device-Id"];
    delete headers["X-Mid"];
    return (await axios_1.default.get(`https://www.instagram.com/graphql/query/?query_hash=${ctx.queries.posts}&variables=${variables}`, { headers })).data.data.user;
}
exports.getUserPosts = getUserPosts;
async function getUserHighlights(user, ctx) {
    throw new Error("This function requires to be logged in, not supported yet.");
    const variables = encodeURIComponent(JSON.stringify({
        user_id: user.id,
        include_chaining: false,
        include_reel: false,
        include_suggested_users: false,
        include_logged_out_extras: true,
        include_highlight_reels: true,
        include_live_status: false
    })), headers = ctx.headers;
    headers["Referer"] = `https://www.instagram.com/${user.username}/`;
    return (await axios_1.default.get(`https://www.instagram.com/graphql/query/?query_hash=${ctx.queries.highlights}&variables=${variables}`, { headers })).data.data.user;
}
exports.getUserHighlights = getUserHighlights;
