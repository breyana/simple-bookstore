const db = require('./db')

const getAllBooks = () => {
  return db.query('SELECT * FROM books')
    .catch(error => console.error(error))
}

const getAllBookIdImages = () => {
  return db.query('SELECT id, img_url FROM books')
    .catch(error => console.error(error))
}

const getOneBook = id => {
  return db.query(`
    SELECT title, price, img_url, in_stock, isbn, publisher, first_name, last_name, string_agg(genres.name, ', ') AS genres FROM books
    JOIN authors_books ON books.id = authors_books.book_id
    JOIN authors ON authors.id = authors_books.author_id
    JOIN genres_books ON books.id = genres_books.book_id
    JOIN genres ON genres.id = genres_books.genre_id
    WHERE books.id = $1
    GROUP BY title, price, img_url, in_stock, isbn, publisher, first_name, last_name
    `, [id])
    .then(result => result[0])
    .catch(error => console.error(error))
}

const searchForBooks = (searchTerm, offset) => {
  return db.query(`
    SELECT title, price, img_url, first_name, last_name FROM books
    JOIN authors_books ON books.id = authors_books.book_id
    JOIN authors ON authors.id = authors_books.author_id
    JOIN genres_books ON books.id = genres_books.book_id
    JOIN genres ON genres.id = genres_books.genre_id
    WHERE LOWER(title) LIKE $1
    OR LOWER(first_name) LIKE $1
    OR LOWER(last_name) LIKE $1
    OR LOWER(name) LIKE $1
    GROUP BY title, price, img_url, first_name, last_name
    OFFSET $2 LIMIT 10
    `, [searchTerm, offset])
    .catch(error => console.error(error))
}

module.exports = {
  getAllBooks,
  getAllBookIdImages,
  getOneBook,
  searchForBooks
 }
