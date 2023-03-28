const IGAPI = require("../dist/index.js"),
    { writeFileSync } = require("fs")
    target = "sunnyrayyxo"

/**
 * 
 * @param {String} target THe target to fetch data from.
 * @returns {Promise<IContext>} The found context.
 */
async function getContext(target) {
    const ctxFilename = `./ctx/${target}.json`
    let ctx = null
    try {
        return require(ctxFilename)
    } catch (e) {
        ctx = await IGAPI.auth(target)
    }
    try {
        writeFileSync(ctxFilename, JSON.stringify(ctx), { encoding: "utf-8", flag: "w+" })
    } catch (e) {
        console.warn(`Unable to save the context at ${ctxFilename}. Please, make sure nodejs has permissions to write in this path.`)
    }
    return ctx
}

async function sleep(ms) {
    return new Promise((res, rej) => {
        const t = setTimeout(() => { clearInterval(t); res()}, ms)
    })
}

getContext(target).then(async (ctx) => {
    const user = await IGAPI.getUser(target, ctx),
        posts = await IGAPI.getUserPosts(user, ctx, { first: 12, after: "QVFEU1dIVmpxWVMxMm1DbjFnN01nNVRfSC1yWDFWQXBLX1NhNnlYZTU1Sy01QlZXQ09tNWxJdnhndXlNX1RaV3dlT0JVR0ZjUXRncnNqLXd0dVRncXVWeg==" })
    console.log(posts.edge_owner_to_timeline_media.edges)
}).catch(console.error)