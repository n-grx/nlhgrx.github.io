import React, { Component } from 'react';
import './App.css';
import Task from './components/task';
import NewTaskModule from './components/newTaskModule';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mit: [],
      tasks: [],
      projects: []
    };
  }

  myHeaders = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  });

  componentDidMount() {
    fetch('http://localhost:5000/api/getincompletetasks', {
      headers: this.state.myHeaders
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ mit: data[0] });
        data.splice(0, 1);
        this.setState({ tasks: data });
      });

    fetch('http://localhost:5000/api/getprojects', {
      headers: this.state.myHeaders
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ projects: data });
      });

    // this.setState({ projectSelectorValue : initialProject });
  }

  reorderProjects = object => {
    fetch('http://localhost:5000/api/updateprojects', {
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
        let newMit = data[1][0];
        data[1].splice(0, 1);
        this.setState({ mit: newMit, tasks: data[1], projects: data[0] });
      });
  };

  // Send the new task to the server and update state.tasks with the new task
  createTask = (task, project) => {
    fetch('http://localhost:5000/api/createtask', {
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
  };

  // Update task
  updateTask = (taskIDX, taskValue) => {
    fetch('http://localhost:5000/api/edittask', {
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
  };

  // Delete the new task to the server and update state.tasks with the new task
  deleteFromServer = taskId => {
    fetch('http://localhost:5000/api/delete/' + taskId, {
      method: 'POST',
      headers: new Headers()
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ tasks: data });
      });
  };

  // Update task
  completeTask = taskIDX => {
    fetch('http://localhost:5000/api/completetask', {
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
          this.setState({ tasks: false, mit: false });
        } else {
          this.setState({ mit: data[0] });
          data.splice(0, 1);
          this.setState({ tasks: data });
        }
      });
  };

  // restore test data
  restoretestData = () => {
    fetch('http://localhost:5000/api/testdata', {
      headers: this.state.myHeaders
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ mit: data[0] });
        data.splice(0, 1);
        this.setState({ tasks: data });
      });
  };

  onHandleCreateTask = (task, project) => {
    this.createTask(task, project);
  };

  render() {
    return (
      <div className="app">
        <h1>To Do</h1>
        <button onClick={this.restoretestData}>Restore</button>
        <NewTaskModule
          items={this.state.projects}
          onCreateTask={this.onHandleCreateTask}
          onReorderProjects={this.reorderProjects}></NewTaskModule>

        {this.state.mit === false ? (
          <p>Looks like you're done for the day</p>
        ) : (
          <React.Fragment>
            <div className="mit-task-container">
              <h2>This is your MIT</h2>
              <ul className="mit-task">
                <Task
                  key={this.state.mit.id}
                  id={this.state.mit.id}
                  projects={this.state.mit.projects}
                  created={this.state.mit.created}
                  onDelete={this.deleteFromServer}
                  onUpdateTask={this.updateTask}
                  onCompleteTask={this.completeTask}>
                  {this.state.mit.value}
                </Task>
              </ul>
            </div>
            <div className="task-list-container">
              <h2>Everything else</h2>
              <ul className="task-list">
                {this.state.tasks.map(task => (
                  <Task
                    key={task.id}
                    id={task.id}
                    projects={task.projects}
                    created={task.created}
                    onDelete={this.deleteFromServer}
                    onUpdateTask={this.updateTask}
                    onCompleteTask={this.completeTask}>
                    {task.value}
                  </Task>
                ))}
              </ul>
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default App;
