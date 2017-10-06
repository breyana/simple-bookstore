const db = require('./db')

const getAllBooks = () => {
  return db.query('SELECT * FROM books')
}

const getAllBookIdImages = () => {
  return db.query('SELECT id, img_url FROM books')
}

const getOneBook = id => {
  return db.query(`
    SELECT books.id, title, price, img_url, in_stock, isbn, publisher,
      json_agg(DISTINCT authors) AS authors,
      array_agg(DISTINCT genres.name) AS genres
    FROM books
    JOIN authors_books ON books.id = authors_books.book_id
    JOIN authors ON authors.id = authors_books.author_id
    JOIN genres_books ON books.id = genres_books.book_id
    JOIN genres ON genres.id = genres_books.genre_id
    WHERE books.id = $1
    GROUP BY books.id, title, price, img_url, in_stock, isbn, publisher
    ORDER BY books.id
    `, [id])
    .then(result => result[0])
}

const searchForBooks = (searchTerm, offset) => {
  return db.query(`
    SELECT books.id, title, price, img_url, first_name, last_name FROM books
    JOIN authors_books ON books.id = authors_books.book_id
    JOIN authors ON authors.id = authors_books.author_id
    JOIN genres_books ON books.id = genres_books.book_id
    JOIN genres ON genres.id = genres_books.genre_id
    WHERE LOWER(title) LIKE $1
    OR LOWER(first_name) LIKE $1
    OR LOWER(last_name) LIKE $1
    OR LOWER(name) LIKE $1
    GROUP BY books.id, title, price, img_url, first_name, last_name
    OFFSET $2 LIMIT 10
    `, [searchTerm, offset])
}

const updateBook = (book) => {
  return db.query(`
    UPDATE books
    SET title = $2, img_url = $3, price = $4, in_stock = $5, isbn = $6, publisher = $7
    WHERE id = $1
    `, [book.id, book.title, book.imgUrl, book.price, book.inStock, book.isbn, book.publisher])
}

const getAllGenres = () => {
  return db.query(`SELECT name FROM genres`)
}

const deleteBook = (id) => {
  return db.query(`DELETE FROM books WHERE id = $1`, [id])
}

const create = (book) => {
  return db.query(`
    INSERT INTO books(title, img_url, price, in_stock, isbn, publisher)
    VALUES($1, $2, $3, $4, $5, $6) RETURNING id
  `, [book.title, book.imgUrl, book.price, book.inStock, book.isbn, book.publisher] )
}

const addOrEditAuthors = (bookId, authors) => {
  return db.tx(transaction => {
    const queries = []

    queries.push(
      transaction.any(`SELECT * FROM authors_books WHERE book_id = $1`, [bookId])
        .then(authorConnections => {
          if (authorConnections.length > 0) {
            return transaction.query(`DELETE FROM authors_books WHERE book_id = $1`, [bookId])
          }
        })
    )

    authors.forEach(author => {
      queries.push(
        transaction.oneOrNone(`SELECT id FROM authors WHERE LOWER(first_name) = LOWER($1) AND LOWER(last_name) = LOWER($2)`, [author.firstName, author.lastName])
          .then(authorId => {
            if (!authorId) {
              return transaction.query(`INSERT INTO authors(first_name, last_name) VALUES($1, $2) RETURNING id`, [author.firstName, author.lastName])
                .then(newAuthor => {
                  return transaction.query(`INSERT INTO authors_books(author_id, book_id) VALUES($1, $2)`, [newAuthor[0].id, bookId])
                })
            } else {
              return transaction.query(`INSERT INTO authors_books(author_id, book_id) VALUES($1, $2)`, [authorId.id, bookId])
            }
          })
      )
    })
    return transaction.batch(queries)
  })
  .then(result => console.log('addOrEditAuthors transaction complete.'))
}

const addOrEditGenres = (bookId, genres) => {
  return db.tx(transaction => {
    const queries = []
    queries.push(
      transaction.any(`SELECT * FROM genres_books WHERE book_id = $1`, [bookId])
        .then(genreConnections => {
          if(genreConnections.length > 0) {
            return transaction.query(`DELETE FROM genres_books WHERE book_id = $1`, [bookId])
          }
        })
    )
    genres.forEach(genre => {
      queries.push(
        transaction.oneOrNone(`SELECT id FROM genres WHERE LOWER(name) = LOWER($1)`, [genre])
          .then(genreId => {
            if(!genreId) {
              return transaction.query(`INSERT INTO genres(name) VALUES($1) RETURNING id`, [genre])
                .then(newGenre => {
                  return transaction.query(`INSERT INTO genres_books(genre_id, book_id) VALUES ($1 , $2)`, [newGenre[0].id, bookId])
                })
            } else {
              return transaction.query(`INSERT INTO genres_books(genre_id, book_id) VALUES ($1 , $2)`, [genreId.id, bookId])
            }
          })
      )
    })
    return transaction.batch(queries)
  })
  .then(result => console.log('addOrEditGenres transaction complete.'))
}

module.exports = {
  getAllBooks,
  getAllBookIdImages,
  getOneBook,
  searchForBooks,
  updateBook,
  getAllGenres,
  deleteBook,
  addOrEditAuthors,
  addOrEditGenres,
  create
 }
