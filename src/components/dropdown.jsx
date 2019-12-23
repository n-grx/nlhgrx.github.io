import React, { Component } from 'react';

class Dropdown extends Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    this.state = {
      popupVisible: false,
      items: [],
      suggestions: [],
      projectSelectorValue: 'Select project'
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

  onTextChange = e => {
    const value = e.target.value;
    let suggestions = [];

    this.setState({ hasNewProject: false });

    if (value.length === 0) {
      suggestions = this.props.items;
      this.setState({ suggestions });
    }
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, 'i');
      suggestions = this.props.items.sort().filter(v => regex.test(v.name));
    }

    if (suggestions.length === 0) {
      suggestions.push({ name: value });
      this.setState({ suggestions, hasNewProject: true });
    } else {
      this.setState({ suggestions });
    }
  };

  renderSuggestions = () => {
    let { suggestions } = this.state;
    let { hasNewProject } = this.state;
    if (suggestions.length === 0) {
      suggestions = this.props.items;
    }

    return suggestions.map((item, idx) => (
      <div
        className="menu-item-container"
        key={idx}
        onDragOver={() => this.onDragOver(idx)}>
        <div
          className="menu-item"
          draggable="true"
          onDragStart={e => this.onDragStart(e, idx)}
          onDragEnd={this.onDragEnd}
          onClick={() => {
            this.handleProjectSelection(suggestions[idx].name);
          }}>
          <div className="drag-icon-left">
            <i className="material-icons md-18">drag_indicator</i>
          </div>
          <div>
            {hasNewProject ? '+ Create a new project with ' : ''}
            {suggestions[idx].name}
          </div>
        </div>
      </div>
    ));
  };

  render() {
    return (
      <div
        className="popover-container"
        ref={node => {
          this.node = node;
        }}>
        {this.state.popupVisible && (
          <div className="menu-container noselect">
            <div className="menu">
              <div className="menu-input">
                <input
                  onChange={this.onTextChange}
                  placeholder="Find project"></input>
                <i class="material-icons md-24">search</i>
              </div>
              <div className="menu-list">{this.renderSuggestions()}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Dropdown;