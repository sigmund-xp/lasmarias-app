import { Router } from 'express'
import { getParams } from '../controllers/param.controller.js'
import { requireToken } from '../middlewares/requireToken.js'

const router = Router()

router.get('/', requireToken, getParams)

export default router
