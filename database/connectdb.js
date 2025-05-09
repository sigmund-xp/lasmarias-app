import mongoose from 'mongoose'

try {
  const URI_MONGO = process.env.URI_MONGO
  await mongoose.connect(URI_MONGO, { dbName: 'LMAPP' })
  console.log(`Conectado a la base ${URI_MONGO}`)
} catch (error) {
  console.log('Error al conectarse a la base: ' + error)
}
