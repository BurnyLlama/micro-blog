import { Router } from "express"
import fs from "fs/promises"
import multer from "multer"
import webp from "webp-converter"
import Post from "../models/Post.js"
import { verifyPass } from "./controlPanel.js"


// Make sure webp has the permissions it needs and that a temp directory exists
webp.grant_permission()
await fs.access("./node_modules/webp-converter/temp")
    .catch(async () => await fs.mkdir("./node_modules/webp-converter/temp"))

export const POSTS = Router()

POSTS.get(
    "/:id/:title_id",
    (req, res) => res.render(
        "posts.njk",
        {
            posts: [Post.get(req.params.id, req.params.title_id)]
        }
    )
)

POSTS.post(
    "/new",
    multer({ storage: multer.memoryStorage() }).single("blog-post-image"),
    async (req, res) => {
        const SETTINGS = JSON.parse((await fs.readFile("data/settings.json")).toString())
        const ABOUT_TEXT = (await fs.readFile("views/about.md")).toString()

        const NO_TITLE     = req.body["blog-post-title"]                    ? false : true
        const NO_BODY      = req.body["blog-post-body"]                     ? false : true
        const NO_IMAGE     = req.file                                       ? false : true
        const NOT_AN_IMAGE = req.file && !req.file.mimetype.match(/image/g) ? true  : false

        if (NO_TITLE || NO_BODY || NOT_AN_IMAGE)
            return res.render(
                "controlPanel.njk",
                {
                    success: false,
                    msg: "Missing field!",
                    err: `${NO_TITLE ? "You forgot a title!\n" : ""}${NO_BODY ? "You forgot a text body!\n" : ""}${NOT_AN_IMAGE ? "File is not an image!" : ""}`,
                    settings: SETTINGS,
                    aboutText: ABOUT_TEXT,
                    blogPostTitle: req.body["blog-post-title"],
                    blogPostBody: req.body["blog-post-body"],
                }
            )

        if (!await verifyPass(req.body.password ?? ""))
            return res.render("controlPanel.njk", { success: false, msg: "Wrong admin password!", err: true, settings: SETTINGS, aboutText: ABOUT_TEXT })

        const POST = Post.create(req.body["blog-post-title"], req.body["blog-post-body"])
        Post.save(POST)

        res.render(
            "controlPanel.njk",
            {
                success: true,
                msg: "Successfully uploaded your post! (Your image will be up momentarily...)",
                settings: SETTINGS,
                aboutText: ABOUT_TEXT,
            }
        )

        if (NO_IMAGE) return

        const WEBP_BUFFER = await webp.buffer2webpbuffer(req.file.buffer, req.file.mimetype.replace("image/", ""), "-q 90")
        await fs.writeFile(`./assets/images/${POST.id}.webp`, WEBP_BUFFER)
    }
)