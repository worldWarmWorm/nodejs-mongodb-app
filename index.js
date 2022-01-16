const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');

// Модели
const User = require('./models/user');

// Регистрируем роуты
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cardRoutes = require('./routes/card');

const app = express();

// Подключаем handlebar
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

// Делаем папку public статической
app.use(express.static(path.join(__dirname, 'public')));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(async (req, res, next) => {
  try {
    const user = await User.findById('61e3fa69167a1d5ea850f985');
    req.user = user
    next()
  } catch (error) {
    console.log(error)
  }
});

// Маршруты
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    const url = `mongodb+srv://valeriq:LH3vK9Et7FegapP@cluster0.ztgug.mongodb.net/courses_app`;
    await mongoose.connect(url);

    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: 'st.valeriq@gmial.com',
        name: 'Valery',
        cart: { items: [] },
      });
      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
