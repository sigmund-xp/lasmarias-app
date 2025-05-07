import { Router } from 'express'
import { getLinks, createLink, getLink, deleteLink, updateLink } from '../controllers/link.controller.js'
import { requireToken } from '../middlewares/requireToken.js'
import { bodyLinkValidator, paramObjectIdValidator } from '../middlewares/validatorManager.js'
const router = Router()

router.get('/', requireToken, getLinks) // get all
router.get('/:id', requireToken, paramObjectIdValidator, getLink) // get one by ID
router.post('/', requireToken, bodyLinkValidator, createLink)// create one
router.delete('/:id', requireToken, paramObjectIdValidator, deleteLink) // delete one by ID
router.patch('/:id', requireToken, paramObjectIdValidator, bodyLinkValidator, updateLink) // update one by ID

export default router
