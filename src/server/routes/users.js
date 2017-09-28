const router = require('express').Router()
const users = require('../../models/db/users')

router.get('/admin', (request, response) => {
  if (request.session.role === 'admin') {
    response.render('users/admin')
  } else {
    response.status(401).render('common/401')
  }
})

router.put('/admin/permissions', (request, response) => {
  if (request.session.role === 'admin') {
    const user = {
      login: request.body.login,
      role: request.body.role
    }

    users.changeRole(user)
      .then(userId => {
        if(userId.length > 0) {
          response.render('users/admin', { message: `${user.login} is now set to ${user.role}`})
        } else {
          response.render('users/admin', { errorMessage: 'User is not found'})
        }
      })
      .catch(error => next(error))
  } else {
    response.status(401).render('common/401')
  }
})

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
        next(error)
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
    .catch(error => next(error))
})

router.get('/login', (request, response) => {
  response.render('users/login')
})

router.get('/logout', (request, response) => {
  request.session.destroy()
  response.redirect('/')
})

module.exports = router
