import { Router } from 'express'
import { BLOG } from './blog.js'

export const ROUTES = Router()

ROUTES.use('/', BLOG)