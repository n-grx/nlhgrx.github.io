// Model - Talks to the db and the controller and knows how to modify data

let express = require('express');
let data = require('../database/projects.json');
let app = express();
let fs = require('fs');

let endpoints = {
  getTasks: '/api/gettasks',
  createTask: '/api/createtask',
  deleteTask: '/api/delete'
};

app.use(
  express.json({
    type: ['application/json', 'text/plain']
  })
);
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Update local json file
updateJsonFile = newData => {
  fs.writeFile('../database/projects.json', newData, err => {
    if (err) throw err;
  });
};

// Get data from JSON file
app.get(endpoints.getTasks, function(req, res, next) {
  res.send(data);
  console.log('Data sent!');
});

//Create a new task
app.post(endpoints.createTask, (req, res) => {
  let timeStamp = Date.now();
  let created = new Date(timeStamp);
  let ids = 'id-' + timeStamp;

  data.tasks[ids] = {
    value: req.body.value,
    projects: req.body.projects,
    created: created
  };

  let newData = JSON.stringify(data);
  updateJsonFile(newData);
  res.send(newData);
  console.log('JSON updated');
});

// Delete task
app.post('/api/delete/:taskid', (req, res) => {
  const task = data.tasks[req.params.taskid];
  if (!task) {
    res.status(404).send('Task not found');
  } else {
    delete data.tasks[req.params.taskid];
    updateJsonFile(data);
    res.send(data);
  }
});

// Need to add Edit, Delete functionality
app.listen(5000, () => console.log('Example app listening on port 5000!'));
