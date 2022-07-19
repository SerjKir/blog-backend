import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').split(' ')[1]
    if (!token) {
      return res.status(403).json({message: 'Нет авторизации'})
    }
    const decoded = jwt.verify(token, 'secretWord')
    req.userId = decoded._id
    next()
  } catch (error) {
    res.status(404).json({message: 'Что то пошло не так ', error})
  }
}