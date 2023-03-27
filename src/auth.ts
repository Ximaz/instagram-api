/**
 * This file will contain all methods required to build the most efficient
 * headers dictionnary using information stored into Instagram webpage such
 * as X-ASBD-ID, X-IG-App-ID, X-IG-WWW-Claim, X-Mid, X-Requested-With and
 * X-Web-Device-Id .
 * 
 * node-html-parser will be a usefull npm module because most of those
 * informations are stored into the HTML itself.
 */

import axios from "axios"

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    return Math.floor(Math.random() * (Math.floor(max) - min)) + min;
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
}

async function getUserPage(username: string): Promise<string> {
    return (await axios.get(`https://www.instagram.com/${username}/`, { headers: defaultHeaders })).data
}

async function getIGABSDId(html: string): Promise<number | undefined> {
    const script = /https:\/\/static.cdninstagram.com\/rsrc.php\/.+\/epE5i0QOSd0_g-4s2UsQoJfcphncWcLppvnpbKe-PMwB2K43EzjF0VNXpYt2DgMBFx.+js(?:\?_nc_x=\w+)/gm.exec(html)?.at(0)
    if (!script)
        return undefined

    const content = (await axios.get(script)).data
    if (!content)
        return undefined
    
    const ASBD_ID = /\w+="(\d+)";\w+.ASBD_ID=\w+/gm.exec(content)?.at(1)
    if (!ASBD_ID)
        return undefined
    
    return parseInt(ASBD_ID)
}

function getIGAppId(html: string): number | undefined {    
    const appId = /\"X\-IG\-App\-ID\":\"(\d+)\"/gm.exec(html)?.at(1)
    if (!appId)
        return undefined

    return parseInt(appId);
}

function getTargetId(html: string): number | undefined {
    const targetId = /"props":{"id":"(\d+)"/gm.exec(html)?.at(1)
    if (!targetId)
        return undefined

    return parseInt(targetId)
}

async function getIGWWWClaim(targetId: number, deviceId: string, ASBDId: number, IGAppId: number, XMid: string): Promise<string | undefined> {
    const reqHeaders = {
        ...defaultHeaders,
        "X-Web-Device-Id": deviceId,
        "X-ASBD-ID": ASBDId.toString(),
        "X-IG-App-ID": IGAppId.toString(),
        "X-Mid": XMid,
        "X-Requested-With": "XMLHttpRequest"
    }

    const { headers } = await axios.get(`https://www.instagram.com/api/v1/web/get_ruling_for_content/?content_type=PROFILE&target_id=${targetId}`, { headers: reqHeaders })
    if (headers["access-control-expose-headers"] == "X-IG-Set-WWW-Claim")
        return "0"
    return undefined
}

function getIgDeviceId(html: string): string | undefined {
    const did = /"_js_ig_did":{"value":"([A-F0-9\-]+)"/gm.exec(html)?.at(1)
    if (!did)
        return undefined
    
    return did
}

function buildXMid(): string {
    let token: string = ""
    const min = Math.pow(2, 29),
        max = Math.pow(2, 32)

    for (let i: number = 0; i < 8; i++)
        token += getRandomInt(min, max).toString(36)
    return token
}

export default async function (target: string): Promise<object | undefined> {
    const page = await getUserPage(target),
        target_id = getTargetId(page),
        ig_app_id = getIGAppId(page),
        ig_did = getIgDeviceId(page),
        ig_mid = buildXMid(),
        ig_asbd_id = await getIGABSDId(page)

    if (!target_id || !ig_app_id || !ig_did || !ig_asbd_id)
        throw new Error(`One of the required fields is missing : target_id (${target_id}), ig_app_id (${ig_app_id}), ig_did (${ig_did}), ig_asbd_id (${ig_asbd_id})`)
    
    const ig_www_claim = await getIGWWWClaim(target_id, ig_did, ig_asbd_id, ig_app_id, ig_mid)
    if (!ig_www_claim)
        throw new Error("Unable to fetch the WWW-Claim value.")

    return {
        ...defaultHeaders,
        "X-Mid": ig_mid,
        "X-IG-App-ID": ig_app_id.toString(),
        "X-ASBD-ID": ig_asbd_id.toString(),
        "X-IG-WWW-Claim": ig_www_claim,
        "X-Web-Device-Id": ig_did,
        "X-Requested-With": "XMLHttpRequest",
    }
}