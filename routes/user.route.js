import { Router } from 'express'
import { requireToken } from '../middlewares/requireToken.js'
import { getUserInfo, getUser, createUser } from '../controllers/user.controller.js'
import { logBody, paramObjectIdValidator } from '../middlewares/validatorManager.js'

const router = Router()

router.get('/:id', requireToken, paramObjectIdValidator, getUser)
router.post('/info', requireToken, getUserInfo)
router.post('/', requireToken, logBody, createUser)

export default router
