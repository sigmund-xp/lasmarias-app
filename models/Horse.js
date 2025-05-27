import mongoose from 'mongoose'

const { Types } = mongoose

const horseSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  genero: { type: Boolean, required: true },
  raza: { type: String, required: true },
  pelaje: { type: String, required: true },
  alzada: { type: Number, required: true },
  fechaNacimiento: { type: Date, required: true },
  microchip: { type: Number },
  mi: { type: String },
  sba: { type: Number },
  nroFederado: { type: Number },
  ownerId: { type: Types.ObjectId, ref: 'User', required: true },
  veterinarianId: { type: Types.ObjectId, ref: 'User' },
  physiotherapistId: { type: Types.ObjectId, ref: 'User' },
  dentistId: { type: Types.ObjectId, ref: 'User' },
  ophthalmologistId: { type: Types.ObjectId, ref: 'User' },
  farrierId: { type: Types.ObjectId, ref: 'User' },
  imageId: { type: Types.ObjectId, ref: 'Image', required: true }
})

export const Horse = mongoose.model('Caballos', horseSchema, 'Caballos')
