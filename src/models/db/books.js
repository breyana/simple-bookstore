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
    SELECT books.id, title, price, img_url, in_stock, isbn, publisher, first_name, last_name, string_agg(genres.name, ', ') AS genres FROM books
    JOIN authors_books ON books.id = authors_books.book_id
    JOIN authors ON authors.id = authors_books.author_id
    JOIN genres_books ON books.id = genres_books.book_id
    JOIN genres ON genres.id = genres_books.genre_id
    WHERE books.id = $1
    GROUP BY books.id, title, price, img_url, in_stock, isbn, publisher, first_name, last_name
    `, [id])
    .then(result => result[0])
    .catch(error => console.error(error))
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
    .catch(error => console.error(error))
}

const updateBookAuthor = (newFirstName, newLastName, bookId, oldFirstName, oldLastName) => {
  return db.tx(transaction => {
    return transaction.oneOrNone(`SELECT id FROM authors
      WHERE LOWER(first_name) = LOWER($1)
      AND LOWER(last_name) = LOWER($2)
      `, [newFirstName, newLastName])
      .then(authorId => {
        if (!authorId) {
          return transaction.query(`
              INSERT INTO authors (first_name, last_name) VALUES ($1, $2) RETURNING id
               `, [newFirstName, newLastName])
              .then(ids => {
                return transaction.query(`
                UPDATE authors_books SET author_id = $1
                WHERE authors_books.book_id = $2
                AND authors_books.author_id = (SELECT id FROM authors WHERE first_name = $3
                AND last_name = $4);
                `, [ids[0].id, bookId, oldFirstName, oldLastName]);
              })
              .catch(console.error);
        } else {
          return transaction.query(`
            UPDATE authors_books SET author_id = (SELECT id FROM authors
            WHERE LOWER(first_name) = LOWER($1)
            AND LOWER(last_name) = LOWER($2))
            WHERE authors_books.book_id = $3
            AND authors_books.author_id = (SELECT id FROM authors WHERE first_name = $4
            AND last_name = $5);
            `, [newFirstName, newLastName, bookId, oldFirstName, oldLastName
            ]);
        }
      })
      .catch(error => {
        console.error({ message: 'UpdateBookGenres Inner Transaction failed',
                        arguments: arguments, });
        throw error;
      });
  })
  .catch(error => {
    console.error({ message: 'UpdateBookGenres Outer Transaction failed',
                    arguments: arguments, });
    throw error;
  });
};

const updateBooks = (bookId, title, imgUrl, price, inStock, isbn, publisher) => {
  return db.query(`
    UPDATE books
    SET title = $2, img_url = $3, price = $4, in_stock = $5, isbn = $6, publisher = $7
    WHERE id = $1
    `, [bookId, title, imgUrl, price, inStock, isbn, publisher])
  .catch(error => console.log(error))
}

const getAllGenres = () => {
  return db.query(`SELECT name FROM genres`)
    .catch(error => console.log(error))
}

const deleteBook = (id) => {
  return db.query(`DELETE FROM books WHERE id = $1`, [id])
    .catch(error => console.log(error))
}

const createBook = (title, imgUrl, price, inStock, isbn, publisher) => {
  return db.query(`
    INSERT INTO books(title, img_url, price, in_stock, isbn, publisher)
    VALUES($1, $2, $3, $4, $5, $6) RETURNING id
  `, [title, imgUrl, price, inStock, isbn, publisher] )
}

const addAuthors = (bookId, firstName, lastName) => {
  return db.tx(transaction => {
    return transaction.query(`
      INSERT INTO authors (first_name, last_name)
      VALUES ($1, $2) RETURNING id
      `, [firstName, lastName])
    .then(authorId => {
      return transaction.query(`
        INSERT INTO authors_books (author_id, book_id)
        VALUES ($1, $2) RETURNING book_id
        `, [authorId, bookId])
      .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
  })
  .catch(error => {
    console.error({ message: 'UpdateBookGenres Outer Transaction failed',
                    arguments: arguments, });
    throw error;
  });
}

const addOrEditGenres = (bookId, genres) => {
  return db.tx(transaction => {
    const queries = []
    queries.push(
      transaction.any(`SELECT * FROM genres_books WHERE book_id = $1`, [bookId])
        .then(genreConnections => {
          if(genreConnections) {
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
                    .catch(error => console.error(error))
                })
                .catch(error => console.error(error))
            } else {
              return transaction.query(`INSERT INTO genres_books(genre_id, book_id) VALUES ($1 , $2)`, [genreId.id, bookId])
                .catch(error => console.error(error))
            }
          })
      )
    })
    return transaction.batch(queries)
  })
}

module.exports = {
  getAllBooks,
  getAllBookIdImages,
  getOneBook,
  searchForBooks,
  updateBookAuthor,
  updateBooks,
  getAllGenres,
  deleteBook,
  addAuthors,
  addOrEditGenres
 }
