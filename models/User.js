import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import { ExtraUserData } from './ExtraUserData.js'
import { Role } from './Role.js'

const { Types } = mongoose

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, index: { unique: true } },
  phoneArea: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  name: { type: String, required: true },
  role: { type: Types.ObjectId, required: true, ref: 'Roles' },
  password: { type: String, required: false },
  changePassword: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false }
})

userSchema.virtual('extraData', {
  ref: 'ExtraUserData',
  localField: '_id',
  foreignField: 'userId',
  justOne: true
})

userSchema.set('toObject', { virtuals: true })
userSchema.set('toJSON', { virtuals: true })

const getRoleName = async (roleId) => {
  const role = await Role.findById(roleId)
  if (!role) return ''
  return role.description.toUpper()
}

userSchema.pre('save', async function (next) {
  const user = this

  if (!user.isModified('password')) return next()
  try {
    const salt = await bcryptjs.genSalt(10)
    user.password = await bcryptjs.hash(user.password, salt)
    next()
  } catch (error) {
    console.log(error)
    throw new Error('Falló el hash de contraseña')
  }
})

userSchema.methods.getExtraData = async function () {
  const extraData = await ExtraUserData.findById(this.extraData)
  return extraData
}

userSchema.methods.comparePassword = async function (candidatePass) {
  return await bcryptjs.compare(candidatePass, this.password)
}

userSchema.methods.isAdmin = async function () {
  return (getRoleName(this.rol).startsWith('Admini'))
}

userSchema.methods.isSysAdmin = async function () {
  return (getRoleName(this.rol).startsWith('AdminS'))
}

userSchema.methods.isOwner = async function () {
  return (getRoleName(this.rol).startsWith('P'))
}

userSchema.methods.isVeterinarian = async function () {
  return (getRoleName(this.rol).startsWith('V'))
}

userSchema.methods.isRider = async function () {
  return (getRoleName(this.rol).startsWith('Amazon'))
}

userSchema.methods.getPermissions = async function () {
  const role = await Role.findById(this.rol)
  if (!role) return ''
  return role.permissions
}

export const User = mongoose.model('Usuarios', userSchema, 'Usuarios')
