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


module.exports = {
  create,
  changeRole,
  isValidPassword,
  getByLogin
}
