"use strict";

import React from "react";

import {Composition} from "../../stores/model/composition";

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
      <span className="timeline__summary__frame">{comp.frame}fr</span>
      <span className="timeline__summary__fps">{comp.fps}fps</span>
      <span className="timeline__summary__size">{comp.width} x {comp.height}</span>
    </div>;
  },
});
