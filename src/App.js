import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      projects: [],
      tasks: []
    };
  }

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

    // =============

    let orderedData = [];

    this.state.projects.forEach(project => {
      this.state.tasks.filter(task => {
        if (task.projects === project.name) {
          orderedData.push(task);
        }
      });
    });

    let taskMeta = [];

    this.state.projects.forEach((project, idx) => {
      this.state.tasks.filter(task => {
        if (task.projects === project.name) {
          taskMeta.push([task.id, idx + 1]);
        }
      });
    });

    let calculateAgeScore = taskId => {
      let selectedTask = this.state.tasks.filter(task => {
        return task.id === taskId;
      });

      let now = new Date();
      let then = new Date(selectedTask.created * 1000);
      let timeSince = now - then;
      return timeSince;
    };

    console.log("306158's age is:" + calculateAgeScore(306185));

    // =============
  }

  render() {
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
            this.state.tasks.map(task => (
              <li className="task">
                <ul>
                  <li>{task.value}</li>
                </ul>
                <ul className="label">
                  <li className="project">{task.projects}</li>
                  <li className="created">
                    {new Date(task.created * 1000).toDateString()}
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
