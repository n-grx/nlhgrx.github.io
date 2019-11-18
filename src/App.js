import React, { Component } from 'react';
import './App.css';

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
        this.setState({ projects: data.projects, tasks: data.tasks });
      });
  }

  // Calculate a score based on the tasks age
  calculateTaskAge = taskCreated => {
    // get the age of the task in days
    let age = Math.floor(
      (new Date() - new Date(taskCreated)) / (1000 * 60 * 60 * 24)
    );
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
    let projectCount = this.state.projects.length;

    // find the task's project in the projects array
    let project = this.state.projects.find(
      project => project.name === task.projects
    );

    return projectCount - project.id + 1;
  };

  // Calculate the total score for the task
  calculateTaskScore = task => {
    return (
      this.calculateTaskAge(task.created) + this.calculateProjectScore(task)
    );
  };

  orderData = () => {
    let rawData = [];
    Object.keys(this.state.tasks).map(id => {
      let task = this.state.tasks[id];
      let totalScore = this.calculateTaskScore(task);
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
      .then(newData => {
        this.setState({ tasks: newData.tasks });
      });
    this.setState({ taskInputValue: '' });
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
            this.orderData().map((task, idx) => (
              <li className="task" key={idx}>
                <ul>
                  <li>{task.value}</li>
                </ul>
                <ul className="label">
                  <li className="project">
                    {task.projects} - {this.calculateProjectScore(task)}
                  </li>
                  <li className="created">
                    {new Date(task.created).toLocaleDateString()} -{' '}
                    {this.calculateTaskAge(task.created)}
                  </li>
                  <li>{this.calculateTaskScore(task)}</li>
                </ul>
              </li>
            ))
          )}
        </ul>
      </div>
    );
  }
}

export default App;
