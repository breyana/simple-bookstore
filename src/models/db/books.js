const db = require('./db')

const getAllBooks = () => {
  return db.query('SELECT * FROM books')
    .catch(error => console.error(error))
}

const getAllBookImages = () => {
  return db.query('SELECT img_url FROM books')
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

module.exports = {
  getAllBooks,
  getAllBookImages,
  getOneBook
 }
