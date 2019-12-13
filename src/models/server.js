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

// Test Data
const testData = {
  'id-1575720265375': {
    value: 'Catch up with Itzi about Smart chat proposal',
    projects: 'OJB',
    created: '2019-11-07T12:04:25.375Z',
    id: 'id-1575720265375'
  },
  'id-1575720282012': {
    value: 'Create calendar prototype',
    projects: 'OJB',
    created: '2019-11-02T12:04:42.012Z',
    id: 'id-1575720282012'
  },
  'id-1575720298251': {
    value: 'Create UT discussion guide',
    projects: 'OJB',
    created: '2019-12-07T12:04:58.251Z',
    id: 'id-1575720298251'
  },
  'id-1575720333155': {
    value: 'Check OJB labels for accessibility',
    projects: 'OJB',
    created: '2019-12-07T12:05:33.155Z',
    id: 'id-1575720333155'
  },
  'id-1575720348555': {
    value: 'Get feedback from Nick RE E7 modal option',
    projects: 'OJB',
    created: '2019-12-07T12:05:48.555Z',
    id: 'id-1575720348555'
  },
  'id-1575720371290': {
    value: 'Phone IT about getting a windows VM',
    projects: 'Admin',
    created: '2019-12-07T12:06:11.290Z',
    id: 'id-1575720371290'
  },
  'id-1575720389795': {
    value: 'Write up mobile modal rules',
    projects: 'Admin',
    created: '2019-12-07T12:06:29.795Z',
    id: 'id-1575720389795'
  },
  'id-1575720400219': {
    value: 'Sketch versioning',
    projects: 'Admin',
    created: '2019-12-07T12:06:40.219Z',
    id: 'id-1575720400219'
  },
  'id-1575720415644': {
    value: 'Yellow circle - Does it apply to UX?',
    projects: 'Admin',
    created: '2019-12-07T12:06:55.644Z',
    id: 'id-1575720415644'
  },
  'id-1575720447203': {
    value: 'Add back button to calendar designs',
    projects: 'OJB',
    created: '2019-12-07T12:07:27.203Z',
    id: 'id-1575720447203'
  },
  'id-1575720465282': {
    value: 'Create meeting for Jan about Q1 OKRs',
    projects: 'Smart',
    created: '2019-12-07T12:07:45.282Z',
    id: 'id-1575720465282'
  }
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

// Re-order projects
app.post('/api/updateprojects', (req, res) => {
  projects = req.body.projects;
  updateJsonFile(projects, projectsFileName);
  let data = [projects, orderData(tasks)];
  res.send(data);
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
    let data = orderData(tasks);
    res.send(data);
    console.log('Task ' + task.id + ' has been completed.');
  }
});

// Restore test data
app.get('/api/testdata', (req, res) => {
  tasks = testData;
  updateJsonFile(tasks, tasksFileName);
  res.send(orderData(tasks));
});

app.listen(5000, () => {
  console.log('Example app listening on port 5000!');
  console.log('----------');
});
