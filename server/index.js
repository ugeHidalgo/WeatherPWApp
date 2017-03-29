var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, '../')));

app.listen(8082, '0.0.0.0', function () {
  console.log('App listening on port 8082!');
});