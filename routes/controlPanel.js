import argon2 from "argon2"
import { Router } from "express"
import fs from "fs/promises"
import multer from "multer"

const ADMIN_PASSWORD = JSON.parse((await fs.readFile("data/settings.json")).toString()).password
export function verifyPass(pass) {
    return new Promise(
        resolve => {
            argon2.verify(ADMIN_PASSWORD, pass)
                .then(match  => resolve(match))
                .catch(() => resolve(false))
        }
    )
}

export const CONTROL_PANEL = Router()

CONTROL_PANEL.use(multer().none())

CONTROL_PANEL.get(
    "/",
    async (_, res) => {
        const ABOUT_TEXT = (await fs.readFile("views/about.md")).toString()
        const SETTINGS   = JSON.parse((await fs.readFile("data/settings.json")).toString())
        res.render("controlPanel.njk", { aboutText: ABOUT_TEXT, settings: SETTINGS })
    }
)

CONTROL_PANEL.post(
    "/set/aboutText",
    async (req, res) => {
        const SETTINGS = JSON.parse((await fs.readFile("data/settings.json")).toString())

        if (!await verifyPass(req.body.password ?? "")) {
            const ABOUT_TEXT = (await fs.readFile("views/about.md")).toString()
            return res.render("controlPanel.njk", { success: false, msg: "Wrong admin password!", err: true, settings: SETTINGS, aboutText: ABOUT_TEXT })
        }

        fs.writeFile("views/about.md", req.body["about-text"])
            .then(
                () => res.render("controlPanel.njk", { success: true, msg: "About text successfully uploaded!", settings: SETTINGS, aboutText: req.body["about-text"] })
            )
            .catch(
                async err => {
                    const ABOUT_TEXT = (await fs.readFile("views/about.md")).toString()
                    res.render("controlPanel.njk", { success: false, msg: "There was an error while setting the about text!", err, settings: SETTINGS, aboutText: ABOUT_TEXT })
                }
            )
    }
)

CONTROL_PANEL.post(
    "/set/blogName",
    async (req, res) => {
        const SETTINGS = JSON.parse((await fs.readFile("data/settings.json")).toString())
        const ABOUT_TEXT = (await fs.readFile("views/about.md")).toString()
        let newSettings = Object.assign({}, SETTINGS)
        newSettings.blogName = req.body["blog-name"]

        if (!await verifyPass(req.body.password ?? ""))
            return res.render("controlPanel.njk", { success: false, msg: "Wrong admin password!", err: true, settings: SETTINGS, aboutText: ABOUT_TEXT })

        Promise.all([
            fs.writeFile("data/settings.json", JSON.stringify(newSettings)),
            fs.writeFile("views/templates/blogName.njk", req.body["blog-name"])
        ]).then(
            () => res.render("controlPanel.njk", { success: true, msg: "Blog name successfully uploaded!", settings: SETTINGS, aboutText: req.body["about-text"] })
        ).catch(
            async err => res.render("controlPanel.njk", { success: false, msg: "There was an error while setting the blog name!", err,settings: SETTINGS, aboutText: ABOUT_TEXT })
        )
    }
)