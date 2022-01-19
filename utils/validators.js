const {body} = require('express-validator')

exports.registerValidators = [
  body('email', 'Введите корректный email').isEmail(),
  body('password', 'Допустимая длина пароля от 6 до 56 симолов').isLength({min: 6, max: 56}).isAlphanumeric(),
  body('confirm').custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Пароли должны совпадать')
    }
    return true;
  }),
  body('name', 'Имя должно содержать минимум 3 символа').isLength({min: 3})
]