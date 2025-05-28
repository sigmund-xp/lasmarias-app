import { Event } from '../models/Event.js'

export const sendVerifyEmail = async (name, email, data) => {
  console.log('sendVerifyEmail')
  try {
    const newEvent = new Event({ nombre: name, fecha_limite: Date.now(), tipo: 'V', estado: 'vencido', correo: email, data })
    await newEvent.save()
    return { id: newEvent.id }
  } catch (error) {
    console.log(error)
    return { error: error.message }
  }
}
