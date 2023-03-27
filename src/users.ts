import axios from "axios"
import { IContext } from "./types/IContext"
import { IUser } from "./types/IUser"

export async function getUserContent(username: string, ctx: IContext): Promise<IUser>{
    return (await axios.get(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, { headers: ctx.headers })).data.data.user
}