const setDefaultResponseLocals = (request, response, next) => {
    response.locals.session = false
    response.locals.admin = false
    response.locals.book = undefined

  next()
}

module.exports = setDefaultResponseLocals
