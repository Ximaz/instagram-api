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

getContext(target).then(async (ctx) => {
    const user = await IGAPI.getUser(target, ctx),
        reels = await IGAPI.getAllUserReels(user, ctx, { page_size: 12, max_id: null })

    writeFileSync("output_reels.json", JSON.stringify(reels), { encoding: "utf-8", flag: "w+" })
}).catch(console.error)