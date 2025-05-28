import jwt from 'jsonwebtoken'
import { tokenVerificationErrors } from '../utils/tokenManager.js'

export const requireToken = (req, res, next) => {
  console.log('requireToken')
  try {
    let token = req.headers?.authorization
    if (!token) {
      console.log('No hay token')
      console.log(req.headers)
      return res.status(401).json({ error: 'Error de sesion' })
    } else {
      token = token.split(' ')[1]
      const { uid } = jwt.verify(token, process.env.SECRET_JWT_KEY)
      req.uid = uid
      next()
    }
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: tokenVerificationErrors(error) })
  }
}

export const requireRefreshToken = (req, res, next) => {
  try {
    const cookieToken = req.cookies.refreshToken
    if (!cookieToken) throw new Error('Sesion expirada')
    const { uid } = jwt.verify(cookieToken, process.env.SECRET_JWT_REFRESH_KEY)
    req.uid = uid
    next()
  } catch (error) {
    return res.status(401).json({ error: tokenVerificationErrors(error) })
  }
}

export const requireTokenEmail = (req, res, next) => {
  console.log('requireToken')
  try {
    let token = req.headers?.authorization
    if (!token) {
      console.log('No hay token')
      console.log(req.headers)
      return res.status(401).json({ error: 'Error de sesion' })
    } else {
      token = token.split(' ')[1]
      const { uid } = jwt.verify(token, process.env.SECRET_JWT_EMAIL_KEY)
      req.uid = uid
      next()
    }
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: tokenVerificationErrors(error) })
  }
}
