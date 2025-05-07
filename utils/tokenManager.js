import jwt from 'jsonwebtoken'

export const generateToken = (uid) => {
  const expiresIn = 60 * 15
  try {
    const token = jwt.sign({ uid }, process.env.SECRET_JWT_KEY, { expiresIn: '15m' })
    return { token, expiresIn }
  } catch (error) {
    console.log(error)
  }
}

export const generateRefreshToken = (uid, res) => {
  try {
    const refreshToken = jwt.sign({ uid }, process.env.SECRET_JWT_REFRESH_KEY, { expiresIn: '30d' })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: !(process.env.MODO === 'developer'),
      expires: new Date(Date.now() + (60 * 60 * 24 * 30 * 1000))
    })
  } catch (error) {
    console.log(error)
  }
}

export const tokenVerificationErrors = (error) => {
  console.log(error)
  return 'Sesión expirada'
}
