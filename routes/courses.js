const {Router} = require('express')
const req = require('express/lib/request')
const Course = require('../models/course')
const router = Router()

router.get('/', async (req, res) => {
  const courses = await Course.find().populate('userId', 'email')
  console.log(courses)
  res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    courses
  })
})

router.get('/:id', async (req, res) => {
  console.log('ID' + req.params.id)
  const course = await Course.findById(req.params.id)
  res.render('course', {
    layout: 'empty',
    title: `Курс ${course.title}`,
    course
  })
})

router.get('/:id/edit', async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }

  const course = await Course.findById(req.params.id)
  res.render('course-edit', {
    title: `Редактировать курс ${course.title}`,
    course
  })
})

router.post('/edit', async (req, res) => {
  const {id} = req.body
  delete req.body.id
  await Course.findByIdAndUpdate(id, req.body)
  res.redirect('/courses')
})

router.post('/delete', async (req, res) => {
  try {
    await Course.deleteOne({_id: req.body.id})
    res.redirect('/courses')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router