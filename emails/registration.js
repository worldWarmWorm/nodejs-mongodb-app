const keys = require('../keys')
const { getMaxListeners } = require('../models/user')

module.exports = function(email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Аккаунт создан',
    html: `
      <h1>Добро пожаловать в наш магазин!</h1>
      <p>Вы успешно создали аккаунт с email - ${email}</p>
      <hr>
      <a href="${keys.BASE_URL}/auth/login#login">Войти в магазин</a>
    `
  }
}