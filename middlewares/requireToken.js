import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { tokenVerificationErrors } from '../utils/tokenManager.js'

export const requireToken = async (req, res, next) => {
  console.log('requireToken')
  try {
    let token = req.headers?.authorization
    console.log(token)
    if (!token) {
      return res.status(401).json({ error: 'Error de sesion' })
    } else {
      token = token.split(' ')[1]
      const { uid } = jwt.verify(token, process.env.SECRET_JWT_KEY)
      req.uid = uid
      const role = await getUserRole(uid)
      req.uKind = role.description[0]
      req.uPermissions = role.permissions
      next()
    }
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: tokenVerificationErrors(error) })
  }
}

export const getUserRole = async (uid) => {
  try {
    const user = await User.findById(uid)
      .populate('role', 'description permissions')
    return user?.role || {}
  } catch (error) {
    console.error('Error getting user role:', error)
    return {}
  }
}

export const requireRefreshToken = (req, res, next) => {
  console.log('requireRefreshToken')
  try {
    console.log(req)
    const cookieToken = req.cookies.refreshToken
    console.log(cookieToken)
    if (!cookieToken) throw new Error('Sesion expirada')
    const { uid } = jwt.verify(cookieToken, process.env.SECRET_JWT_REFRESH_KEY)
    req.uid = uid
    next()
  } catch (error) {
    console.log(error)
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
