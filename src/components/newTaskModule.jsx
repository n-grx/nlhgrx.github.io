import React, { Component } from 'react';
import ProjectDropdown from './projectdropdown';

class NewTaskModule extends Component {
  state = {
    taskInputValue: '',
    projectSelectorValue: ''
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

  handleProjectSelection = project => {
    this.setState({ projectSelectorValue: project });
  };

  handleCreateTask = () => {
    this.props.onCreateTask(
      this.state.taskInputValue,
      this.state.projectSelectorValue
    );
    this.setState({ taskInputValue: '', projectSelectorValue: '' });
  };

  handleProjectReorder = projectList => {
    this.props.onReorderProjects(projectList);
  };

  render() {
    return (
      <React.Fragment>
        <input
          id="add-task-input"
          className="mb-2"
          type="text"
          placeholder="Add task"
          value={this.state.taskInputValue}
          onKeyPress={this.handleKeyPress}
          onChange={evt => this.updateTaskInputValue(evt)}></input>

        <ProjectDropdown
          items={this.props.items}
          onProjectSelection={this.handleProjectSelection}></ProjectDropdown>

        <button onClick={this.handleCreateTask} className="btn btn-primary">
          Add
        </button>
      </React.Fragment>
    );
  }
}

export default NewTaskModule;
