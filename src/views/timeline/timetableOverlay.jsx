"use strict";

import React              from "react";

import {Composition}      from "src/stores/model/composition";


export default React.createClass({
  propTypes() {
    return {
      composition: React.PropTypes.instanceOf(Composition).isRequired,
      currentFrame: React.PropTypes.number,
    };
  },

  render() {
    return (this.props.currentFrame === null)? (
      <div className="timeline__timetable-overlay pointer-disabled"></div>
    ) : (
      <div className="timeline__timetable-overlay pointer-disabled">
        <div className="timeline__timetable-overlay__before pointer-disabled"
             style={{flexGrow: this.props.currentFrame}}></div>
        <div className="timeline__timetable-overlay__controller pointer-disabled"
             style={{flexGrow: 1}}></div>
        <div className="timeline__timetable-overlay__after pointer-disabled"
             style={{flexGrow: this.props.composition.frame - this.props.currentFrame - 1}}></div>
      </div>
    );
  },
});
