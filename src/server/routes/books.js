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
      response.render('books/search', { books, searchTerm: request.query.search, offset })
    })
})

router.delete('/:id/delete', (request, response) => {
  const id = request.params.id
  books.deleteBook(id)
    .then(result => {
      response.redirect('/')
    })
})

router.get('/:id/edit', (request, response) => {
  const id = request.params.id
  books.getOneBook(id)
    .then(book => {
      books.getAllGenres()
        .then(allGenres => {
          response.render('books/edit', { book, allGenres })
        })
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
