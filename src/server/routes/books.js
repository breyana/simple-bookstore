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
  if (request.session.role === 'admin') {
    response.render('books/create')
  } else {
    response.redirect('/')
  }
})

router.post('/create', (request, response) => {
  if (request.session.role === 'admin') {
    const compiledBook = {}
    compiledBook.title = request.body.title
    compiledBook.imgUrl = request.body.imgUrl
    compiledBook.price = request.body.price
    compiledBook.inStock = request.body.inStock
    compiledBook.isbn = request.body.isbn
    compiledBook.publisher = request.body.publisher
    const authors = []
    const genres = []


    let i = 0
    while (request.body['firstName' + i]) {
      let author = {}
      author.firstName = request.body['firstName' + i]
      author.lastName = request.body['lastName' + i]
      authors.push(author)
      i++
    }
    let j = 0
    while (request.body['genre' + j]) {
      genres.push(request.body['genre' + j])
      j++
    }

    books.create(compiledBook)
      .then(book => {
        books.addOrEditAuthors(book[0].id, authors)
          .then(() => books.addOrEditGenres(book[0].id, genres))
          .then(() => response.redirect(`/books/${book[0].id}`))
          .catch(error => console.error(error))
      })
      .catch(error => console.error(error))
  } else {
    response.status(401).send('Unauthorized User')
  }
})

router.delete('/:id', (request, response) => {
  if (request.session.role === 'admin') {
    const id = request.params.id
    books.deleteBook(id)
      .then(result => {
        response.send(`Book with ID:${id} has been deleted`)
      })
  } else {
    response.status(401).send('Unauthorized User')
  }
})

router.put('/:id/edit', (request, response) => {
  if (request.session.role === 'clerk' || request.session.role === 'admin') {
    const compiledBook = {}
    compiledBook.id = request.params.id
    compiledBook.title = request.body.title
    compiledBook.imgUrl = request.body.imgUrl
    compiledBook.price = request.body.price
    compiledBook.inStock = request.body.inStock
    compiledBook.isbn = request.body.isbn
    compiledBook.publisher = request.body.publisher
    const authors = []
    const genres = []
    let i = 0
    while (request.body['firstName' + i]) {
      let author = {}
      author.firstName = request.body['firstName' + i]
      author.lastName = request.body['lastName' + i]
      authors.push(author)
      i++
    }
    let j = 0
    while (request.body['genre' + j]) {
      genres.push(request.body['genre' + j])
      j++
    }

    books.updateBook(compiledBook)
      .then(() => books.addOrEditAuthors(compiledBook.id, authors))
      .then(() => books.addOrEditGenres(compiledBook.id, genres))
      .then(() => response.redirect(`/books/${compiledBook.id}`))
      .catch(error => console.error(error))
  } else {
    response.status(401).send('Unauthorized User')
  }
})

router.get('/:id/edit', (request, response) => {
  if (request.session.role === 'clerk' || request.session.role === 'admin') {
    const id = request.params.id
    books.getOneBook(id)
    .then(book => {
      books.getAllGenres()
      .then(allGenres => {
        response.render('books/edit', { book, allGenres })
      })
    })
  } else {
    response.redirect('/')
  }
})

router.get('/:id', (request, response) => {
  const id = request.params.id
  books.getOneBook(id)
  .then(book => {
    response.render('books/book', { book })
  })
})

module.exports = router
