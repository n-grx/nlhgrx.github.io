import React, { Component } from 'react';

class Dropdown extends React.Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    this.state = {
      popupVisible: false,
      items: {},
      projectSelectorValue: 'Select...'
    };
  }

  handleClick() {
    if (!this.state.popupVisible) {
      // attach/remove event handler
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }

    this.setState(prevState => ({
      popupVisible: !prevState.popupVisible
    }));
  }

  handleOutsideClick(e) {
    // ignore clicks on the component itself
    if (this.node.contains(e.target)) {
      return;
    }

    this.handleClick();
  }

  onDragStart = (e, index) => {
    this.draggedItem = this.props.items[index];
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  onDragOver = index => {
    const draggedOverItem = this.props.items[index];

    // if the item is dragged over itself, ignore
    if (this.draggedItem === draggedOverItem) {
      return;
    }

    // filter out the currently dragged item
    let items = this.props.items.filter(item => item !== this.draggedItem);

    // add the dragged item after the dragged over item
    items.splice(index, 0, this.draggedItem);

    this.setState({ items: items });
  };

  onDragEnd = () => {
    this.draggedIdx = null;
    this.props.onUpdateProjectObject(this.state.items);
  };

  render() {
    return (
      <div
        className="popover-container"
        ref={node => {
          this.node = node;
        }}>
        <button onClick={this.handleClick}>
          {this.state.projectSelectorValue}
        </button>
        {this.state.popupVisible && (
          <div className="menu-container noselect">
            <div className="menu">
              <div className="menu-input">
                <input></input>
              </div>
              <div className="menu-list">
                {this.props.items.map((item, idx) => (
                  <div onDragOver={() => this.onDragOver(idx)}>
                    <div
                      className="menu-item"
                      key={idx}
                      draggable="true"
                      onDragStart={e => this.onDragStart(e, idx)}
                      onDragEnd={this.onDragEnd}
                      onClick={() => {
                        this.setState({
                          projectSelectorValue: this.props.items[idx].name
                        });
                        this.handleClick();
                      }}>
                      <div>
                        <span className="drag-icon-left">
                          <i className="material-icons md-18">drag_indicator</i>
                        </span>
                        <span>{this.props.items[idx].name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Dropdown;
