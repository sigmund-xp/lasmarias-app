import jwt from 'jsonwebtoken'
import { tokenVerificationErrors } from '../utils/tokenManager.js'

export const requireToken = (req, res, next) => {
  try {
    let token = req.headers?.authorization
    if (!token) {
      return res.status(401).json({ error: 'Error de sesion' })
    } else {
      token = token.split(' ')[1]
      const { uid } = jwt.verify(token, process.env.SECRET_JWT_KEY)
      req.uid = uid
      next()
    }
  } catch (error) {
    return res.status(401).json({ error: tokenVerificationErrors(error) })
  }
}
