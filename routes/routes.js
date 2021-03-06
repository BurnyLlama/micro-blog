import { Router } from 'express'
import { BLOG } from './blog.js'
import { CONTROL_PANEL } from './controlPanel.js'
import { ABOUT } from './about.js'
import { POSTS } from './posts.js'

export const ROUTES = Router()

ROUTES.use('/', BLOG)
ROUTES.use('/about', ABOUT)
ROUTES.use('/control', CONTROL_PANEL)
ROUTES.use('/posts', POSTS)
