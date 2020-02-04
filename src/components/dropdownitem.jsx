import React, { Component } from 'react';

class DropdownItem extends Component {
  render() {
    const handleOnClick = () => {
      this.props.triggerAction();
    };

    return (
      <div className="menu-item-container">
        <div className="menu-item" onClick={handleOnClick}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default DropdownItem;
