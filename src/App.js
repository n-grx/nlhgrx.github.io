import React, { Component } from 'react';
import './App.css';
import Task from './components/task';

class App extends Component {
  state = {
    isLoading: true,
    projects: [],
    tasks: [],
    taskInputValue: '',
    testData: {
      id: 123456,
      value: 'This is a new task',
      projects: 'OJB',
      created: '2019-11-09T01:31:41Z'
    }
  };

  componentDidMount() {
    const myHeaders = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });

    fetch('http://localhost:5000/api/gettasks', {
      headers: myHeaders
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ tasks: data });
      });
  }

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.sendToServer();
      this.setState({ taskInputValue: '' });
    }
  };

  updateTaskInputValue(evt) {
    this.setState({
      taskInputValue: evt.target.value
    });
  }

  sendToServer = () => {
    fetch('http://localhost:5000/api/createtask', {
      method: 'POST',
      headers: new Headers(),
      body: JSON.stringify({
        projects: 'OJB',
        value: this.state.taskInputValue
      })
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ tasks: data });
      });
    this.setState({ taskInputValue: '' });
  };

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

  render() {
    return (
      <div className="app">
        <h1>Today's tasks</h1>
        <div>
          <form>
            <input
              id="add-task-input"
              type="text"
              placeholder="Add task"
              value={this.state.taskInputValue}
              onKeyPress={this.handleKeyPress}
              onChange={evt => this.updateTaskInputValue(evt)}
            />
            <input type="submit" onClick={this.sendToServer} />
          </form>
        </div>
        <h2>MIT</h2>
        <ul>
          <li>This is your most important task</li>
        </ul>
        <h2>Everything else</h2>
        <ul className="task-list">
          {this.state.tasks.length < 1 ? (
            <li>No Data available</li>
          ) : (
            this.state.tasks.map((task, idx) => (
              <Task
                key={idx}
                id={task.id}
                projects={task.projects}
                created={task.created}
                onClick={this.deleteFromServer}>
                {task.value}
              </Task>
            ))
          )}
        </ul>
      </div>
    );
  }
}

export default App;
