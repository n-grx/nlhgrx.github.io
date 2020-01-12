// Model - Talks to the db and the controller and knows how to modify data

const express = require('express');
const app = express();
const fs = require('fs');
const filePath = '../database/';
const taskMasterFileName = 'taskmaster.json';
let taskMaster = require(filePath + taskMasterFileName);
let incompleteTasks = taskMaster.incompleteTasks;
let completedTasks = taskMaster.completedTasks;
let projects = taskMaster.projects;

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
  let newData = JSON.stringify(data, null, 2);
  fs.writeFile(filePath + file, newData, err => {
    if (err) throw err;
  });
};

updateTaskMaster = (completedTasks, incompleteTasks, projects) => {
  taskMaster.completedTasks = completedTasks;
  taskMaster.incompleteTasks = incompleteTasks;
  taskMaster.projects = projects;
  updateJsonFile(taskMaster, taskMasterFileName);
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
  let project = task.projects;

  projects.find((item, idx) => {
    if (item.name === project) {
      return (projectScore = parseInt(idx, 10));
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
    task.score = totalScore;
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
app.get('/api/task/getincomplete', function(req, res, next) {
  res.send(orderData(incompleteTasks));
  console.log('Tasks sent!');
});

// Get completed tasks
app.get('api/task/getcompleted', function(req, res, next) {
  res.send(orderData(completedTasks));
  console.log('Tasks sent!');
});

// Get projects
app.get('/api/projects/getall', function(req, res, next) {
  res.send(projects);
  console.log('Proejcts sent!');
});

// Re-order projects
app.post('/api/projects/order', (req, res) => {
  projects = req.body.projects;
  updateTaskMaster(completedTasks, incompleteTasks, projects);
  let data = [projects, orderData(incompleteTasks)];
  res.send(data);
});

// Delete project and related tasks
app.post('/api/projects/delete/:projectIdx', (req, res) => {
  const projectIndex = parseInt(req.params.projectIdx, 10);
  const project = projects[projectIndex];
  projects = projects.filter((item, idx) => {
    return idx != projectIndex;
  });

  Object.keys(incompleteTasks).forEach(task => {
    if (incompleteTasks[task].projects === project.name)
      delete incompleteTasks[task];
  });

  updateTaskMaster(completedTasks, incompleteTasks, projects);
  let data = [orderData(incompleteTasks), projects];
  res.send(data);
});

//Create a new task
app.post('/api/task/create', (req, res) => {
  let timeStamp = Date.now();
  let created = new Date(timeStamp);
  let ids = 'id-' + timeStamp;

  incompleteTasks[ids] = {
    value: req.body.value,
    projects: req.body.projects,
    created: created,
    id: ids
  };

  updateTaskMaster(completedTasks, incompleteTasks, projects);
  res.send(orderData(incompleteTasks));
  console.log('Task ' + ids + ' has been created.');
});

// Update task value
app.post('/api/task/edit/value', (req, res) => {
  const task = incompleteTasks[req.body.taskid];
  if (!task) {
    res.status(404).send('Task not found');
  } else {
    task.value = req.body.value;
    updateTaskMaster(completedTasks, incompleteTasks, projects);
    res.send(orderData(incompleteTasks));
    console.log('Task ' + task.id + ' has been updated.');
  }
});

// Update task project
app.post('/api/task/edit/projects', (req, res) => {
  const task = incompleteTasks[req.body.taskid];
  let project = projects.filter(project => {
    return project.name === req.body.project;
  });
  if (!task) {
    res.status(404).send('Task not found');
  } else {
    task.projects = req.body.project;
    if (project.length < 1) {
      let timeStamp = Date.now();
      let ids = 'id-' + timeStamp;
      project = { name: req.body.project, id: ids };
      projects.push(project);
    }
    updateTaskMaster(completedTasks, incompleteTasks, projects);
    let data = [orderData(incompleteTasks), projects];
    res.send(data);
    console.log('Task ' + task.id + ' has been updated.');
  }
});

// Delete task
app.post('/api/task/delete/:taskid', (req, res) => {
  const task = incompleteTasks[req.params.taskid];
  if (!task) {
    res.status(404).send('Task not found');
  } else {
    delete incompleteTasks[req.params.taskid];
    updateTaskMaster(completedTasks, incompleteTasks, projects);
    res.send(orderData(incompleteTasks));
    console.log('Task ' + req.params.taskid + ' has been deleted.');
  }
});

// Complete task
app.post('/api/task/complete', (req, res) => {
  const task = incompleteTasks[req.body.taskid];
  if (!task) {
    res.status(404).send('Task not found');
  } else {
    completedTasks[req.body.taskid] = task;
    delete incompleteTasks[req.body.taskid];
    updateTaskMaster(completedTasks, incompleteTasks, projects);
    res.send(orderData(incompleteTasks));
    console.log('Task ' + task.id + ' has been completed.');
  }
});

// Restore test data
app.get('/api/testdata', (req, res) => {
  let testData = {
    projects: [
      {
        name: 'Smart',
        id: 'id-1575321509156'
      },
      {
        name: 'Admin',
        id: 'id-1578418157069'
      },
      {
        name: 'OJB',
        id: 'id-1578418157123'
      },
      {
        name: 'Test Project',
        id: 'id-1578418157999'
      }
    ],
    incompleteTasks: {
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
        created: '2019-11-01T12:05:33.155Z',
        id: 'id-1575720333155'
      },
      'id-1575720348555': {
        value: 'Get feedback from Nick RE E7 modal option',
        projects: 'OJB',
        created: '2019-10-07T12:05:48.555Z',
        id: 'id-1575720348555'
      },
      'id-1575720371290': {
        value: 'Phone IT about getting a windows VM',
        projects: 'Admin',
        created: '2019-09-07T12:06:11.290Z',
        id: 'id-1575720371290'
      },
      'id-1575720389795': {
        value: 'Write up mobile modal rules',
        projects: 'Admin',
        created: '2019-08-07T12:06:29.795Z',
        id: 'id-1575720389795'
      },
      'id-1575720400219': {
        value: 'Sketch versioning',
        projects: 'Admin',
        created: '2019-07-07T12:06:40.219Z',
        id: 'id-1575720400219'
      },
      'id-1575720415644': {
        value: 'Yellow circle - Does it apply to UX?',
        projects: 'Admin',
        created: '2019-06-07T12:06:55.644Z',
        id: 'id-1575720415644'
      },
      'id-1575720447203': {
        value: 'Add back button to calendar designs',
        projects: 'OJB',
        created: '2019-05-07T12:07:27.203Z',
        id: 'id-1575720447203'
      },
      'id-1575720465282': {
        value: 'Create meeting for Jan about Q1 OKRs',
        projects: 'Smart',
        created: '2019-04-07T12:07:45.282Z',
        id: 'id-1575720465282'
      }
    },
    completedTasks: {
      'id-1575720465888': {
        value: 'This is a completed task',
        projects: 'Smart',
        created: '2019-04-07T12:07:45.282Z',
        id: 'id-1575720465888'
      }
    }
  };

  incompleteTasks = testData.incompleteTasks;
  completedTasks = testData.completedTasks;
  projects = testData.projects;

  updateTaskMaster(completedTasks, incompleteTasks, projects);

  const data = [projects, orderData(incompleteTasks)];

  res.send(data);
});

app.listen(5000, () => {
  console.log('----------');
});
