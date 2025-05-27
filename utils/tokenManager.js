import jwt from 'jsonwebtoken'

export const generateToken = (uid) => {
  console.log(`generateToken uid: ${uid}`)
  const expiresIn = 60 * 15
  try {
    const token = jwt.sign({ uid }, process.env.SECRET_JWT_KEY, { expiresIn: '15m' })
    return { token, expiresIn }
  } catch (error) {
    console.log(`generateToken error: ${error}`)
  }
}

export const generateEmailToken = (data) => {
  console.log(`generateEmailToken uid: ${JSON.stringify(data)}`)
  try {
    const token = jwt.sign(data, process.env.SECRET_JWT_EMAIL_KEY, { expiresIn: '5d' })
    return token
  } catch (error) {
    console.log(`generateToken error: ${error}`)
  }
}

export const generateRefreshToken = (uid, res) => {
  console.log(`generateRefreshToken uid: ${uid}`)
  try {
    const refreshToken = jwt.sign({ uid }, process.env.SECRET_JWT_REFRESH_KEY, { expiresIn: '30d' })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: !(process.env.MODO === 'developer'),
      expires: new Date(Date.now() + (60 * 60 * 24 * 30 * 1000))
    })
  } catch (error) {
    console.log(`generateRefreshToken error: ${error}`)
  }
}

export const tokenVerificationErrors = (error) => {
  console.log(`tokenVerificationErrors: ${error}`)
  return 'Sesión expirada'
}
