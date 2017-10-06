const router = require('express').Router()
const books = require('../../models/db/books')
const middleware = require('../middleware')
const booksRoutes = require('./books')
const usersRoutes = require('./users')

router.get('/', (request, response, next) => {
  books.getAllBookIdImages()
    .then(books => response.render('books/index', {books}))
    .catch(error => next(error))
})

router.use('/books', booksRoutes)
router.use(usersRoutes)

router.use(middleware.errorHandler)
router.use(middleware.notFoundHandler)

module.exports = router
