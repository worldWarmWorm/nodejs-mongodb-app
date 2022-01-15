
const fs = require('fs')
const path = require('path')

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'card.json'
)

class Card {
  static async add(course) {
    const card = await Card.fetch()
    const idx = card.courses.findIndex(c => c.id === course.id)
    const candidate = card.courses[idx]

    if (candidate) {
      // курс уже есть, увеличить количество
      candidate.count++
      card.courses[idx] = candidate
    } else {
      // курса нет, нужно добавить
      course.count = 1
      card.courses.push(course)
    }

    card.price += +course.price

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(card), (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  static async delete(id) {
    const card = await Card.fetch()
    const idx = card.courses.findIndex(course => course.id = id)
    const course = card.courses[idx]

    if (course.count === 1) {
      // удаляем
      card.courses = card.courses.filter(course => course.id !== id)
    } else {
      // изменить количество
      card.courses[idx].count--
    }

    card.price -= course.price

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(card), (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(card)
        }
      })
    })
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(p, 'utf-8', (err, content) => {
        if (err) {
          reject(err)
        } else {
          resolve(JSON.parse(content))
        }
      })
    })
  }
}

module.exports = Card