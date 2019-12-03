// Model - Talks to the db and the controller and knows how to modify data

const express = require('express');
const app = express();
const fs = require('fs');
const filePath = '../database/';
const completedTasksFileName = 'completedTasks.json';
const tasksFileName = 'tasks.json';
const projectsFileName = 'projects.json';
let tasks = require(filePath + tasksFileName);
let projects = require(filePath + projectsFileName);
let completedTasks = require(filePath + completedTasksFileName);

// Single file test
const taskMasterFileName = 'taskmaster.json';
let taskMaster = require(filePath + taskMasterFileName);
let incompleteTasks = taskMaster.incompleteTasks;
let completedTasks2 = taskMaster.completedTasks;
let projects2 = taskMaster.projects;

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
updateJsonFile = (data, file) => {
  let newData = JSON.stringify(data);
  fs.writeFile(filePath + file, newData, err => {
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
  let projectCount = Object.keys(projects).length;

  // find the task's project in the projects array and get the id
  let projectScore = Object.keys(projects).find(pro => {
    if (projects[pro].name === task.projects) {
      let score = projects[pro].id;
      return parseInt(score, 10);
    } else {
      return 0;
    }
  });
  return projectCount - projectScore + 1;
};

// Calculate the total score for the task
calculateTaskScore = task => {
  let score = calculateTaskAge(task.created) + calculateProjectScore(task);
  return score;
};

// Order data
orderData = data => {
  let rawData = [];
  Object.keys(data).map(id => {
    let task = data[id];
    let totalScore = calculateTaskScore(task);
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

// Get tasks
app.get('/api/getincompletetasks', function(req, res, next) {
  res.send(orderData(tasks));
  console.log('Tasks sent!');
});

// Get completed tasks
app.get('/api/getcompletedtasks', function(req, res, next) {
  res.send(orderData(completedTasks));
  console.log('Tasks sent!');
});

// Get projects
app.get('/api/getprojects', function(req, res, next) {
  res.send(projects);
  console.log('Proejcts sent!');
});

//Create a new task
app.post('/api/createtask', (req, res) => {
  let timeStamp = Date.now();
  let created = new Date(timeStamp);
  let ids = 'id-' + timeStamp;

  tasks[ids] = {
    value: req.body.value,
    projects: req.body.projects,
    created: created,
    id: ids
  };

  updateJsonFile(tasks, tasksFileName);
  res.send(orderData(tasks));
  console.log('Task ' + ids + ' has been created.');
});

// Update task
app.post('/api/edittask', (req, res) => {
  const task = tasks[req.body.taskid];
  if (!task) {
    res.status(404).send('Task not found');
  } else {
    task.value = req.body.value;
    updateJsonFile(tasks, tasksFileName);
    res.send(orderData(tasks));
    console.log('Task ' + task.id + ' has been updated.');
  }
});

// Delete task
app.post('/api/delete/:taskid', (req, res) => {
  const task = tasks[req.params.taskid];
  if (!task) {
    res.status(404).send('Task not found');
  } else {
    delete tasks[req.params.taskid];
    updateJsonFile(tasks, tasksFileName);
    res.send(orderData(tasks));
    console.log('Task ' + req.params.taskid + ' has been deleted.');
  }
});

// Complete task
app.post('/api/completetask', (req, res) => {
  const task = tasks[req.body.taskid];
  if (!task) {
    res.status(404).send('Task not found');
  } else {
    completedTasks[req.body.taskid] = task;
    delete tasks[req.body.taskid];
    updateJsonFile(tasks, tasksFileName);
    updateJsonFile(completedTasks, completedTasksFileName);
    let data = [orderData(tasks), orderData(completedTasks)];
    res.send(orderData(data));
    console.log('Task ' + task.id + ' has been completed.');
  }
});

app.listen(5000, () => {
  console.log('Example app listening on port 5000!');
  console.log('----------');
});
