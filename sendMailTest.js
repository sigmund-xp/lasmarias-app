import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const gmailUser = process.env.GMAIL_USER
const gmaulPass = process.env.GMAIL_PASS

async function enviarCorreoTest () {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmaulPass
      }
    })

    const info = await transporter.sendMail({
      from: gmailUser,
      to: 'mmbatti@gmail.com', // te lo enviás a vos mismo
      subject: '🔧 Test de envío desde Node.js',
      text: '¡Funciona correctamente el envío de correo con Gmail y clave de aplicación!'
    })

    console.log('✅ Correo enviado:', info.response)
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error.message)
  }
}

enviarCorreoTest()
