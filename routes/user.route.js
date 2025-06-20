import { Router } from 'express'
import { requireToken, requireTokenEmail } from '../middlewares/requireToken.js'
import { getUserInfo, getUser, createUser, registerUser, updateProfileUser } from '../controllers/user.controller.js'
import { logBody, paramObjectIdValidator } from '../middlewares/validatorManager.js'

const router = Router()

router.get('/:id', requireToken, paramObjectIdValidator, getUser)
router.post('/info', requireToken, getUserInfo)
router.post('/', requireToken, logBody, createUser)
router.patch('/profile', requireToken, updateProfileUser)
router.post('/register', requireTokenEmail, logBody, registerUser)

export default router
