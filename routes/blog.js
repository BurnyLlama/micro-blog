import { Router } from 'express'
import fs from 'fs/promises'

export const BLOG = Router()

BLOG.get(
    '/',
    (_, res) => {
        fs.readFile('./data/posts.json').then(
            file => {
                const POSTS = JSON.parse(file.toString())
                res.render('posts.njk', { posts: POSTS })
            }
        )
    }
)