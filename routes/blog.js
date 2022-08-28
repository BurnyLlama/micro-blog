import { Router } from "express"
import fs from "fs/promises"

export const BLOG = Router()

BLOG.get(
    "/",
    (_, res) => {
        fs.readFile("./data/posts.json").then(
            file => {
                const POSTS = JSON.parse(file.toString()).reverse()
                res.render("posts.njk", { posts: POSTS })
            }
        )
    }
)