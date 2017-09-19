const router = require('express').Router()
const books = require('../../models/db/books')

router.get('/:id', (request, response) => {
  const id = request.params.id
  books.getOneBook(id)
    .then(book => {
      response.render('books/book', { book })
    })
})

module.exports = router
