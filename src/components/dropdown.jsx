import React, { Component } from 'react';

class Dropdown extends Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    this.state = {
      popupVisible: false
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

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  render() {
    return (
      <div
        className="popover-container"
        ref={node => {
          this.node = node;
        }}>
        <button
          onClick={this.handleClick}
          className={
            this.props.btnInvisible
              ? 'btn btn-icon btn-invisible'
              : 'btn btn-icon'
          }>
          <i className="material-icons">{this.props.icon}</i>
        </button>
        {this.state.popupVisible && (
          <div className="menu-container noselect pull-right">
            <div className="menu">
              <div className="menu-list">{this.props.children}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Dropdown;
