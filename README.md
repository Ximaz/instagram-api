# Instagram API

This project is an Instagram API guest-oriented, meaning you can perform actions of data collection without having to register. However, you may be facing some Ratelimits, so I recommend you to put some delay between operations.

## Licence
Licence can be found at ``LICENCE``, it's ``GNU GPLv3``.

## Documentation

### Getting Started
Code form ``tests/tests.js`` :

```js
const IGAPI = require("../dist/index.js"),
    { writeFileSync } = require("fs"),
    target = "<target>" // Change to your target.

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
```

### Methods

``IGAPI.auth(target: string): Promise<IContext>``

This function is MENDATORY before trying to use the API, because it's return value correspond to all the context required to use the API. It contains required headers, and two queries hash representing two endpoints of Instagram's GraphQL API.

<hr>

``IGAPI.getUser(username: string, ctx: IContext): Promise<IUser>``

This function allows you to fetch pretty much all data around the user account you're trying to access data. This function is also mendatory in order to use the API correctly because it's return value is a IUser object which is required for all other functions of the API.

<hr>

``IGAPI.getUserPosts(user: IUser, ctx: IContext, { first: 12, after: null }): Promise<IPosts>``

This function allows you to fetch ``first`` posts starting from ``after``. If ``after`` is set to ``null``, fetch the ``first`` posts starting from the top of the account.

> **MAY TRIGGER THE RATELIMIT SYSTEM !**

<hr>

``IGAPI.getAllUserPosts(user: IUser, ctx: IContext, { first: 12, after: null }): Promise<IPost[]>``

This function allows you to *try* to fetch all posts, ``first`` posts per ``first`` posts, starting from ``after``. It quite the same thing as ``IGAPI.getUserPosts`` but it handles ``after`` itself, so you just get a whole bunch of posts.

> **MAY TRIGGER THE RATELIMIT SYSTEM !**

<hr>

``IGAPI.getUserReels(user: IUser, ctx: IContext, { page_size: 12, max_id: null }): Promise<IReels>``

This function allows you to fetch ``page_size`` reels starting from ``after``. If ``after`` is set to ``null``, fetch the ``page_size`` reels starting from the top of the account.

> **MAY TRIGGER THE RATELIMIT SYSTEM !**

<hr>

``IGAPI.getAllUserReels(user: IUser, ctx: IContext, { page_size: 12, max_id: null }): Promise<IReel[]>``

This function allows you to *try* to fetch all reels, ``page_size`` reels per ``page_size`` reels, starting from ``max_id``. It quite the same thing as ``IGAPI.getUserReels`` but it handles ``max_id`` itself, so you just get a whole bunch of reels.

> **MAY TRIGGER THE RATELIMIT SYSTEM !**

<hr>

``IGAPI.getUserHighlights(user: IUser, ctx: IContext): Promise<IHighlights>``

This function allows you to fetch highlights.

> **MAY TRIGGER THE RATELIMIT SYSTEM !**

### Types
All types' definitions can be found at ``src/types/<type>.ts``
