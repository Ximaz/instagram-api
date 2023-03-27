import axios from "axios"
import { IUser } from "./types/IUser"

export async function getUserContent(username: string, ctx: object): Promise<IUser>{
    return (await axios.get(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, { headers: ctx })).data.data.user
}