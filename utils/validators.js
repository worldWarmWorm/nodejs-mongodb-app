const {body} = require('express-validator')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.registerValidators = [
  body('email', 'Введите корректный email').isEmail()
    .custom(async (value, req) => {
      try {
        const user = await User.findOne({email: value})
        if (user) {
          return Promise.reject('Такой email уже занят')
        }
      } catch (error) {
        console.log(error)
      }
    })
    .normalizeEmail(),
  body('password', 'Допустимая длина пароля от 6 до 56 симолов')
    .isLength({min: 6, max: 56})
    .isAlphanumeric()
    .trim(),
  body('confirm')
    .custom((value, {req}) => {
      if (value !== req.body.password) {
        throw new Error('Пароли должны совпадать')
      }
      return true;
    })
    .trim(),
  body('name', 'Имя должно содержать минимум 3 символа')
    .isLength({min: 3})
    .trim()
]

exports.loginValidators = [
  body('email').custom(async (value, {req}) => {
    const user = await User.findOne({email: value})
    if (!user) {
      return Promise.reject('Такого пользователя не существует')
    }
  }),
  body('password').custom(async (value, {req}) => {
    const {email} = req.body,
      user = await User.findOne({email}),
      isOwner = await bcrypt.compare(value, user.password)
      
    if (user && !isOwner) {
      return Promise.reject('Неверный пароль')
    }
  })
]