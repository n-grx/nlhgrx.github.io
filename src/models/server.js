// Model - Talks to the db and the controller and knows how to modify data

let express = require('express');
let tasks = require('../database/tasks.json');
let projects = require('../database/projects.json');
let app = express();
let fs = require('fs');

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
updateJsonFile = data => {
  let newData = JSON.stringify(data);
  fs.writeFile('../database/tasks.json', newData, err => {
    if (err) throw err;
  });
};

// Calculate a score based on the tasks age
calculateTaskAge = date => {
  // get the age of the task in days
  let age = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
  let score;
  if (age > 60) {
    score = 3;
  } else if (age > 10) {
    score = 2;
  } else if (age > 7) {
    score = 1;
  } else {
    score = 0;
  }
  return score;
};

// Calculate a score based on the priority of the project
calculateProjectScore = task => {
  let projectCount = projects.length;

  // find the task's project in the projects array
  let project = Object.keys(projects).map(id => {
    return projects[id].name === task.projects;
  });

  return projectCount - project.id + 1;
};

// Calculate the total score for the task
calculateTaskScore = task => {
  return calculateTaskAge(task.created) + calculateProjectScore(task);
};

// Order data
orderData = data => {
  let rawData = [];
  Object.keys(data).map(id => {
    let task = data[id];
    let totalScore = calculateTaskScore(task);
    task.id = id;
    let newData = [task, totalScore];
    rawData.push(newData);
  });

  // Sorts the array by the total score 9-1;
  rawData.sort(function(a, b) {
    return b[1] - a[1];
  });

  // Remove the total score int from the array
  rawData.map(item => {
    item.pop();
  });
  let newArr = [].concat.apply([], rawData);
  return newArr;
};

// Get data from JSON file
app.get('/api/gettasks', function(req, res, next) {
  res.send(orderData(tasks));
  console.log('Data sent!');
});

//Create a new task
app.post('/api/createtask', (req, res) => {
  let timeStamp = Date.now();
  let created = new Date(timeStamp);
  let ids = 'id-' + timeStamp;

  tasks[ids] = {
    value: req.body.value,
    projects: req.body.projects,
    created: created
  };
  updateJsonFile(tasks);
  res.send(tasks);
  console.log('JSON updated');
});

// Delete task
app.post('/api/delete/:taskid', (req, res) => {
  const task = tasks[req.params.taskid];
  if (!task) {
    res.status(404).send('Task not found');
  } else {
    delete tasks[req.params.taskid];
    updateJsonFile(tasks);
    res.send(orderData(tasks));
  }
});

// Need to add Edit, Delete functionality
app.listen(5000, () => console.log('Example app listening on port 5000!'));
