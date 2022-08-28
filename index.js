import express from "express"
import fs from "fs/promises"
import hljs from "highlight.js"
import { marked } from "marked"
import njk from "nunjucks"
import njkMarkdown from "nunjucks-markdown"
import { ROUTES } from "./routes/routes.js"
import setup from "./setup.js"

await setup()

const SERVER = express()
const SETTINGS = JSON.parse((await fs.readFile("data/settings.json")).toString())

// Set up Nunjucks...
const NUNJUCKS_ENV = njk.configure(
    "views",
    {
        autoescape: true,
        express: SERVER,
        lstripBlocks: true,
        trimBlocks: true,
        watch: true,
    }
)

// Set up markdown...
marked.use({
    gfm: true,
    highlight: (code, lang) => hljs.highlight(code, { language: hljs.getLanguage(lang) ? lang : "plaintext" }).value
})
njkMarkdown.register(NUNJUCKS_ENV, marked)


SERVER.use("/assets", express.static("assets"))
SERVER.use("/", ROUTES)

SERVER.listen(
    SETTINGS.port,
    () => console.log(`Server started on http://localhost:${SETTINGS.port}!\nThe admin interface is available on http://localhost:${SETTINGS.port}/control`)
)