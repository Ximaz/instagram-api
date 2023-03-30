const IGAPI = require("../dist/index.js"),
    { writeFileSync } = require("fs"),
    target = "sunnyrayyxo" // Change to your target.

/**
 * 
 * @param {String} target The target to fetch data from.
 * @returns {Promise<IContext>} The found context.
 */
async function getContext(target) {
    const ctxFilename = `../ctx/${target}.json`
    let ctx = null

    try {
        // Tries to read the context from ctx path
        return require(ctxFilename)
    } catch (e) {
        // If not found, creating a new ctx
        ctx = await IGAPI.auth(target)
    }
    writeFileSync(ctxFilename, JSON.stringify(ctx), { encoding: "utf-8", flag: "w+" })
    return ctx
}

getContext(target).then(async (ctx) => {
    // Fetch the User object using the context.
    const user = await IGAPI.getUser(target, ctx)
    
    // Fetch first 12 user's posts.
    const posts = await IGAPI.getUserPosts(user, ctx, { first: 12, after: null })

    // Write the posts result into "output_posts.json" file.
    writeFileSync("output_posts.json", JSON.stringify(posts), { encoding: "utf-8", flag: "w+" })
}).catch(console.error)