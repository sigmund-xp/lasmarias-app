import 'dotenv/config'
import './database/connectdb.js'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRouter from './routes/auth.route.js'
import linkRouter from './routes/link.route.js'

const app = express()

const whiteList = [process.env.ORIGIN1]

app.use(cors({
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      return callback(null, origin)
    }
    console.log(`Error de CORS origin: ${origin} No autorizado`)
    return callback(new Error(`Error de CORS origin: ${origin} No autorizado`))
  }
}))
app.use(express.json())
app.use(cookieParser())
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/links', linkRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} - http://localhost:${PORT}`)
})
