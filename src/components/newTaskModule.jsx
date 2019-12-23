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
        <div className="new-task-container">
          {/* <div>
            <button className="btn btn-icon">
              <i class="material-icons">add</i> New task
            </button>
          </div> */}
          <div>
            <input
              id="add-task-input"
              type="text"
              placeholder="Add task"
              value={this.state.taskInputValue}
              onKeyPress={this.handleKeyPress}
              onChange={evt => this.updateTaskInputValue(evt)}></input>
            <div className="fr">
              <ProjectDropdown
                items={this.props.items}
                onProjectSelection={this.handleProjectSelection}
                onProjectReorder={this.handleProjectReorder}></ProjectDropdown>
              <button
                onClick={this.handleCreateTask}
                className="btn btn-primary">
                Add
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default NewTaskModule;
