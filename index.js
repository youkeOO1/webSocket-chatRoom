const express = require('express')
const http = require('http')
const path = require('path')

const app = express()
const server = http.createServer(app)
// 静态资源访问
app.use(express.static(path.resolve(__dirname, './public')));

require('./chatServer')(server)


server.listen(5000, () => {
  console.log(`Example app listening at http://localhost:5000`);
})