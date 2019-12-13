import React, { Component } from 'react';

class AddNewTask extends Component {
  state = {
    items: ['🍰 Cake', '🍩 Donut', '🍎 Apple', '🍕 Pizza'],
    projects: this.props.projectList,
    projectListOpen: false
  };

  componentDidMount() {
    this.setState({ projects: this.props.projectList });
  }

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

  updateProjectValue(evt) {
    this.setState({
      projectSelectorValue: evt.target.value
    });
  }

  //   ==============

  updateParentProjectList = () => {};

  onDragStart = (e, index) => {
    this.draggedItem = this.state.items[index];
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  onDragOver = index => {
    const draggedOverItem = this.state.items[index];

    // if the item is dragged over itself, ignore
    if (this.draggedItem === draggedOverItem) {
      return;
    }

    // filter out the currently dragged item
    let items = this.state.items.filter(item => item !== this.draggedItem);

    // add the dragged item after the dragged over item
    items.splice(index, 0, this.draggedItem);

    this.setState({ items });
  };

  onDragEnd = () => {
    this.draggedIdx = null;
  };

  render() {
    return (
      <div className="new-task-container">
        <input
          id="add-task-input"
          type="text"
          placeholder="Add task"
          value={this.state.taskInputValue}
          onKeyPress={this.handleKeyPress}
          onChange={evt => this.updateTaskInputValue(evt)}></input>
        <div className="test">
          <div>
            <button
              onClick={() => {
                this.setState({ projectListOpen: true });
              }}>
              Select project
            </button>
          </div>
          <div
            className={
              this.state.projectListOpen
                ? 'menu-container noselect'
                : 'menu-container noselect hide'
            }>
            <div className="menu">
              <div className="menu-input">
                <input></input>
              </div>
              <div className="menu-list">
                {Object.keys(this.props.projectList).map((project, idx) => (
                  <div className="menu-item" key={idx} draggable="true">
                    <span className="drag-icon-left">
                      <i className="material-icons md-18">drag_indicator</i>
                    </span>
                    <span>{this.props.projectList[project].name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button onClick={this.createTask}>Add</button>

        {/* <div className="App">
          <main>
            <h3>List of items</h3>
            <ul>
              {this.state.items.map((item, idx) => (
                <li key={item} onDragOver={() => this.onDragOver(idx)}>
                  <div
                    className="drag"
                    draggable
                    onDragStart={e => this.onDragStart(e, idx)}
                    onDragEnd={this.onDragEnd}>
                    XXX
                  </div>
                  <span className="content">{item}</span>
                </li>
              ))}
            </ul>
          </main>
        </div> */}
      </div>
    );
  }
}

export default AddNewTask;
