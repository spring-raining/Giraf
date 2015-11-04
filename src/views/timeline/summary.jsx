"use strict";

import React            from "react";

import {Composition}    from "src/stores/model/composition";


export default React.createClass({
  propTypes() {
    return {
      composition: React.PropTypes.instanceOf(Composition).isRequired,
    }
  },

  render() {
    let comp = this.props.composition;
    return <div className="timeline__summary">
      <span className="timeline__summary__name">{comp.name}</span>
      <div className="timeline__summary__info">
        <span className="timeline__summary__badge">{comp.frame}</span>
        <span>frame</span>
        <span className="timeline__summary__badge">{comp.fps}</span>
        <span>fps</span>
      </div>
    </div>;
  },
});
