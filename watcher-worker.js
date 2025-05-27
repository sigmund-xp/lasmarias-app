import './database/connectdb.js'
import { readFile } from 'fs/promises'
import { Event } from './models/Event.js'
import nodemailer from 'nodemailer'
import handlebars from 'handlebars'

const LIMITE_CORREOS_POR_CICLO = 10
const MAX_REINTENTOS = 3
const INTERVAL = 2 * 60 * 1000 // cada minuto
const gmailUser = process.env.GMAIL_USER
const gmailPass = process.env.GMAIL_PASS

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPass
  }
})

async function obtenerCuerpoCorreo (nombre) {
  const htmlRaw = await readFile('./templates/confirmation.html', 'utf8')
  const template = handlebars.compile(htmlRaw)
  return template({ nombre, link: process.env.SERVER })
}

export const iniciarWatcher = async function () {
  console.log(`Worker - Inicia el worker cada ${(INTERVAL / 60000)} minutos`)
  setInterval(async () => {
    console.log('Worker - Busca eventos')
    const eventos = await Event.find({
      estado: 'vencido',
      notificado: false,
      en_proceso: false,
      reintentos: { $lt: MAX_REINTENTOS }
    }).sort({ fecha_limite: 1 }).limit(LIMITE_CORREOS_POR_CICLO)

    for (const evento of eventos) {
      try {
        evento.en_proceso = true
        await evento.save()

        await transporter.sendMail({
          from: gmailUser,
          to: evento.correo,
          subject: `Aviso de evento vencido: ${evento.nombre}`,
          text: `El evento "${evento.nombre}" ha vencido el ${evento.fecha_limite}.`
        })

        evento.notificado = true
        evento.en_proceso = false
        evento.ultimo_error = null
        await evento.save()

        console.log(`Worker - Correo enviado a ${evento.correo}`)
      } catch (err) {
        console.error(`Worker - Error al enviar a ${evento.correo}:`, err.message)
        evento.reintentos += 1
        evento.en_proceso = false
        evento.ultimo_error = err.message
        await evento.save()
      }
    }
  }, INTERVAL)
}

export const sendConfirmMail = async function (mailToConfirm) {
  console.log(`ConfirmMail - Enviando correo de confirmacion a ${mailToConfirm}`)

  try {
    const htmlBody = await obtenerCuerpoCorreo('Prueba nombre')

    await transporter.sendMail({
      from: gmailUser,
      to: mailToConfirm,
      subject: 'Centro Ecuestre Las Marías - Confirmacion de Correo.',
      html: htmlBody
    })
    console.log(`Worker - Confirmación enviada a ${mailToConfirm}`)
  } catch (err) {
    console.error(`Worker - Error al enviar a ${mailToConfirm}:`, err.message)
    /*
    TODO: Agregar a eventos para poder reenviar
    evento.reintentos += 1
    evento.en_proceso = false
    evento.ultimo_error = err.message
    await evento.save()
    */
  }
}
