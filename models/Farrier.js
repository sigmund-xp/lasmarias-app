import mongoose from 'mongoose'

const farrierSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, index: { unique: true } },
  name: { type: String, required: true },
  phoneArea: { type: String, required: true },
  phoneNumber: { type: String, required: true }
})

export const Farrier = mongoose.model('Herradores', farrierSchema, 'Herradores')
