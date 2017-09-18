const router = require('express').Router()

router.get('/', (request, response) => {
  response.render('books/index')
})

module.exports = router
