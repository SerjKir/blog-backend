import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const {email, password, fullName, avatarUrl} = req.body
    const candidate = await UserModel.findOne({email})
    if (candidate) {
      return res.status(400).json({message: 'Такой email уже используется '})
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = new UserModel({
      email, fullName, avatarUrl, passwordHash: hash
    })
    await user.save()
    const token = jwt.sign({
        _id: user._id,
      }, 'secretWord',
      {
        expiresIn: '24h'
      }
    )
    res.json(token)
  } catch (error) {
    res.status(500).json({message: 'Не удалось зарегестрироваться', error})
  }
}

export const login = async (req, res) => {
  try {
    const {email, password} = req.body
    const user = await UserModel.findOne({email})
    if (!user) {
      return res.status(404).json({message: 'Пользователь не найден'})
    }
    const isValidPass = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPass) {
      return res.status(400).json({message: 'Неверный пароль'})
    }
    const token = jwt.sign({
        _id: user._id,
      }, 'secretWord',
      {
        expiresIn: '24h'
      }
    )
    res.json(token)
  } catch (error) {
    res.status(400).json({message: 'Не удалось войти ', error})
  }
}

export const checkMe = async (req, res) => {
  try {
    return res.json(true);
  } catch (error) {
    res.status(400).json({message: 'Нет авторизации ', error})
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select('-passwordHash')
    if (!user) {
      return res.status(404).json({message: 'Пользователь не найден'})
    }
    res.json(user)
  } catch (error) {
    res.status(400).json({message: 'Не удалось получить данные ', error})
  }
}

export const update = async (req, res) => {
  try {
    const {fullName, avatarUrl} = req.body
    UserModel.findByIdAndUpdate(req.userId, {fullName, avatarUrl}, {new: true}, (error, doc) => {
      if (!error) {
        res.json({success: true})
      }
    })
  } catch (error) {
    res.status(400).json({message: 'Не удалось обновить данные пользователя ', error})
  }
}