const setDefaultResponseLocals = (request, response, next) => {
    response.locals.session = false
    response.locals.role = undefined
    response.locals.book = undefined
    response.locals.errorMessage = undefined

  next()
}

module.exports = setDefaultResponseLocals
