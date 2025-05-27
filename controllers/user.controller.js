import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { Role } from '../models/Role.js'
import { generateEmailToken } from '../utils/tokenManager.js'
import { sendVerifyEmail } from '../controllers/event.controller.js'

export const getUserInfo = async (req, res) => {
  console.log('getUserInfo')
  let token = req.headers?.authorization
  token = token.split(' ')[1]
  const { uid } = jwt.verify(token, process.env.SECRET_JWT_KEY)
  const user = await User.findById(uid).select('name').populate({
    path: 'role',
    select: 'description permissions'
  }).populate('extraData')

  if (!user) {
    return res.status(500).json({ error: 'Error de credenciales' })
  } else {
    return res.json({ userInfo: user })
  }
}

export const getUser = async (req, res) => {
  console.log('getUser')
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'El usuario no existe' })

    return res.json({ user })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

export const createUser = async (req, res) => {
  console.log('createUser')
  const { name, email, kind } = req.body

  try {
    const user = new User({ name, email, role: await getRoleId(kind), changePassword: true })
    await user.save()
    await sendVerifyEmail(name, email, { token: await generateEmailToken({ name, email }) })

    return res.status(201).json({ id: user.id })
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      return res.status(409).json({ error: 'El usuario ya existe' })
    }
    return res.status(500).json({ error: error.message })
  }
}

const getRoleId = async (kind) => {
  let roleName = 'Propietario'
  if (kind === 'V') {
    roleName = 'Veterinario'
  }
  const role = await Role.findOne({ description: roleName })
  return role._id
}
