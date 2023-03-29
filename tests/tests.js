const IGAPI = require("../dist/index.js"),
    { writeFileSync } = require("fs")
    target = "sunnyrayyxo"

/**
 * 
 * @param {String} target THe target to fetch data from.
 * @returns {Promise<IContext>} The found context.
 */
async function getContext(target) {
    const ctxFilename = `../ctx/${target}.json`
    let ctx = null

    try {
        return require(ctxFilename)
    } catch (e) {
        ctx = await IGAPI.auth(target)
    }
    try {
        writeFileSync(ctxFilename, JSON.stringify(ctx), { encoding: "utf-8", flag: "w+" })
    } catch (e1) {
        console.warn(`Unable to save the context at ${ctxFilename}. Please, make sure nodejs has permissions to write in this path.`)
        console.error(e1)
    }
    return ctx
}

getContext(target).then(async (ctx) => {
    const user = await IGAPI.getUser(target, ctx),
        posts = await IGAPI.getAllUserPosts(user, ctx, { first: 12, after: null })

    writeFileSync("output_posts.json", JSON.stringify(posts), { encoding: "utf-8", flag: "w+" })
}).catch(console.error)