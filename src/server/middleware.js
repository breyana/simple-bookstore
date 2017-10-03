const users = require('../models/db/users')

const setDefaultResponseLocals = (request, response, next) => {
  response.locals.book = undefined
  response.locals.errorMessage = undefined
  response.locals.message = undefined
  if (request.session.userId) {
    response.locals.session = true
    response.locals.role = request.session.role
    response.locals.userId = request.session.userId
    users.getCart(request.session.userId)
      .then(cart => {
        response.locals.cart = cart
        next()
      })
  } else {
    response.locals.session = false
    response.locals.role = undefined
    response.locals.userId = undefined
    response.locals.cart = undefined
    next()
  }
}

const errorHandler = (error, request, response, next) => {
  console.error(error)
  response.status(500).render('common/error')
}

const notFoundHandler = (request, response) => {
  response.status(404).render('common/404')
}

module.exports = {
  setDefaultResponseLocals,
  errorHandler,
  notFoundHandler
}
