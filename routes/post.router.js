import express from 'express'
import {checkAuth, handleValidationErrors} from '../middleware/index.js';
import {postCreateValidation} from '../middleware/validations.js';
import {PostController} from '../controllers/index.js'

const router = express.Router()

router.get('/', PostController.getAll)
router.get('/tags', PostController.getLastTags)
router.get('/tags/:id', PostController.getByTag)
router.get('/comments', PostController.getLastComments)
router.get('/:id', PostController.getOne)
router.get('/:id/comments', PostController.getPostComments)
router.get('/tags', PostController.getLastTags)
router.post('/', handleValidationErrors, checkAuth, postCreateValidation, PostController.create)
router.post('/:id/comments', checkAuth, PostController.createComment)
router.delete('/:id', checkAuth, PostController.remove)
router.patch('/:id', handleValidationErrors, checkAuth, PostController.update)

export default router