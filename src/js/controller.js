// Understands the data and talks to the view
import appModel from './model';
const model = new appModel();

// Calculate a score based on the tasks age
let calculateTaskAge = date => {
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
let calculateProjectScore = (task, projects) => {
  if (!projects) {
    return 0;
  }

  let projectCount = projects.length;
  let projectScore;
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
let calculateTaskScore = (task, projects) => {
  let score =
    calculateTaskAge(task.created) + calculateProjectScore(task, projects);
  return score;
};

// Order data
let orderData = (tasks, projects) => {
  let rawData = [];
  Object.keys(tasks).map(id => {
    let task = tasks[id];
    let totalScore = calculateTaskScore(task, projects);
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

class Controller {
  getData() {
    let tasks = model.getDataFromStorage('tasks');
    let projects = model.getDataFromStorage('projects');

    if (!tasks) {
      model.addDataToStorage('tasks', {});
      tasks = model.getDataFromStorage('tasks');
    }

    if (!projects) {
      model.addDataToStorage('projects', []);
      projects = model.getDataFromStorage('projects');
    }
    return [orderData(tasks), projects];
  }

  getTestData = () => {
    let tasks = {};
    let projects = [];

    let taskId = 1583928051397;

    // Create dummy projects
    for (let i = 0; i < 5; i++) {
      const timeStamp = Date.now();
      const id = 'id-' + timeStamp;
      const name = 'Project ' + i;
      const project = { id: id, name: name };
      projects.push(project);
    }

    // create dummy tasks
    for (let i = 0; i < 20; i++) {
      const timeStamp = Date.now();
      const created = new Date(timeStamp);
      const id = 'id-' + taskId;
      taskId++;

      tasks[id] = {
        id: id,
        value: 'Task ' + i,
        project: projects[Math.floor(Math.random() * projects.length)].name,
        created: created
      };
    }

    model.addDataToStorage('tasks', tasks);
    model.addDataToStorage('projects', projects);
    return [
      orderData(model.getDataFromStorage('tasks')),
      model.getDataFromStorage('projects')
    ];
  };

  createTask = (task, project) => {
    // Create a timestamp and ID for the task
    const timeStamp = Date.now();
    const id = 'id-' + timeStamp;
    const created = new Date(timeStamp);

    // Check if the project is new
    let projects = model.getDataFromStorage('projects');
    let taskProject = projects.filter(item => {
      return item.name === project;
    });
    if (taskProject.length < 1) {
      let timeStamp = Date.now();
      let id = 'id-' + timeStamp;
      taskProject = { name: project, id: id };
      projects.push(taskProject);
      model.addDataToStorage('projects', projects);
    }

    // Add the task to the db
    model.addTask(id, task, project, created);
  };

  editTaskValue = (id, value) => {
    let tasks = model.getDataFromStorage('tasks');
    let task = tasks[id];
    task.value = value;
    model.addDataToStorage('tasks', tasks);
  };

  editTaskProject = () => {};

  completeTask = id => {
    let tasks = model.getDataFromStorage('tasks');
    delete tasks[id];
    model.addDataToStorage('tasks', tasks);
  };

  deleteTask = id => {
    let tasks = model.getDataFromStorage('tasks');
    delete tasks[id];
    model.addDataToStorage('tasks', tasks);
  };

  addProject = () => {};
  editProject = () => {};
  deleteProject = () => {};

  reorderProjects = object => {
    model.addDataToStorage('projects', object);
  };
}

export default Controller;
