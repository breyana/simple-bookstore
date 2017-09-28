const router = require('express').Router()
const users = require('../../models/db/users')

router.post('/signup', (request, response) => {
  if (request.body.password !== request.body.passwordConfirm) {
    response.render('users/signup', {errorMessage: 'Password confirmation does not match password'})
    return
  }
  const user = {
    username: request.body.username,
    email: request.body.email,
    password: request.body.password
  }
  users.create(user)
    .then(id => {
      request.session.userId = id
      request.session.role = 'reader'
      response.redirect('/')
    })
    .catch(error => {
      console.log(error)
      if (error.constraint === 'users_username_key') {
        response.render('users/signup', {errorMessage: 'Username already exists'})
      } else if (error.constraint === 'users_email_key') {
        response.render('users/signup', {errorMessage: 'Email already exists'})
      } else {
        response.render('users/signup', {errorMessage: 'There was an error'})
      }
    })
})

router.get('/signup', (request, response) => {
  response.render('users/signup')
})

router.post('/login', (request, response) => {
  const user = {
    login: request.body.login,
    password: request.body.password
  }
  const errorMessage = 'Login or Password is incorrect'

  users.getByLogin(user)
    .then(returnedUser => {
      if (returnedUser) {
        users.isValidPassword(user.password, returnedUser.password)
          .then(isValid => {
            if(isValid) {
              request.session.userId = returnedUser.id
              request.session.role = returnedUser.role
              response.redirect('/')
            } else {
              response.render('users/login', {errorMessage})
            }
          })
      } else {
        response.render('users/login', {errorMessage})
      }
    })
})

router.get('/login', (request, response) => {
  response.render('users/login')
})

router.get('/logout', (request, response) => {
  request.session.destroy(err => console.error(err))
  response.redirect('/')
})

module.exports = router
