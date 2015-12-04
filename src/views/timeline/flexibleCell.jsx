"use strict";

import React from "react";


export default React.createClass({
  propTypes() {
    return {
      index: React.PropTypes.number.isRequired,
      flexGrow: React.PropTypes.number.isRequired,
      className: React.PropTypes.string,
      onMouseEnter: React.PropTypes.func,
    }
  },

  render() {
    let className = "timeline__flexible-cell";
    if (this.props.className) {
      className += " " + this.props.className;
    }

    return <div className={className}
                style={{flexGrow: this.props.flexGrow}}
                onMouseDown={this._onMouseDown}
                onMouseEnter={this._onMouseEnter}></div>;
  },

  _onMouseDown(e) {
    if (this.props.onMouseDown) {
      this.props.onMouseDown(this.props.index)(e);
    }
  },

  _onMouseEnter(e) {
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(this.props.index)(e);
    }
  }
});