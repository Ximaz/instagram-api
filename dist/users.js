"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserHighlights = exports.getAllUserReels = exports.getUserReels = exports.getAllUserPosts = exports.getUserPosts = exports.getUser = void 0;
const axios_1 = __importDefault(require("axios"));
async function getUser(username, ctx) {
    return (await axios_1.default.get(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, { headers: ctx.headers })).data.data.user;
}
exports.getUser = getUser;
async function getUserPosts(user, ctx, { first, after }) {
    const variables = encodeURIComponent(JSON.stringify({ id: user.id, first, after })), headers = ctx.headers;
    return (await axios_1.default.get(`https://www.instagram.com/graphql/query/?query_hash=${ctx.queries.posts}&variables=${variables}`, { headers })).data.data.user;
}
exports.getUserPosts = getUserPosts;
async function getAllUserPosts(user, ctx, { first, after }) {
    const posts = [];
    let fetch = null;
    do {
        try {
            fetch = await getUserPosts(user, ctx, { first, after });
        }
        catch (e) {
            console.error(e);
            console.warn("Got Ratelimited");
            break;
        }
        after = fetch.edge_owner_to_timeline_media.page_info.end_cursor;
        posts.push(...fetch.edge_owner_to_timeline_media.edges);
    } while (fetch.edge_owner_to_timeline_media.page_info.has_next_page);
    return posts;
}
exports.getAllUserPosts = getAllUserPosts;
async function getUserReels(user, ctx, { page_size, max_id }) {
    const headers = ctx.headers;
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    return (await axios_1.default.post(`https://www.instagram.com/api/v1/clips/user/`, {
        target_user_id: user.id,
        page_size: page_size.toString(),
        max_id,
        include_feed_video: "true"
    }, { headers })).data;
}
exports.getUserReels = getUserReels;
async function getAllUserReels(user, ctx, { page_size, max_id }) {
    const posts = [];
    let fetch = null;
    do {
        try {
            fetch = await getUserReels(user, ctx, { page_size, max_id });
        }
        catch (e) {
            console.error(e);
            console.warn("Got Ratelimited");
            break;
        }
        max_id = fetch.paging_info.max_id;
        posts.push(...fetch.items);
    } while (fetch.paging_info.more_available);
    return posts;
}
exports.getAllUserReels = getAllUserReels;
async function getUserHighlights(user, ctx) {
    const variables = encodeURIComponent(JSON.stringify({
        user_id: user.id,
        include_chaining: false,
        include_reel: false,
        include_suggested_users: false,
        include_logged_out_extras: true,
        include_highlight_reels: true,
        include_live_status: false
    })), { headers } = ctx;
    return (await axios_1.default.get(`https://www.instagram.com/graphql/query/?query_hash=${ctx.queries.highlights}&variables=${variables}`, { headers })).data.data.user;
}
exports.getUserHighlights = getUserHighlights;
