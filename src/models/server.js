// Model - Talks to the db and the controller and knows how to modify data

var express = require('express');
var data = require('../database/projects.json');
var app = express();
var fs = require('fs');

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/data', function(req, res, next) {
  res.send(data);
});

// Need to add Add, Edit, Delete functionality

app.listen(5000, () => console.log('Example app listening on port 5000!'));
