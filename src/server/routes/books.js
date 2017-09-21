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

router.get('/create', (request, response) => {
  response.render('books/create')
})

router.delete('/:id/delete', (request, response) => {
  const id = request.params.id
  books.deleteBook(id)
    .then(result => {
      response.redirect('/')
    })
})

router.put('/:id/edit', (request, response) => {
  const id = request.params.id
  const title = request.body.title
  const imgUrl = request.body.imgUrl
  const price = request.body.price
  const inStock = request.body.inStock
  const isbn = request.body.isbn
  const publisher = request.body.publisher
  const oldFirstName = request.body.oldFirstName
  const oldLastName = request.body.oldLastName
  const firstName = request.body.firstName
  const lastName = request.body.lastName
  const oldGenre = request.body.oldGenre

  books.updateBooks(id, title, imgUrl, price, inStock, isbn, publisher)
    .then(() => books.updateBookAuthor(firstName, lastName, id, oldFirstName, oldLastName))
    .catch(error => console.error(error))


  let i = 0
  while (request.body['genre'+ i]) {

    i++
  }
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
