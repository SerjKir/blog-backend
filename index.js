import express from 'express'
import mongoose from 'mongoose'
import {checkAuth} from './middleware/index.js'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import userRouter from './routes/user.router.js'
import postRouter from './routes/post.router.js'
import 'dotenv/config'
import {v4 as uuidv4} from 'uuid'
import UserModel from './models/User.js'

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('DB ok'))
  .catch((error) => console.log('DB error', error))

const app = express()

app.use(cors())

const storage = multer.diskStorage({
  destination: (_, __, callback) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    callback(null, 'uploads')
  },
  filename: (_, file, callback) => {
    callback(null, uuidv4() + '.' + file.originalname.split('.').pop())
  }
})
const upload = multer({storage})

app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/auth', userRouter)
app.use('/posts', postRouter)

app.post('/upload', checkAuth, upload.single('image'), async (req, res) => {
  res.json({
    url: `/uploads/${req.file.filename}`
  })
})

app.post('/upload-avatar', checkAuth, upload.single('image'), async (req, res) => {
  const avatarUrl = `/uploads/${req.file.filename}`
  res.json(avatarUrl)
})

app.listen(process.env.PORT || 5000, (error) => {
  if (error) {
    console.log(error)
  }
  console.log('Server OK')
})