import { User } from '../models/User.js'
import { generateRefreshToken, generateToken, tokenVerificationErrors } from '../utils/tokenManager.js'

export const register = async (req, res) => {
  console.log('Register')
  const { email, password } = req.body
  try {
    let user = await User.findOne({ email })
    if (user) return res.status(403).json({ error: 'El usuario ya existe' })

    user = new User({ email, password })
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
      return res.status(400).json({ error: 'Credenciales incorrectas' })
    }

    const isValidPass = await user.comparePassword(password)
    if (!isValidPass) {
      console.log('Contraseña invalida')
      return res.status(400).json({ error: 'Credenciales incorrectas' })
    }

    const { token, expiresIn } = generateToken(user.id)
    generateRefreshToken(user.id, res)

    return res.json({ token, expiresIn })
  } catch (error) {
    return res.status(400).json({ error: 'Credenciales incorrectas' })
  }
}

export const infoUser = async (req, res) => {
  try {
    const user = await User.findById(req.uid).lean()
    return res.json({ uid: user._id, email: user.email })
  } catch (error) {
    return res.status(400).json({ error: 'Credenciales incorrectas' })
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

export const logout = (req, res) => {
  res.clearCookie('refreshToken')
  return res.json({ ok: true })
}
