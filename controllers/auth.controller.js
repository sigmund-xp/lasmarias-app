import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { generateRefreshToken, generateToken, tokenVerificationErrors } from '../utils/tokenManager.js'

export const register = async (req, res) => {
  console.log('Register')
  const { email, name, phoneArea, phoneNumber, password, role } = req.body
  try {
    let user = await User.findOne({ email })
    if (user) return res.status(403).json({ error: 'El usuario ya existe' })

    user = new User({ email, name, phoneArea, phoneNumber, password, role })
    await user.save()

    const { token, expiresIn } = generateToken(user.id)
    generateRefreshToken(user.id, res)

    return res.status(201).json({ token, expiresIn })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

export const login = async (req, res) => {
  console.log('Login')
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      console.log(`No existe el usuario [${email}]`)
      return res.status(400).json({ error: 'No pudimos iniciar sesión. Verificá tus datos e intentá nuevamente.' })
    }

    const isValidPass = await user.comparePassword(password)
    if (!isValidPass) {
      console.log('Contraseña invalida')
      return res.status(400).json({ error: 'No pudimos iniciar sesión. Verificá tus datos e intentá nuevamente.' })
    }

    const { token, expiresIn } = generateToken(user.id)
    generateRefreshToken(user.id, res)

    return res.json({ token, expiresIn })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ error: 'No pudimos iniciar sesión. Verificá tus datos e intentá nuevamente.' })
  }
}

export const setUserRole = async (req, res) => {
  try {
    const { id } = req.params
    const { role } = req.body

    const user = await User.findByIdAndUpdate(id, { role })
    if (!user) return res.status(404).json({ error: 'No existe el Usuario' })

    return res.json({ user })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error del servidor' })
  }
}

export const refreshToken = (req, res) => {
  try {
    const { token, expiresIn } = generateToken(req.uid)
    return res.json({ token, expiresIn })
  } catch (error) {
    return res.status(401).json({ error: tokenVerificationErrors(error) })
  }
}

export const verify = async (req, res) => {
  const { token } = req.params
  try {
    const { uid } = jwt.verify(token, process.env.SECRET_JWT_EMAIL_KEY)
    const user = await User.findById(uid)
    if (!user) {
      return res.status(404).json({ error: 'El usuario no existe' })
    } else if (user.password) {
      return res.status(403).json({ error: 'Token caducado' })
    }

    return res.json({ uid, name: user.name, email: user.email })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

export const logout = (req, res) => {
  res.clearCookie('refreshToken')
  return res.json({ ok: true })
}
