import { Router } from "express"
import Post from "../models/Post.js"

export const SEARCH = Router()

SEARCH.get("/", (req, res) => {
    const query = req.query.q
    if (!query)
        return res.render("search.njk")

    try {
        new RegExp(query)
    } catch (error) {
        return res.render("search.njk", { query, invalidRegexp: true})
    }

    const results = Post.search(query)
        .map(e => {
            return Object.assign(
                e,
                {
                    title: e.title
                        .replace(new RegExp(`\\b\\w*?(${query})\\w*?\\b`, "igm"), "<span class=\"highlight\">$&</span>")
                        .replace(new RegExp(`(<span .+?>\\w*?)(${query})(\\w*?\\b)`, "igm"), "$1<span class=\"highlight\">$2</span>$3"),
                    text: e.text
                        .replace(new RegExp(`\\b\\w*?(${query})\\w*?\\b`, "igm"), "<span class=\"highlight\">$&</span>")
                        .replace(new RegExp(`(<span .+?>\\w*?)(${query})(\\w*?\\b)`, "igm"), "$1<span class=\"highlight\">$2</span>$3"),
                }
            )
        })
    res.render("search.njk", { query, results })
})