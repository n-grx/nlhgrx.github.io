import React, { Component } from 'react';

class Task extends Component {
  state = {
    editMode: false,
    taskInputValue: this.props.children,
    isComplete: false
  };

  onHandleEdit = () => {
    this.setState({ editMode: true });
  };

  updateTaskInputValue(evt) {
    this.setState({
      taskInputValue: evt.target.value
    });
  }

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.props.onUpdateTask(this.props.id, this.state.taskInputValue);
      this.setState({ editMode: false });
    }
  };

  onHandleDelete = () => {
    this.props.onDelete(this.props.id);
  };

  handleOnCompleteTask = () => {
    this.setState({ isComplete: true });
    setTimeout(() => {
      this.props.onCompleteTask(this.props.id);
    }, 600);
  };

  calculateTaskAge = dateCreated => {
    const created = new Date(dateCreated);
    const today = new Date();
    let age = Math.floor((today - created) / (1000 * 60 * 60 * 24));
    if (age < 2) {
      return 'Created today';
    } else if (age / 7 >= 1) {
      return Math.floor(age / 7) + 'w ago';
    } else {
      return (age % 7) + 'd ago';
    }
  };

  render() {
    return (
      <React.Fragment>
        <li className="task-item">
          <div className="task-details">
            <div className="checker">
              <input
                type="checkbox"
                className="form-radio"
                id="check-one"
                onClick={this.handleOnCompleteTask}></input>
            </div>
            <div
              className={`task-content ${
                this.state.isComplete ? 'strikethrough' : ''
              }`}>
              <span onClick={this.onHandleEdit}>
                {this.state.editMode === true ? (
                  <input
                    className="inline-task-edit"
                    type="text"
                    placeholder="Add task"
                    value={this.state.taskInputValue}
                    onKeyPress={this.handleKeyPress}
                    onChange={evt => this.updateTaskInputValue(evt)}></input>
                ) : (
                  this.props.children
                )}
              </span>
              <div className="task-content-bottom task-content-age">
                {this.calculateTaskAge(this.props.created)}
              </div>
            </div>
          </div>
          <div className="task-actions">
            <div className="task-content-project">{this.props.projects}</div>
            <div className="task-action-menu">
              <button className="btn btn-icon f">
                <i class="material-icons">more_horiz</i>
              </button>
            </div>
          </div>
        </li>
      </React.Fragment>
    );
  }
}

export default Task;
