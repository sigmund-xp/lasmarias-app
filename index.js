import 'dotenv/config'
import './utils/logger.js'
import { iniciarWatcher } from './watcher-worker.js'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import authRouter from './routes/auth.route.js'
import userRouter from './routes/user.route.js'
import horseRouter from './routes/horse.route.js'
import paramRouter from './routes/param.route.js'
import farrierRouter from './routes/farrier.route.js'

const app = express()

const corsOptions = {
  origin: [process.env.ORIGIN1],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true
}

if (process.env.MODO === 'developer') {
  app.use(cors({
    origin: [
      process.env.ORIGIN1,
      'http://192.168.1.63:8080'
    ],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true
  }))
} else {
  app.use(cors(corsOptions))
}

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
  next()
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/horse', horseRouter)
app.use('/api/v1/param', paramRouter)
app.use('/api/v1/farrier', farrierRouter)

iniciarWatcher()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} - http://localhost:${PORT}`)
})
