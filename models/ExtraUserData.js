import mongoose from 'mongoose'

const billingDataSchema = new mongoose.Schema({
  cbu: { type: String },
  alias: { type: String },
  name: { type: String }
})

const addressSchema = new mongoose.Schema({
  calle: { type: String, required: true },
  numero: { type: Number, required: true },
  piso: { type: Number },
  dpto: { type: String },
  codPostal: { type: String, required: true },
  localidad: { type: String, required: true },
  provincia: { type: String, required: true }
})

const emergencySchema = new mongoose.Schema({
  nombre: { type: String },
  telefono: { type: String, required: true }
})

const edoSchema = new mongoose.Schema({
  kind: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  veteSpecialty: { type: String },
  address: addressSchema,
  emergency: emergencySchema,
  billingData: billingDataSchema
})

export const ExtraUserData = mongoose.model('ExtraUserData', edoSchema, 'ExtraUserData')
