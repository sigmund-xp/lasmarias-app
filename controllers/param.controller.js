import jwt from 'jsonwebtoken'
import { Param } from '../models/Param.js'

export const getParams = async (req, res) => {
  console.log('getParams')
  let token = req.headers?.authorization
  token = token.split(' ')[1]
  jwt.verify(token, process.env.SECRET_JWT_KEY)
  const params = await Param.find()

  if (!params) {
    return res.status(500).json({ error: 'Error de credenciales' })
  } else {
    return res.json({ params })
  }
}
