const router = require('express').Router()
const books = require('../../models/db/books')

router.get('/', (request, response) => {
  books.getAllBooks()
    .then(books => response.render('books/index', {books}))
    .catch(error => console.error(error))
})

module.exports = router
