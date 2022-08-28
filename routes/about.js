import { Router } from "express"

export const ABOUT = Router()

ABOUT.get("/", (_, res) => res.render("about.njk"))