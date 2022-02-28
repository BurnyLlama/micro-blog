import express from 'express'
import { marked } from 'marked'
import njk from 'nunjucks'
import njkMarkdown from 'nunjucks-markdown'
import { ROUTES } from './routes/routes.js'

const SERVER = express()

const NUNJUCKS_ENV = njk.configure(
    'views',
    {
        autoescape: true,
        express: SERVER,
        lstripBlocks: true,
        trimBlocks: true,
        watch: true,
    }
)

marked.use({
    gfm: true
})

njkMarkdown.register(NUNJUCKS_ENV, marked)

SERVER.use('/assets', express.static('assets'))
SERVER.use('/', ROUTES)

SERVER.listen(12345, () => console.log("Server started!"))