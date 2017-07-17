var express = require('express');
var app = express();
var morgan = require('morgan');
var path = require('path');
var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')))
app.use(morgan('dev'))

app.get('*', function(req, res) {
  res.sendFile(__dirname, 'dist', 'index.html');
})

app.listen(port, function(err) {
  if (err) return console.log(err)
  console.log('listening on port: ' + port);
})