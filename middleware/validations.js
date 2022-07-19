import validator from 'express-validator'

export const registerValidation = [
  validator.body('email', 'Неверная почта').isEmail(),
  validator.body('password', 'Пароль минимум 5 символов').isLength({min: 5}),
  validator.body('fullName', 'Имя минимум 3 символа').isLength({min: 3}),
  validator.body('avatarUrl', 'Неверная ссылка аватара').optional().isURL(),
]

export const loginValidation = [
  validator.body('email', 'Неверная почта').isEmail(),
  validator.body('password', 'Пароль минимум 5 символов').isLength({min: 5})
]

export const postCreateValidation = [
  validator.body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
  validator.body('text', 'Введите текст статьи').isLength({min: 10}).isString(),
  validator.body('tags', 'Неверный формат тэгов').optional().isString(),
  validator.body('imageUrl', 'Неверный формат ссылки').optional().isString()
]

