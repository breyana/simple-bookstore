const db = require('./db')

const getAllBooks = function() {
  return db.query('SELECT * FROM books')
    .catch(error => console.error)
}

module.exports = { getAllBooks }
