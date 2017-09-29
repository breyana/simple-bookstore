const db = require('./db')
const bcrypt = require('bcrypt')

const create = (user) => {
  return bcrypt.hash(user.password, 10)
    .then(hash => {
      return db.query(`
        INSERT INTO users(username, email, password)
        VALUES($1, $2, $3) RETURNING id`,
        [user.username, user.email, hash])
        .then(users => users[0].id)
    })
}

const changeRole = (user) => {
  return db.query(`
    UPDATE users SET role = $2 WHERE username = $1 OR email = $1 RETURNING id`,
    [user.login, user.role])
}

const isValidPassword = (plaintextPassword, encryptedPassword) => {
  return bcrypt.compare(plaintextPassword, encryptedPassword)
}

const getByLogin = (user) => {
  return db.oneOrNone(`
    SELECT * FROM users WHERE username = $1 OR email = $1`,
  [user.login])
}

const getCart = (userId) => {
  return db.query(`
    SELECT title, price, quantity FROM carts
    JOIN books ON books.id = carts.book_id
    WHERE user_id = $1
    `, [userId])
}

const addToOrUpdateCart = (userId, item) => {
  return db.oneOrNone(`
    SELECT * FROM carts
    WHERE user_id = $1 AND book_id = $2`,
    [userId, item.id])
      .then(existingItem => {
        if (!existingItem) {
          return db.query(`
            INSERT INTO carts(user_id, book_id, quantity)
            VALUES($1, $2, $3)`,
            [userId, item.id, item.quantity])
        } else {
          return db.query(`
            UPDATE carts SET quantity = $3
            WHERE user_id = $1 AND book_id = $2`,
            [userId, item.id, item.quantity])
        }
      })
}

const removeFromCart = (userId, itemId) => {
  return db.query(`
    DELETE FROM carts
    WHERE user_id = $1 AND book_id = $2`, [userId, itemId])
}

module.exports = {
  create,
  changeRole,
  isValidPassword,
  getByLogin,
  getCart,
  addToOrUpdateCart,
  removeFromCart
}
