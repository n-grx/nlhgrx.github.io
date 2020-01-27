export function reorderProjects(object) {
  fetch('http://localhost:5000/api/projects/order ', {
    method: 'POST',
    headers: new Headers(),
    body: JSON.stringify({
      projects: object
    })
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.setState({ tasks: data[1], projects: data[0] });
    });
}

// Send the new task to the server and update state.tasks with the new task
export function createTask(task, project) {
  fetch('http://localhost:5000/api/task/create', {
    method: 'POST',
    headers: new Headers(),
    body: JSON.stringify({
      projects: project,
      value: task
    })
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.setState({ tasks: data });
    });
  this.setState({
    taskInputValue: ''
  });
}

// Update task value
export function updateTaskValue(taskIDX, taskValue) {
  fetch('http://localhost:5000/api/task/edit/value', {
    method: 'POST',
    headers: new Headers(),
    body: JSON.stringify({
      taskid: taskIDX,
      value: taskValue
    })
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.setState({ tasks: data });
    });
}

// Update task project
export function updateTaskProject(taskIDX, project) {
  fetch('http://localhost:5000/api/task/edit/projects', {
    method: 'POST',
    headers: new Headers(),
    body: JSON.stringify({
      taskid: taskIDX,
      project: project
    })
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      const tasks = data[0];
      const projects = data[1];
      this.setState({ tasks: tasks, projects: projects });
    });
}

// Delete the task from the server
export function deleteTask(taskId) {
  fetch('http://localhost:5000/api/task/delete/' + taskId, {
    method: 'POST',
    headers: new Headers()
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.setState({ tasks: data });
    });
}

// Delete project
export function deleteProject(e) {
  const projectIDX = e.currentTarget.value;

  fetch('http://localhost:5000/api/projects/delete/' + projectIDX, {
    method: 'POST',
    headers: new Headers()
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.setState({ tasks: data[0], projects: data[1] });
    });
}

// Complete task
export function completeTask(taskIDX) {
  fetch('http://localhost:5000/api/task/complete', {
    method: 'POST',
    headers: new Headers(),
    body: JSON.stringify({
      taskid: taskIDX
    })
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.length < 1) {
        this.setState({ tasks: false });
      } else {
        this.setState({ tasks: data });
      }
    });
}

// restore test data
export function restoretestData() {
  fetch('http://localhost:5000/api/testdata', {
    headers: this.state.myHeaders
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.setState({ projects: data[0], tasks: data[1] });
    });
}
