const router = require('express').Router()
const books = require('../../models/db/books')

router.get('/:id', (request, response) => {
  const id = request.params.id
  books.getOneBook(id)
    .then(book => {
      response.render('books/book', { book })
    })
})

router.get('/search', (request, response) => {
  const searchTerm = request.body.query
    .replace(/^ */, '%')
    .replace(/ *$/, '%')
    .replace(/ +/g, '%')
  if (request.query.start) {
    let offset = request.query.start
  } else {
    let offset = 0
  }
  books.searchForBooks(searchTerm, offset)
    .then(books => {
      response.render('books/search', { books })
    })
})

module.exports = router
