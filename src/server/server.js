const app = require('express')();
const routes = require('./routes')

app.set('view engine', 'ejs')

app.use(routes)

const port = process.env.PORT || 3000;

app.listen(port, ()=> {
  console.log(`Listening on localhost:${port}`)
})
