import React, { Component } from 'react';

class Task extends Component {
  state = {
    created: this.props.created
  };

  handleOnClick = () => {
    this.props.onClick(this.props.id);
  };

  render() {
    return (
      <React.Fragment>
        <li className="task" key={this.props.taskid}>
          <ul>
            <li>{this.props.children}</li>
          </ul>
          <ul className="label">
            <li className="project">{this.props.projects}</li>
            <li className="created">
              {new Date(this.props.created).toLocaleDateString()}
            </li>
            <li>
              <button onClick={this.handleOnClick}>Delete</button>
            </li>
          </ul>
        </li>
      </React.Fragment>
    );
  }
}

export default Task;
