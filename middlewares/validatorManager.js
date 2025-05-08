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
  body('phone', 'Formato de celular incorrecto').trim().notEmpty().escape()
    .custom(
      async (value) => {
        const regex = /\+54 9 \d{2,4} \d{2,4}-\d{4}/
        const result = value.match(regex)
        if (!result) throw new Error('Formato de celular incorrecto')
      }
    ),
  body('name', 'El nombre no puede estar vacio').trim().notEmpty().escape(),
  body('role', 'Formato de Rol incorrecto').trim().notEmpty().escape()
    .custom(
      async (value) => {
        if (!mongoose.isValidObjectId(value)) {
          throw new Error('Formato de Rol incorrecto')
        }
      }
    ),
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
