const router = require('express').Router()
const books = require('../../models/db/books')

router.get('/search', (request, response) => {
  const searchTerm = request.query.search
    .toLowerCase()
    .replace(/^ */, '%')
    .replace(/ *$/, '%')
    .replace(/ +/g, '%')
  let offset = 0
  if (request.query.start) {
    offset = request.query.start
  }
  books.searchForBooks(searchTerm, offset)
    .then(books => {
      response.render('books/search', { books })
    })
})

router.get('/:id', (request, response) => {
  const id = request.params.id
  books.getOneBook(id)
  .then(book => {
    response.render('books/book', { book })
  })
})

module.exports = router
