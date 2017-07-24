var express = require('express');
var app = express();
var morgan = require('morgan');
var path = require('path');
var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')))
app.use(morgan('dev'))

app.use(function(req, res, next){
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "Options") {
        res.send(200);
    } else {
        return next();
    }
})

app.get('*', function(req, res) {
  res.sendFile(__dirname, 'dist', 'index.html');
})

app.listen(port, function(err) {
  if (err) return console.log(err)
  console.log('listening on port: ' + port);
})