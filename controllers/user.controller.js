import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { User } from '../models/User.js'
import { ExtraUserData } from '../models/ExtraUserData.js'
import { Role } from '../models/Role.js'
import { generateEmailToken } from '../utils/tokenManager.js'
import { sendVerifyEmail } from '../controllers/event.controller.js'

export const getUserInfo = async (req, res) => {
  console.log('getUserInfo')
  let token = req.headers?.authorization
  token = token.split(' ')[1]
  const { uid } = jwt.verify(token, process.env.SECRET_JWT_KEY)
  const user = await User.findById(uid).select('email name phoneArea phoneNumber').populate({
    path: 'role',
    select: 'description permissions'
  }).populate('extraData')

  if (!user) {
    return res.status(500).json({ error: 'Error de credenciales' })
  } else {
    return res.json({ userInfo: user.toJSON() })
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
    const extraData = new ExtraUserData({
      kind,
      userId: user.id,
      veteSpecialty: '',
      address: { calle: '', numero: '', piso: '', dpto: '', codPostal: '', localidad: '', provincia: '' },
      emergency: { name: '', phoneArea: '', phoneNumber: '' },
      billingData: { cbu: '', alias: '', name: '' }
    })
    await extraData.save()
    await sendVerifyEmail(name, email, { token: await generateEmailToken({ uid: user.id }) })

    return res.status(201).json({ id: user.id })
  } catch (error) {
    console.log(error)
    if (error.code === 11000) {
      return res.status(409).json({ error: 'El usuario ya existe' })
    }
    return res.status(500).json({ error: error.message })
  }
}

export const updateProfileUser = async (req, res) => {
  console.log('updateProfileUser')
  const { email, name, phoneArea, phoneNumber, extraData } = req.body
  try {
    await User.findByIdAndUpdate(req.uid, { email, name, phoneArea, phoneNumber })
    if (req.uKind !== 'A') {
      await ExtraUserData.findByIdAndUpdate(extraData.id, { address: extraData.address, emergency: extraData.emergency, billingData: extraData.billingData })
    }
    return res.status(201).json({ ok: true })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

export const registerUser = async (req, res) => {
  console.log('registerUser')
  const { phoneArea, phoneNumber, password } = req.body

  try {
    const hashedPassword = await hashedPass(password)
    await User.findByIdAndUpdate(req.uid, { phoneArea, phoneNumber, password: hashedPassword, changePassword: false }, { runValidators: true })
    return res.status(201).json({ ok: true })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

const hashedPass = async (password) => {
  const salt = await bcryptjs.genSalt(10)
  return await bcryptjs.hash(password, salt)
}

const getRoleId = async (kind) => {
  let roleName = 'Propietario'
  if (kind === 'V') {
    roleName = 'Veterinario'
  }
  const role = await Role.findOne({ description: roleName })
  return role._id
}
