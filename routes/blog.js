import { Router } from "express"
import Post from "../models/Post.js"

export const BLOG = Router()

BLOG.get(
    "/",
    (_, res) => {
        const POSTS = Post.getAll()
        res.render("posts.njk", { posts: POSTS })
    }
)