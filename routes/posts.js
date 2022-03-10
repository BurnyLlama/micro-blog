import fs from 'fs/promises'
import { Router } from 'express'
import { randomUUID } from 'crypto'
import multer from 'multer'
import webp from 'webp-converter'


// Make sure webp has the permissions it needs and that a temp directory exists
webp.grant_permission()
await fs.access('./node_modules/webp-converter/temp')
    .catch(async () => await fs.mkdir('./node_modules/webp-converter/temp'))

export const POSTS = Router()

POSTS.post(
    '/new',
    multer({ storage: multer.memoryStorage() }).single('blog-post-image'),
    async (req, res) => {
        const SETTINGS = JSON.parse((await fs.readFile("data/settings.json")).toString())
        const ABOUT_TEXT = (await fs.readFile("views/about.md")).toString()

        const NO_TITLE     = req.body['blog-post-title']                    ? false : true
        const NO_BODY      = req.body['blog-post-body']                     ? false : true
        const NO_IMAGE     = req.file                                       ? false : true
        const NOT_AN_IMAGE = req.file && !req.file.mimetype.match(/image/g) ? true  : false

        if (NO_TITLE || NO_BODY || NOT_AN_IMAGE)
            return res.render(
                'controlPanel.njk',
                {
                    success: false,
                    msg: "Missing field!",
                    err: `${NO_TITLE ? "You forgot a title!\n" : ''}${NO_BODY ? "You forgot a text body!\n" : ''}${NOT_AN_IMAGE ? "File is not an image!" : ''}`,
                    settings: SETTINGS,
                    aboutText: ABOUT_TEXT,
                    blogPostTitle: req.body['blog-post-title'],
                    blogPostBody: req.body['blog-post-body'],
                }
            )

        const TIME = new Date(Date.now())
        const POST_ID = `${randomUUID()}$${TIME.valueOf()}`

        const POST = {
            id: POST_ID,
            title: req.body['blog-post-title'],
            time: TIME,
            niceTime: `${TIME.toLocaleDateString()} -- ${TIME.toLocaleTimeString()}`,
        }

        await fs.writeFile(`./views/posts/${POST_ID}.md`, req.body['blog-post-body'])

        const OLD_POST_JSON = (await fs.readFile("./data/posts.json")).toString()
        const OLD_POST_DATA = JSON.parse(OLD_POST_JSON ? OLD_POST_JSON : "[]")

        const NEW_POST_DATA = [...OLD_POST_DATA, POST]
        const NEW_POST_JSON = JSON.stringify(NEW_POST_DATA, null, 2)
        await fs.writeFile("./data/posts.json", NEW_POST_JSON)

        res.render(
            'controlPanel.njk',
            {
                success: true,
                msg: "Successfully uploaded your post! (Your image will be up momentarily...)",
                settings: SETTINGS,
                aboutText: ABOUT_TEXT,
            }
        )

        if (NO_IMAGE) return;

        const WEBP_BUFFER = await webp.buffer2webpbuffer(req.file.buffer, req.file.mimetype.replace("image/", ""), "-q 90")
        await fs.writeFile(`./assets/images/${POST_ID}.webp`, WEBP_BUFFER)
    }
)