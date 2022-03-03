import { Router } from 'express'
import fs from 'fs/promises'

export const CONTROL_PANEL = Router()

CONTROL_PANEL.get(
    '/',
    async (_, res) => {
        const ABOUT_TEXT = (await fs.readFile("views/about.md")).toString()
        const SETTINGS   = JSON.parse((await fs.readFile("data/settings.json")).toString())
        res.render('controlPanel.njk', { aboutText: ABOUT_TEXT, settings: SETTINGS })
    }
)

CONTROL_PANEL.post(
    '/set/aboutText',
    async (req, res) => {
        const SETTINGS = JSON.parse((await fs.readFile("data/settings.json")).toString())
        fs.writeFile("views/about.md", req.body["about-text"])
            .then(
                () => res.render('controlPanel.njk', { success: true, msg: "About text successfully uploaded!", settings: SETTINGS, aboutText: req.body["about-text"] })
            )
            .catch(
                async err => {
                    const ABOUT_TEXT = (await fs.readFile("views/about.md")).toString()
                    res.render('controlPanel.njk', { success: false, msg: "There was an error while setting the about text!", err,settings: SETTINGS, aboutText: ABOUT_TEXT })
                }
            )
    }
)

CONTROL_PANEL.post(
    '/set/blogName',
    async (req, res) => {
        const SETTINGS = JSON.parse((await fs.readFile("data/settings.json")).toString())
        const ABOUT_TEXT = (await fs.readFile("views/about.md")).toString()
        let newSettings = Object.assign({}, SETTINGS)
        newSettings.blogName = req.body["blog-name"]

        Promise.all([
            fs.writeFile("data/settings.json", JSON.stringify(newSettings)),
            fs.writeFile("views/templates/blogName.njk", req.body["blog-name"])
        ]).then(
            () => res.render('controlPanel.njk', { success: true, msg: "Blog name successfully uploaded!", settings: SETTINGS, aboutText: req.body["about-text"] })
        ).catch(
            async err => res.render('controlPanel.njk', { success: false, msg: "There was an error while setting the blog name!", err,settings: SETTINGS, aboutText: ABOUT_TEXT })
        )
    }
)