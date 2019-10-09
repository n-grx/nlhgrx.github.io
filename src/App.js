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

    fetch('http://localhost:5000/projects', {
      headers: myHeaders
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ projects: data.projects, tasks: data.tasks });
      });
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
        <ul className="task">
          {this.state.tasks.map(task => (
            <li>
              <ul className="label">
                <li className="project">{task.projects}</li>
                <li className="created">
                  {new Date(task.created * 1000).toDateString()}
                </li>
              </ul>
              <ul>
                <li>{task.value}</li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
