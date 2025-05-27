import mongoose from 'mongoose'

const eventoSchema = new mongoose.Schema({
  nombre: String,
  fecha_limite: Date,
  estado: String, // ej: 'activo', 'vencido'
  correo: String,
  data: { type: Object, default: {} },
  notificado: { type: Boolean, default: false },
  en_proceso: { type: Boolean, default: false },
  reintentos: { type: Number, default: 0 },
  ultimo_error: { type: String, default: null }
})

export const Event = mongoose.model('Eventos', eventoSchema, 'Eventos')
