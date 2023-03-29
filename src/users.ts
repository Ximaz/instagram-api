import axios from "axios"
import { IContext } from "./types/IContext"
import { IHighlights } from "./types/IHighlights"
import { IPosts, IPost } from "./types/IPosts"
import { IReel, IReels } from "./types/IReels"
import { IUser } from "./types/IUser"

/**
 * 
 * GraphQL Bucket :
 * Posts : The Bucket seems to reach it's limit for 68 fast requests.
 *         The Bucket seems to evacuate 1 request per 15 minutes
 * Highlights : ? / (1 hour ?)
 */

export async function getUser(username: string, ctx: IContext): Promise<IUser> {
    return (await axios.get(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, { headers: ctx.headers })).data.data.user
}

export async function getUserPosts(user: IUser, ctx: IContext, { first, after }: { first: number, after: string | null }): Promise<IPosts> {
    const variables = encodeURIComponent(JSON.stringify({ id: user.id, first, after })),
        headers = ctx.headers

    return (await axios.get(`https://www.instagram.com/graphql/query/?query_hash=${ctx.queries.posts}&variables=${variables}`, { headers })).data.data.user
}

export async function getAllUserPosts(user: IUser, ctx: IContext, { first, after }: { first: number, after: string | null }): Promise<IPost[]> {
    const posts: IPost[] = []
    let fetch = null

    do {
        try {
            fetch = await getUserPosts(user, ctx, { first, after })
        } catch (e) {
            console.error(e)
            console.warn("Got Ratelimited")
            break
        }
        after = fetch.edge_owner_to_timeline_media.page_info.end_cursor
        posts.push(...fetch.edge_owner_to_timeline_media.edges)
    } while (fetch.edge_owner_to_timeline_media.page_info.has_next_page)
    return posts
}

export async function getUserReels(user: IUser, ctx: IContext, { page_size, max_id }: { page_size: number, max_id: string | null }): Promise<IReels> {
    const headers = ctx.headers

    headers["Content-Type"] = "application/x-www-form-urlencoded"
    return (await axios.post(`https://www.instagram.com/api/v1/clips/user/`, { 
        target_user_id:	user.id,
        page_size: page_size.toString(),
        max_id,
        include_feed_video: "true"
     }, { headers })).data

}

export async function getAllUserReels(user: IUser, ctx: IContext, { page_size, max_id }: { page_size: number, max_id: string | null }): Promise<IReel[]> {
    const posts: IReel[] = []
    let fetch = null

    do {
        try {
            fetch = await getUserReels(user, ctx, { page_size, max_id })
        } catch (e) {
            console.error(e)
            console.warn("Got Ratelimited")
            break
        }
        max_id = fetch.paging_info.max_id
        posts.push(...fetch.items)
    } while (fetch.paging_info.more_available)
    return posts
}

export async function getUserHighlights(user: IUser, ctx: IContext): Promise<IHighlights> {
    const variables = encodeURIComponent(JSON.stringify({
        user_id: user.id,
        include_chaining: false,
        include_reel: false,
        include_suggested_users: false,
        include_logged_out_extras: true,
        include_highlight_reels: true,
        include_live_status: false
    })),
        headers = ctx.headers

    return (await axios.get(`https://www.instagram.com/graphql/query/?query_hash=${ctx.queries.highlights}&variables=${variables}`, { headers })).data.data.user
}
