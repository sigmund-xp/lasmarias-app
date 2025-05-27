import mongoose from 'mongoose'

const rolesSchema = new mongoose.Schema({
  description: { type: String, required: true, unique: true },
  permissions: { type: String, required: true }
})

export const Role = mongoose.model('Roles', rolesSchema, 'Roles')
