import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dropdown from './dropdown';
import DropdownItem from './dropdownitem';
import ProjectDropdown from './projectdropdown';

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      taskInputValue: this.props.children,
      isComplete: false
    };
  }

  onHandleEdit = () => {
    this.setState({ editMode: true });
  };

  updateTaskInputValue(evt) {
    let domNode = ReactDOM.findDOMNode(this);
    this.setState({
      taskInputValue: domNode.innerText
    });
  }

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.props.onUpdateTask(this.props.id, this.state.taskInputValue);
      this.setState({ editMode: false });
    }
  };

  handleDelete = () => {
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
      return 'Today';
    } else if (age / 7 >= 1) {
      return Math.floor(age / 7) + 'w ago';
    } else {
      return (age % 7) + 'd ago';
    }
  };

  handleProjectSelection = project => {
    this.props.onUpdateProject(this.props.id, project);
  };

  render() {
    return (
      <React.Fragment>
        <li className="task-item">
          <div>
            <div className="task-details">
              <div className="checker">
                <input
                  type="checkbox"
                  className="form-radio mr-3 "
                  id="check-one"
                  onClick={this.handleOnCompleteTask}></input>
              </div>
              <div
                className={`task-content ${
                  this.state.isComplete ? 'strikethrough' : ''
                }`}>
                {this.state.editMode ? (
                  <input
                    className="inline-task-edit"
                    type="text"
                    placeholder="Add task"
                    value={this.state.taskInputValue}
                    onKeyPress={this.handleKeyPress}
                    onChange={evt => this.updateTaskInputValue(evt)}></input>
                ) : (
                  <span onClick={this.onHandleEdit}>{this.props.children}</span>
                )}
              </div>
            </div>
            <div className="task-actions">
              <div className="task-content-project mr-2">
                {this.props.projects}
              </div>
              <div className="  task-content-age">
                {this.calculateTaskAge(this.props.created)}
              </div>

              <div className="task-action-menu">
                <Dropdown icon="more_horiz" btnInvisible={true}>
                  <DropdownItem triggerAction={this.handleDelete}>
                    Delete
                  </DropdownItem>
                </Dropdown>
              </div>
            </div>
          </div>
        </li>
      </React.Fragment>
    );
  }
}

export default Task;
