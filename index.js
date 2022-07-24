import express from 'express'
import mongoose from 'mongoose'
import {checkAuth} from './middleware/index.js'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import authRouter from './routes/auth.router.js'
import postRouter from './routes/post.router.js';

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:admin@blog-cluster.68ikzkp.mongodb.net/blog?retryWrites=true&w=majority')
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
    callback(null, file.originalname)
  }
})
const upload = multer({storage})

app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/auth', authRouter)
app.use('/posts', postRouter)

app.post('/upload', checkAuth, upload.single('image'), async (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.listen(process.env.PORT || 5000, (error) => {
  if (error) {
    console.log(error)
  }
  console.log('Server OK')
})