/**
 * This file will contain all methods required to build the most efficient
 * headers dictionnary using information stored into Instagram webpage such
 * as X-ASBD-ID, X-IG-App-ID, X-IG-WWW-Claim, X-Mid, X-Requested-With and
 * X-Web-Device-Id .
 * 
 * node-html-parser will be a usefull npm module because most of those
 * informations are stored into the HTML itself.
 */

import HTMLParser from "node-html-parser";
import axios from "axios"

export async function getUserPage(username: string): Promise<string> {
    return (await axios.get(`https://www.instagram.com/${username}/`, { headers: {
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
    } })).data
}

export function getIGAppId(html: string): number | undefined {
    const content = Array.from(HTMLParser(html).querySelectorAll("script")).at(27)?.innerHTML
    if (!content)
        return undefined
    
    const appId = /\"X\-IG\-App\-ID\":\"(\d+)\"/gm.exec(content)?.at(1)
    if (!appId)
        return undefined

    return parseInt(appId);
}