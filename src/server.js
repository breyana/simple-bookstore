const express = require('express')
const app = express();
const routes = require('./server/routes')
const middleware = require('./server/middleware')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
require('dotenv').config()

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

app.use(methodOverride('_method'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(middleware)

app.use(routes)

const port = process.env.PORT || 3000;

app.listen(port, ()=> {
  console.log(`Listening on localhost:${port}`)
})
