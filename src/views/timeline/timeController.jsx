"use strict";

import React from "react";

import Actions from "../../actions/actions";
import {Composition} from "../../stores/model/composition";
import FlexibleCell from "./flexibleCell";
import GenDummyImg from "../../utils/genDummyImg";


var TimeControllerHandle = React.createClass({
  render() {
    return (
      <div className="timeline__time-controller__handle"
           style={{flexGrow: 1}}></div>
    );
  },
});

var TimeControllerCells = React.createClass({
  render() {
    let cells = [];
    for (var i=0; i < this.props.composition.frame; i++) {
      if (this.props.currentFrame === i) {
        cells.push(
          <TimeControllerHandle key={i}
                                composition={this.props.composition}
                                currentFrame={this.props.currentFrame} />);
      }
      else {
        cells.push(
          <FlexibleCell key={i} index={i} flexGrow={1}
                        className="timeline__time-controller__cell"
                        onMouseDown={this._onMouseDown}
                        onMouseEnter={this._onMouseEnter}/>);
      }
    }

    return (
      <div className="timeline__time-controller__cells-container">
        {cells}
      </div>
    );
  },

  _onMouseDown(index) {
    return (e) => {
      e.stopPropagation();
      Actions.updateCurrentFrame(index);
    };
  },

  _onMouseEnter(index) {
    return (e) => {
      e.stopPropagation();
      if (e.buttons % 2 === 1) {    // left button pressed
        Actions.updateCurrentFrame(index);
      }
    };
  },
});

export default React.createClass({
  propTypes() {
    return {
      composition: React.PropTypes.instanceOf(Composition).isRequired,
      currentFrame: React.PropTypes.number,
    }
  },

  render() {
    let content = (this.props.currentFrame)?
      <TimeControllerHandle composition={this.props.composition}
                            currentFrame={this.props.currentFrame} /> :
      <TimeControllerCells composition={this.props.composition} />;

    return (
      <div className="timeline__time-controller">
        <TimeControllerCells composition={this.props.composition}
                             currentFrame={this.props.currentFrame} />
      </div>
    );
  },
});
