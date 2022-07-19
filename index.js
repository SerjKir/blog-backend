import express from 'express'
import mongoose from 'mongoose'
import {loginValidation, postCreateValidation, registerValidation} from './middleware/validations.js'
import {checkAuth, handleValidationErrors} from './middleware/index.js'
import {UserController, PostController} from './controllers/index.js'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'

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

app.post('/auth/registration', registerValidation, handleValidationErrors, UserController.register)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)

app.post('/upload', checkAuth, upload.single('image'), async (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})

app.get('/tags', PostController.getLastTags)
app.get('/auth/me', checkAuth, UserController.getMe)
app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts/', handleValidationErrors, checkAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', handleValidationErrors, checkAuth, PostController.update)

app.listen(process.env.PORT || 5000, (error) => {
  if (error) {
    console.log(error)
  }
  console.log('Server OK')
})