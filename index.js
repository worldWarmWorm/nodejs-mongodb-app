const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const varMiddleware = require('./middleware/variables')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const cartRoutes = require('./routes/cart')
const orderRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')

// Запускаем express
const app = express()

// Записть сессий в базу
const MONGODB_URI = 'mongodb+srv://valeriq:LH3vK9Et7FegapP@cluster0.ztgug.mongodb.net/courses_app'
const store = new MongoStore({
  collection: 'sessions',
  uri: MONGODB_URI
})

// Подключаем handlebar
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

// Делаем папку public статической
app.use(express.static(path.join(__dirname, 'public')))

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store
}))
app.use(varMiddleware)

// Регистрируем роуты
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)
app.use('/auth', authRoutes)

// Подключение к базе данных
const PORT = process.env.PORT || 3000
async function start() {
  try {
    await mongoose.connect(MONGODB_URI)
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
