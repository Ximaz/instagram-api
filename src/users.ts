import axios from "axios"
import { IContext } from "./types/IContext"
import { IHighlights } from "./types/IHighlights"
import { IPosts } from "./types/IPosts"
import { IUser } from "./types/IUser"

function craftCookie(csrftoken: string, ctx: IContext): string {
    return `csrftoken=${csrftoken}; mid=${ctx.headers["X-Mid"]}; ig_did=${ctx.headers["X-Web-Device-Id"]}`
}

export async function getUser(username: string, ctx: IContext): Promise<IUser> {
    return (await axios.get(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, { headers: ctx.headers })).data.data.user
}

export async function getUserPosts(user: IUser, ctx: IContext, { first, after }: { first: number, after: string | null }): Promise<IPosts> {
    const variables = encodeURIComponent(JSON.stringify({ id: user.id, first, after })),
        headers = ctx.headers

    headers["Referer"] = `https://www.instagram.com/${user.username}/`
    headers["X-CSRFToken"] = "08bpX105Hm2jA0BmYDuO3WsANDXxVpWf"
    headers["Cookie"] = craftCookie(headers["X-CSRFToken"], ctx)
    delete headers["X-Web-Device-Id"]
    delete headers["X-Mid"]
    console.log(headers)
    return (await axios.get(`https://www.instagram.com/graphql/query/?query_hash=${ctx.queries.posts}&variables=${variables}`, { headers })).data.data.user
}

export async function getUserHighlights(user: IUser, ctx: IContext): Promise<IHighlights> {
    throw new Error("This function requires to be logged in, not supported yet.")
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

    headers["Referer"] = `https://www.instagram.com/${user.username}/`

    return (await axios.get(`https://www.instagram.com/graphql/query/?query_hash=${ctx.queries.highlights}&variables=${variables}`, { headers })).data.data.user
}