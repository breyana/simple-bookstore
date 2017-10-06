const router = require('express').Router()
const books = require('../../models/db/books')

router.get('/search', (request, response, next) => {
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
    .catch(error => next(error))
})

router.get('/create', (request, response) => {
  if (request.session.role === 'admin') {
    response.render('books/create')
  } else {
    response.status(401).render('common/401')
  }
})

router.post('/create', (request, response) => {
  if (request.session.role === 'admin') {
    let price
    let imageUrl = request.body.imgUrl
    if (!imageUrl.startsWith('http') && !(imageUrl.endsWith('.jpg') || imageUrl.endsWith('.png'))) {
      let message = {
          invalidImage: 'Please input a valid image',
      }
      response.render('books/create', { message })
      return;
    }
    if (request.body.price.includes('$')) {
      price = request.body.price.replace(/\$/, '')
    } else {
      price = request.body.price
    }
    const compiledBook = {}
    compiledBook.title = request.body.title
    compiledBook.imgUrl = request.body.imgUrl
    compiledBook.price = price
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
      .catch(error => next(error))
  } else {
    response.status(401).render('common/401')
  }
})

router.delete('/:id', (request, response) => {
  if (request.session.role === 'admin') {
    const id = request.params.id
    books.deleteBook(id)
      .then(result => response.send(`Book with ID:${id} has been deleted`))
      .catch(error => response.send(`Error deleting Book ID:${id}`))
  } else {
    response.status(401).render('common/401')
  }
})

router.put('/:id/edit', (request, response, next) => {
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
      .catch(error => next(error))
  } else {
    response.status(401).render('common/401')
  }
})

router.get('/:id/edit', (request, response, next) => {
  if (request.session.role === 'clerk' || request.session.role === 'admin') {
    const id = request.params.id
    books.getOneBook(id)
    .then(book => {
      return books.getAllGenres()
        .then(allGenres => {
          response.render('books/edit', { book, allGenres })
        })
    })
    .catch(error => next(error))
  } else {
    response.status(401).render('common/401')
  }
})

router.get('/:id', (request, response, next) => {
  const id = request.params.id
  books.getOneBook(id)
    .then(book => {
      response.render('books/book', { book })
    })
    .catch(error => next(error))
})

module.exports = router
