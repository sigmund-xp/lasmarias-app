import { Router } from 'express'
import { login, register, refreshToken, logout, test } from '../controllers/auth.controller.js'
import { requireRefreshToken } from '../middlewares/requireRefreshToken.js'
import { bodyLoginValidator, bodyRegisterValidator } from '../middlewares/validatorManager.js'

const router = Router()

router.post('/register', bodyRegisterValidator, register)
router.post('/login', bodyLoginValidator, login)
router.get('/refresh', requireRefreshToken, refreshToken)
router.get('/logout', logout)
router.get('/', test)

export default router
