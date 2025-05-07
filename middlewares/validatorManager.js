import { validationResult, body, param } from 'express-validator'
import mongoose from 'mongoose'

export const validationResultExpress = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  next()
}

export const paramObjectIdValidator = [
  param('id').trim().notEmpty().escape()
    .custom(
      async (value) => {
        if (!mongoose.isValidObjectId(value)) {
          throw new Error('Debe enviarse un id de Link válido')
        }
      }
    ),
  validationResultExpress
]

export const bodyLinkValidator = [
  body('longLink', 'Formato link incorrecto').trim().notEmpty(),
  validationResultExpress
]

export const bodyRegisterValidator = [
  body('email', 'Formato de email incorrecto')
    .isEmail()
    .normalizeEmail(),
  body('password', 'Formato de password imcorrecto')
    .trim()
    .isLength({ min: 6 }),
  validationResultExpress
]

export const bodyLoginValidator = [
  body('email', 'Formato de email incorrecto')
    .isEmail()
    .normalizeEmail(),
  body('password', 'Formato de password imcorrecto')
    .trim()
    .isLength({ min: 6 }),
  validationResultExpress
]
