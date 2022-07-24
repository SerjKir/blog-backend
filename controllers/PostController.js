import PostModel from '../models/Post.js'
import UserModel from '../models/User.js'
import CommentModel from '../models/Comment.js'

export const create = async (req, res) => {
  try {
    const {title, text, imageUrl, tags} = req.body
    const post = new PostModel({
      title, text, imageUrl, tags: tags.split(',').map(tag => tag.trim()), author: req.userId
    })
    await post.save()
    await UserModel.findByIdAndUpdate(req.userId, {
      $push: {posts: post}
    })
    res.json(post)
  } catch (error) {
    res.status(500).json({message: 'Не удалось создать пост ', error})
  }
}

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find({}).sort({createdAt: -1}).populate('author')
    res.json(posts)
  } catch (error) {
    res.status(500).json({message: 'Не удалось получить посты ', error})
  }
}

export const getByTag = async (req, res) => {
  try {
    const tag = req.params.id
    const posts = await PostModel.find({tags: tag}).populate('author')
    res.json(posts)
  } catch (error) {
    res.status(500).json({message: 'Не удалось получить посты ', error})
  }
}

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5)
    const tags = posts.map(post => post.tags).flat()
    const filtered = tags.filter(function(item, pos) {
      return tags.indexOf(item) === pos;
    }).slice(0, 5)
    res.json(filtered)
  } catch (error) {
    res.status(500).json({message: 'Не удалось получить тэги ', error})
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id
    PostModel.findOneAndUpdate(
      {_id: postId},
      {$inc: {viewsCount: 1}},
      {returnDocument: 'after'},
      (error, doc) => {
        if (error) {
          return res.status(500).json({message: 'Не удалось получит пост ', error})
        }
        if (!doc) {
          return res.status(404).json({message: 'Пост не найден'})
        }
        res.json(doc)
      }
    ).populate('author')
  } catch (error) {
    res.status(500).json({message: 'Не удалось получить посты ', error})
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id
    PostModel.findOneAndDelete(
      {_id: postId}
      , (error, doc) => {
        if (error) {
          return res.status(500).json({message: 'Не удалось удалить пост ', error})
        }
        if (!doc) {
          return res.status(404).json({message: 'Пост не найден'})
        }
      }
    )
    await CommentModel.deleteMany({post: postId})
    await UserModel.findByIdAndUpdate(req.userId, {
      $pullAll: {
        posts: [{_id: postId}]
      }
    })
    res.json({success: true})
  } catch (error) {
    console.log(error)
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id
    const {title, text, imageUrl, author, tags} = req.body
    await PostModel.updateOne({
        _id: postId
      },
      {
        title,
        text,
        imageUrl,
        author,
        tags: tags.split(',')
      }
    )
    res.json({success: true})
  } catch (error) {
    res.status(500).json({message: 'Не удалось обновить пост ', error})
  }
}

export const createComment = async (req, res) => {
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


