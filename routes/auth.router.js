import express from 'express'
import {loginValidation, registerValidation} from '../middleware/validations.js';
import {checkAuth, handleValidationErrors} from '../middleware/index.js';
import * as UserController from '../controllers/AuthController.js';

const router = express.Router()

router.get('/me', checkAuth, UserController.getMe)
router.post('/registration', registerValidation, handleValidationErrors, UserController.register)
router.post('/login', loginValidation, handleValidationErrors, UserController.login)

export default router