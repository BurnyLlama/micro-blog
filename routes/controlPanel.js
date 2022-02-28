import { Router } from 'express'

export const CONTROL_PANEL = Router()

CONTROL_PANEL.get('/', (_, res) => res.render('controlPanel.njk'))