import { Router } from "express"
import Post from "../models/Post.js"

export const SEARCH = Router()

SEARCH.get("/", (req, res) => {
    const query = req.query.q
    if (!query)
        return res.render("search.njk")

    const results = Post.search(query)
    res.render("search.njk", { query, results })
})