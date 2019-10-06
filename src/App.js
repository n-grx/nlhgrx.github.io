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
    this.fetchData();
    this.orderTasks();
  }

  fetchData = () => {
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
  };

  orderTasks = () => {
    let projectPriority = [];
    this.state.projects.map(item => projectPriority.push(item.name));

    console.log(projectPriority);
  };

  render() {
    return (
      <div className="App">
        <div id="sidebar_left">
          <ul>
            <li>Today</li>
            <li>Backlog</li>
          </ul>
          <h2>Projects</h2>
          <ul>
            {this.state.projects.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
        <div id="main_content">
          <h1>Today's tasks</h1>
          <h2>MIT</h2>
          <ul>
            <li>This is your most important task</li>
          </ul>
          <h2>Everything else</h2>
          <ul>
            {this.state.tasks.map(item => (
              <li key={item.id}>
                <span>{item.value}</span>
                <span>{item.project}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
