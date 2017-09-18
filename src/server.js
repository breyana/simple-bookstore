const app = require('express')();
const routes = require('./server/routes')
const middleware = require('./server/middleware')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(middleware)

app.use(routes)

const port = process.env.PORT || 3000;

app.listen(port, ()=> {
  console.log(`Listening on localhost:${port}`)
})
