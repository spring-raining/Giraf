"use strict";

import React            from "react";

import {Composition}    from "src/stores/model/composition";


export default React.createClass({
  propTypes() {
    return {
      composition: React.PropTypes.instanceOf(Composition).isRequired,
      onClick: React.PropTypes.func,
    }
  },

  render() {
    let comp = this.props.composition;
    return <div className="timeline__summary"
                onClick={this._onClick}>
      <span className="timeline__summary__name">{comp.name}</span>
      <div className="timeline__summary__info">
        <span className="timeline__summary__badge">{comp.frame}</span>
        <span>frame</span>
        <span className="timeline__summary__badge">{comp.fps}</span>
        <span>fps</span>
      </div>
    </div>;
  },

  _onClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }
});
