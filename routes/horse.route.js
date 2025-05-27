import { Router } from 'express'
import { getOneHorse, getListHorses, createHorse, updateHorse, deleteHorse } from '../controllers/horse.controller.js'
import { requireToken } from '../middlewares/requireToken.js'
import { logBody, paramObjectIdValidator } from '../middlewares/validatorManager.js'

const router = Router()

router.get('/:id', requireToken, paramObjectIdValidator, getOneHorse)
router.post('/list', requireToken, logBody, getListHorses)
router.post('/', requireToken, logBody, createHorse)
router.patch('/:id', requireToken, paramObjectIdValidator, updateHorse)
router.delete('/:id', requireToken, paramObjectIdValidator, deleteHorse)

export default router
