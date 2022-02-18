import express from 'express'
import { marked } from 'marked'
import njk from 'nunjucks'
import njkMarkdown from 'nunjucks-markdown'

const SERVER = express()

const NUNJUCKS_ENV = njk.configure(
    'content',
    {
        autoescape: true,
        express: SERVER,
        lstripBlocks: true,
        trimBlocks: true,
        watch: true,
    }
)

njkMarkdown.register(NUNJUCKS_ENV, marked)

SERVER.use('/assets', express.static('assets'))
SERVER.get('/', (_, res) => res.render('index.njk'))

SERVER.listen(12345, () => console.log("Server started!"))