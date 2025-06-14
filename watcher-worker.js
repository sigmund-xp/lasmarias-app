import './database/connectdb.js'
import { Event } from './models/Event.js'
import nodemailer from 'nodemailer'

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

        await transporter.sendMail(getMailOptions(evento))

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

const getMailOptions = (evento) => {
  switch (evento.tipo) {
    case 'V':
      return {
        from: `"Las Marías Centro Ecuestre" <${gmailUser}>`,
        to: evento.correo,
        subject: '¡Confirmá tu cuenta en Las Marías Centro Ecuestre!',
        html: getWelcomeEmailHtml(evento.nombre, makeUrlVerificacion(evento.data.token)),
        attachments: [
          {
            filename: 'logo-lm.jpg',
            path: './public/logo-lm.jpg',
            cid: 'logoLM'
          }
        ]
      }
    default:
      return {}
  }
}

const makeUrlVerificacion = (token) => `${process.env.ORIGIN1}/api/v1/auth/verify/${token}`

const getWelcomeEmailHtml = (nombre, urlVerificacion) => `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bienvenido a Las Marías</title>
    <style>
      body { font-family: 'Segoe UI', sans-serif; background-color: #f9f4ec; color: #4b3b1f; padding: 0; margin: 0; }
      .container { max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid #c5a044; border-radius: 8px; padding: 30px; }
      .header { text-align: center; padding-bottom: 0px; }
      .header img { width: 120px; border-radius: 8px; }
      h1 { color: #c5a044; font-size: 24px; }
      p { font-size: 16px; line-height: 1.5; color: #c5a044; }
      .button { display: inline-block; padding: 12px 24px; margin-top: 20px; background-color: #c5a044; color: #000; text-decoration: none; border-radius: 6px; font-weight: bold; }
      .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #c5a044; }
      @media (max-width: 600px) {
        .container { padding: 20px; }
        h1 { font-size: 20px; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><img src="cid:logoLM" alt="Logo Las Marías" style="width: 250px; border-radius: 8px;" /></div>
      <h1>¡Bienvenido a Las Marías Centro Ecuestre,<br />${nombre}!</h1>
      <p>
        Nos alegra mucho tenerte con nosotros.<br />
        Ya casi estás listo para comenzar... solo falta que confirmes tu cuenta.
      </p>
      <p>
        Hacé clic en el siguiente botón para verificar tu correo electrónico y activar tu cuenta:
      </p>
      <table border="0" cellpadding="0" cellspacing="0" style="margin: auto;">
        <tr>
          <td align="center" bgcolor="#C5A044" style="border-radius: 5px;">
            <a href="${urlVerificacion}"
              target="_blank"
              style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #000000; text-decoration: none; font-weight: bold;">
              Activar cuenta
            </a>
          </td>
        </tr>
      </table>
      <p>
        Este enlace es válido por 24 horas. Si vos no creaste esta cuenta, podés ignorar este mensaje sin problema.
      </p>
      <div class="footer">
        ¡Nos vemos pronto!<br />
        El equipo de Las Marías Centro Ecuestre
      </div>
    </div>
  </body>
</html>
`
