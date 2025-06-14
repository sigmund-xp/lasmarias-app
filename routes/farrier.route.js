import { Router } from 'express'
import { getOneFarrier, getListFarriers, createFarrier, updateFarrier, deleteFarrier } from '../controllers/farrier.controller.js'
import { requireToken } from '../middlewares/requireToken.js'
import { logBody, paramObjectIdValidator } from '../middlewares/validatorManager.js'

const router = Router()

router.get('/:id', requireToken, paramObjectIdValidator, getOneFarrier)
router.post('/list', requireToken, getListFarriers)
router.post('/', requireToken, logBody, createFarrier)
router.patch('/:id', requireToken, paramObjectIdValidator, updateFarrier)
router.delete('/:id', requireToken, paramObjectIdValidator, deleteFarrier)

export default router
