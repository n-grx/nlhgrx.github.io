import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    isLoading: true,
    projects: [],
    tasks: []
  };

  componentDidMount() {
    const myHeaders = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json'
    });

    fetch('http://localhost:5000/data', {
      headers: myHeaders
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ projects: data.projects, tasks: data.tasks });
      });
  }

  calculateTaskAge = taskCreated => {
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

  calculateProjectScore = task => {};

  orderData = tasks => {
    let rawData = [];

    tasks.map(task => {
      let totalScore = this.calculateTaskAge(task.created);
      let newData = [task, totalScore];
      rawData.push(newData);
    });

    return rawData.sort(function(a, b) {
      return a[1] - b[1];
    });
  };

  render() {
    this.state.tasks.length > 0
      ? console.log(this.orderData(this.state.tasks))
      : console.log('First load.');

    return (
      <div className="app">
        <h1>Today's tasks</h1>
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
              <li className="task" key={idx}>
                <ul>
                  <li>{task.value}</li>
                </ul>
                <ul className="label">
                  <li className="project">{task.projects}</li>
                  <li className="created">
                    {new Date(task.created).toLocaleDateString()}
                  </li>
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
