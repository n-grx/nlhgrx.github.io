import React, { Component } from 'react';
import './App.css';
import Task from './components/task';
import AddNewTask from './components/createNewTask';
import Dropdown from './components/dropdown';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      mit: [],
      tasks: [],
      taskInputValue: '',
      projectSelectorValue: '',
      projectListOpen: false
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

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.createTask();
    }
  };

  updateTaskInputValue(evt) {
    this.setState({
      taskInputValue: evt.target.value
    });
  }

  updateProjectValue(evt) {
    this.setState({
      projectSelectorValue: evt.target.value
    });
  }

  updateTaskValueInDb = (value, taskId) => {
    console.log(value, taskId);
  };

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.createTask();
    }
  };

  updateTaskInputValue(evt) {
    this.setState({
      taskInputValue: evt.target.value
    });
  }

  updateProjectValue = value => {
    this.setState({
      projectSelectorValue: value
    });
  };

  updateProjectObject = object => {
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
        this.setState({ projects: data[0], tasks: data[1] });
      });
  };

  // Send the new task to the server and update state.tasks with the new task
  createTask = () => {
    fetch('http://localhost:5000/api/createtask', {
      method: 'POST',
      headers: new Headers(),
      body: JSON.stringify({
        projects: this.state.projectSelectorValue,
        value: this.state.taskInputValue
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
        this.setState({ mit: data[0] });
        data.splice(0, 1);
        this.setState({ tasks: data });
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
        this.setState({ tasks: data });
      });
  };

  render() {
    return (
      <div className="app">
        <h1>
          To Do (
          <a onClick={this.restoretestData} href="#">
            Restore
          </a>
          )
        </h1>
        <div className="new-task-container">
          <input
            id="add-task-input"
            type="text"
            placeholder="Add task"
            value={this.state.taskInputValue}
            onKeyPress={this.handleKeyPress}
            onChange={evt => this.updateTaskInputValue(evt)}></input>
          <Dropdown
            items={this.state.projects}
            onUpdateProjectObject={this.updateProjectObject}
            searchable={true}
            sortable={true}></Dropdown>
          <button onClick={this.createTask}>Add</button>
        </div>
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
          {this.state.mit < 1 ? (
            <p>Looks like you're done for the day!</p>
          ) : (
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
          )}
        </div>
        {/* <h3>Completed tasks</h3>
        <ul className="completedTaskList">
          {this.state.completedTasks.length < 1 ? (
            <li>You haven't completed any tasks yet.</li>
          ) : (
            this.state.completedTasks.map(task => (
              <li>
                {task.value} <button className="inline-link">Delete</button>
              </li>
            ))
          )}
        </ul> */}
      </div>
    );
  }
}

export default App;
