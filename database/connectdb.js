import mongoose from 'mongoose'

try {
  const URI_MONGO = process.env.URI_MONGO
  let connString = URI_MONGO.replace('[USER]', process.env.USER_MONGO)
  connString = connString.replace('[PASS]', process.env.PASS_MONGO)
  await mongoose.connect(connString, { dbName: 'LMAPP' })
  console.log(`Conectado a la base ${URI_MONGO}`)
} catch (error) {
  console.log('Error al conectarse a la base: ' + error)
}
