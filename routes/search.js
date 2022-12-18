import { Router } from "express"
import Post from "../models/Post.js"

export const SEARCH = Router()

function highlight(text, pattern) {
    return text.replace(
        new RegExp(`(?<!<code>[\\s\\S]*)\\b\\S*?(${pattern})\\S*?\\b`, "ig"),
        match => `<span class=\"highlight\">${match.replace(new RegExp(pattern, "ig"), "<span class=\"highlight\">$&</span>")}</span>`
    )
}

SEARCH.get("/", (req, res) => {
    const query = req.query.q instanceof Array ? req.query.q[req.query.q.length - 1] : req.query.q
    if (!query)
        return res.render("search.njk")

    try {
        new RegExp(query)
    } catch (error) {
        return res.render("search.njk", { query, invalidRegexp: true })
    }

    const results = Post.search(query)
        .map(e => Object.assign(
                e,
                {
                    title: highlight(e.title, query),
                    text:  highlight(e.text, query)
                }
            )
        )

    res.render("search.njk", { query, results })
})
