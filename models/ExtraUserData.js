import mongoose from 'mongoose'
const { Types } = mongoose

const billingDataSchema = new mongoose.Schema({
  cbu: { type: String },
  alias: { type: String },
  name: { type: String }
})

const addressSchema = new mongoose.Schema({
  calle: { type: String },
  numero: { type: Number },
  piso: { type: Number },
  dpto: { type: String },
  codPostal: { type: String },
  localidad: { type: String },
  provincia: { type: String }
})

const emergencySchema = new mongoose.Schema({
  name: { type: String },
  phoneArea: { type: String },
  phoneNumber: { type: String }
})

const edoSchema = new mongoose.Schema({
  kind: { type: String, required: true },
  userId: { type: Types.ObjectId, required: true, unique: true, ref: 'Usuarios' },
  veteSpecialty: { type: String },
  address: addressSchema,
  emergency: emergencySchema,
  billingData: billingDataSchema
})

export const ExtraUserData = mongoose.model('ExtraUserData', edoSchema, 'ExtraUserData')
