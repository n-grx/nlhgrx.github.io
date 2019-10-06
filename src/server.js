var express = require('express');
var tasks = require('./data/tasks.json');
var projects = require('./data/projects.json');
var app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/tasks', function(req, res, next) {
  res.send(data);
});

app.get('/projects', function(req, res, next) {
  res.send(projects);
});

app.listen(5000, () => console.log('Example app listening on port 5000!'));
