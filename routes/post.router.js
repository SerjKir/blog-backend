import express from 'express'
import {checkAuth, handleValidationErrors} from '../middleware/index.js';
import {postCreateValidation} from '../middleware/validations.js';
import {PostController, CommentsController} from '../controllers/index.js'

const router = express.Router()

router.get('/', PostController.getAll)
router.get('/tags', PostController.getLastTags)
router.get('/tags/:id', PostController.getByTag)
router.get('/comments', CommentsController.getLastComments)
router.get('/:id', PostController.getOne)
router.get('/:id/comments', CommentsController.getPostComments)
router.get('/tags', PostController.getLastTags)
router.post('/', handleValidationErrors, checkAuth, postCreateValidation, PostController.create)
router.post('/:id/comments', checkAuth, CommentsController.create)
router.delete('/:id', checkAuth, PostController.remove)
router.patch('/:id', handleValidationErrors, checkAuth, PostController.update)

export default router