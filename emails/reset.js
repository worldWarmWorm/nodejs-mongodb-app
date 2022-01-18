const {EMAIL_FROM, BASE_URL} = require('../keys')
const { getMaxListeners } = require('../models/user')

module.exports = function(email, token) {
  return {
    to: email,
    from: EMAIL_FROM,
    subject: 'Восстановление доступа',
    html: `
      <h1>Вы забыли пароль?</h1>
      <p>Если нет, проигнорируйте это письмо.</p>
      <p>Иначе нажмите на ссылку ниже:</p>
      <p><a href="${BASE_URL}/auth/password/${token}">Восстановить доступ</a></p>
      <hr>
      <a href="${BASE_URL}/auth/login#login">Войти в магазин</a>
    `
  }
}