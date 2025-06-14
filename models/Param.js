import mongoose from 'mongoose'

const paramSchema = new mongoose.Schema({
  kind: { type: String, enum: ['PEL', 'RAZ', 'PRO', 'LOC'], required: true },
  items: [mongoose.Schema.Types.Mixed]
})

export const Param = mongoose.model('Params', paramSchema, 'Params')
