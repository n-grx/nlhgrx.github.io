import React, { Component } from 'react';
import './App.css';
import Task from './components/task';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      projects: [],
      tasks: [],
      completedTasks: [],
      taskInputValue: '',
      projectSelectorValue: ''
    };
  }

  componentDidMount() {
    const myHeaders = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });

    fetch('http://localhost:5000/api/getincompletetasks', {
      headers: myHeaders
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ tasks: data });
      });

    fetch('http://localhost:5000/api/getcompletedtasks', {
      headers: myHeaders
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ completedTasks: data });
      });

    fetch('http://localhost:5000/api/getprojects', {
      headers: myHeaders
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ projects: data });
      })
      .then(console.log(Object.keys(this.state.projects)));

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
        this.setState({ tasks: data[0], completedTasks: data[1] });
      });
  };

  render() {
    return (
      <div className="app">
        <h1>Today's tasks</h1>
        <div>
          <input
            id="add-task-input"
            type="text"
            placeholder="Add task"
            value={this.state.taskInputValue}
            onKeyPress={this.handleKeyPress}
            onChange={evt => this.updateTaskInputValue(evt)}></input>
          <select
            className="ui compact selection dropdown"
            onChange={evt => this.updateProjectValue(evt)}>
            {Object.keys(this.state.projects).map((project, idx) => (
              <option key={idx}>{this.state.projects[project].name}</option>
            ))}
          </select>
          <button onClick={this.createTask}>Search</button>
        </div>

        <ul className="task-list">
          {this.state.tasks.length < 1 ? (
            <li>Looks like you're done for the day!</li>
          ) : (
            this.state.tasks.map(task => (
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
            ))
          )}
        </ul>
        <h3>Completed tasks</h3>
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
        </ul>
      </div>
    );
  }
}

export default App;
