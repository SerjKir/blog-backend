import CommentModel from '../models/Comment.js'
import PostModel from '../models/Post.js'

export const create = async (req, res) => {
  try {
    const post = req.params.id
    const {text} = req.body
    const comment = new CommentModel({
      text, author: req.userId, post
    })
    await comment.save()
    await PostModel.findByIdAndUpdate(post, {
      $push: {comments: comment}
    })
    res.json(comment)
  } catch (error) {
    res.status(500).json({message: 'Не удалось добавить комментарий ', error})
  }
}

export const getPostComments = async (req, res) => {
  try {
    const postId = req.params.id
    const comments = await CommentModel.find({
      post: postId
    }).populate('author')
    res.json(comments)
  } catch (error) {
    res.status(500).json({message: 'Не удалось получить комментарии ', error})
  }
}

export const getLastComments = async (req, res) => {
  try {
    const comments = await CommentModel.find().sort('-createdAt').populate('author').limit(3)
    res.json(comments)
  } catch (error) {
    res.status(500).json({message: 'Не удалось получить комментарии ', error})
  }
}