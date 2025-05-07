import jwt from 'jsonwebtoken'
import { tokenVerificationErrors } from '../utils/tokenManager.js'

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
