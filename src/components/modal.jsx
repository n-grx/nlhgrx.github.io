import React, { Component } from 'react';

class Modal extends Component {
  handleHideModal = () => {
    this.props.hide();
  };

  render() {
    const showHideClassName = this.props.show
      ? 'modal display-block'
      : 'modal display-none';

    return (
      <div className={showHideClassName}>
        <section className="modal-main">
          <h2>{this.props.heading}</h2>
          {this.props.children}
          <button
            className="btn btn-icon btn-invisible modal-close mr-2 mt-2"
            onClick={this.handleHideModal}>
            <i className="material-icons">close</i>
          </button>
        </section>
      </div>
    );
  }
}

export default Modal;
