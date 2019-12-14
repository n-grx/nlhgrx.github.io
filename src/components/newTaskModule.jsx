import React, { Component } from 'react';
import Dropdown from './dropdown';

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
        <div className="new-task-container">
          <input
            id="add-task-input"
            type="text"
            placeholder="Add task"
            value={this.state.taskInputValue}
            onKeyPress={this.handleKeyPress}
            onChange={evt => this.updateTaskInputValue(evt)}></input>
          <Dropdown
            items={this.props.items}
            onUpdateProjectObject={this.updateProjectObject}
            onProjectReorder={this.handleProjectReorder}></Dropdown>
          <button onClick={this.handleCreateTask}>Add</button>
        </div>
      </React.Fragment>
    );
  }
}

export default NewTaskModule;
