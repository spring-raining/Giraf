"use strict";

import React                                    from "react";
import keyMirror                                from "keymirror";

import Actions                                  from "src/actions/actions";


const Modal = React.createClass({
  propTypes() {
    return {
      title: React.PropTypes.string,
      footer: React.PropTypes.node,
    };
  },

  componentDidMount() {
    // reveal
    this.refs.modalWall.classList.remove("hidden");
  },

  render() {
    const title = (!this.props.title)? null :
      <h4 className="modal__title">
        {this.props.title}
      </h4>;

    const footer = (!this.props.footer)? null :
      <div className="modal__footer">
        {this.props.footer}
      </div>;

    return (
      <div className="modal__wall hidden"
           ref="modalWall"
           onClick={this._onWallClick}>
        <div className="modal"
             onClick={this._onBodyClick}>
          {title}
          <div className="modal__content">
            {this.props.children}
          </div>
          {footer}
        </div>
      </div>
    );
  },

  _onWallClick() {
    Actions.updateModal(null);
  },

  _onBodyClick(e) {
    e.stopPropagation();
  }
});

const ModalButtonSet = React.createClass({
  propTypes() {
    return {
      content: React.PropTypes.arrayOf(
        React.PropTypes.shape({
          text: React.PropTypes.string.isRequired,
          onClick: React.PropTypes.func.isRequired,
        })
      ).isRequired,
    }
  },

  render() {
    const buttons = this.props.content.map((e, i) =>
      <button key={i} onClick={e.onClick}>
        {e.text}
      </button>
    );

    return (
      <div className="modal-button-set">
        {buttons}
      </div>
    );
  }
});

export default {
  Modal: Modal,
  ModalButtonSet: ModalButtonSet,
};
