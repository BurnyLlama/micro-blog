import { Router } from 'express'
import { BLOG } from './blog.js'
import { CONTROL_PANEL } from './controlPanel.js'
import { ABOUT } from './about.js'

export const ROUTES = Router()

ROUTES.use('/', BLOG)
ROUTES.use('/control', CONTROL_PANEL)
ROUTES.use('/about', ABOUT)
