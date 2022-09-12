import { Router } from "express"
import Post from "../models/Post.js"

export const SEARCH = Router()

SEARCH.get("/", (req, res) => {
    const query = req.query.q instanceof Array ? req.query.q[req.query.q.length - 1] : req.query.q
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
                        .replace(new RegExp(`\\b\\S*?(${query})\\S*?\\b`, "igm"), "<span class=\"highlight\">$&</span>")
                        .replace(new RegExp(query, "igm"), "<span class=\"highlight\">$&</span>"),
                    text: e.text
                        .replace(new RegExp(`\\b\\S*?(${query})\\S*?\\b`, "igm"), "<span class=\"highlight\">$&</span>")
                        .replace(new RegExp(query, "igm"), "<span class=\"highlight\">$&</span>"),
                }
            )
        })
    res.render("search.njk", { query, results })
})
