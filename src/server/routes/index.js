const router = require('express').Router()
const books = require('../../models/db/books')
const booksRoutes = require('./books')
const usersRoutes = require('./users')

router.get('/', (request, response) => {
  books.getAllBookIdImages()
    .then(books => response.render('books/index', {books}))
    .catch(error => console.error(error))
})

router.use('/books', booksRoutes)
router.use(usersRoutes)

module.exports = router
