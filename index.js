const express = require('express'),
  exphbs = require('express-handlebars'),
  path = require('path'),
  csrf = require('csurf'),
  flash = require('connect-flash'),
  mongoose = require('mongoose'),
  Handlebars = require('handlebars'),
  {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access'),
  session = require('express-session'),
  MongoStore = require('connect-mongodb-session')(session),
  varMiddleware = require('./middleware/variables'),
  userMiddleware = require('./middleware/user'),
  homeRoutes = require('./routes/home'),
  addRoutes = require('./routes/add'),
  coursesRoutes = require('./routes/courses'),
  cartRoutes = require('./routes/cart'),
  orderRoutes = require('./routes/orders'),
  authRoutes = require('./routes/auth'),
  profileRoutes = require('./routes/prifile'),
  errorHandler = require('./middleware/error'),
  fileMiddleware = require('./middleware/file')
  keys = require('./keys')

// Запускаем express
const app = express()

// Записть сессий в базу
const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI
})

// Подключаем handlebar
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: require('./utils/hbs-helpers')
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

// Делаем папку public статической
app.use(express.static(path.join(__dirname, 'public')))

// middleware
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

// Регистрируем роуты
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)
app.use('/orders', orderRoutes)
app.use('/auth', authRoutes),
app.use('/profile', profileRoutes)

// middleware для 404 страницы
app.use(errorHandler)

// Подключение к базе данных
const PORT = process.env.PORT || 3000
async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI)
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
