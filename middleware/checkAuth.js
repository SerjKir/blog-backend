import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  if (req.method === "OPTIONS") {
    next()
  }
  try {
    const token = (req.headers.authorization || '').split(' ')[1]
    if (!token) {
      return res.status(403).json({message: 'Нет авторизации'})
    }
    const decoded = jwt.verify(token, 'secretWord')
    req.userId = decoded._id
    next()
  } catch (error) {
    res.status(401).json({message: 'Нет авторизации ', error})
  }
}