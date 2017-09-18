const setDefaultResponseLocals = (request, response, next) => {
    response.locals.session = false
    response.locals.admin = false

  next()
}

module.exports = setDefaultResponseLocals
