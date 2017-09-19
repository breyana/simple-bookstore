const router = require('express').Router()
const books = require('../../models/db/books')
const booksRoutes = require('./books')

router.get('/', (request, response) => {
  books.getAllBookImages()
    .then(books => response.render('books/index', {books}))
    .catch(error => console.error(error))
})

router.use('/books', booksRoutes)

module.exports = router
