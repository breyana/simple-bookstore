const setDefaultResponseLocals = (request, response, next) => {
  if (request.session.userId) {
    response.locals.session = true
    response.locals.role = request.session.role
    response.locals.userId = request.session.userId
  } else {
    response.locals.session = false
    response.locals.role = undefined
    response.locals.userId = undefined
  }
    response.locals.book = undefined
    response.locals.errorMessage = undefined
    response.locals.message = undefined

  next()
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
