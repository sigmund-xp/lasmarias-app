import { Router } from 'express'
import { login, register, refreshToken, verify, logout } from '../controllers/auth.controller.js'
import { requireRefreshToken } from '../middlewares/requireRefreshToken.js'
import { bodyLoginValidator, bodyRegisterValidator, logBody } from '../middlewares/validatorManager.js'

const router = Router()

router.post('/register', logBody, bodyRegisterValidator, register)
router.post('/login', logBody, bodyLoginValidator, login)
router.get('/refresh', requireRefreshToken, refreshToken)
router.post('/verify/:token', verify)
router.get('/logout', logout)

export default router
