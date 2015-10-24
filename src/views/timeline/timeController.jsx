"use strict";

import React              from "react";

import Actions            from "src/actions/actions";
import {Composition}      from "src/stores/model/composition";
import GenDummyImg        from "src/utils/genDummyImg";
import FlexibleCell       from "src/views/timeline/flexibleCell";


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
        let isCached = this.props.cachedFrames.hasOwnProperty(i);
        let className = "timeline__time-controller__cell"
                      + (isCached? " cached" : "");
        cells.push(
          <FlexibleCell key={i} index={i} flexGrow={1}
                        className={className}
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
      Actions.play(false);
      Actions.updateCurrentFrame(index);
    };
  },

  _onMouseEnter(index) {
    return (e) => {
      e.stopPropagation();
      if (e.buttons % 2 === 1) {    // left button pressed
        Actions.play(false);
        Actions.updateCurrentFrame(index);
      }
    };
  },
});

export default React.createClass({
  propTypes() {
    return {
      composition: React.PropTypes.instanceOf(Composition).isRequired,
      cachedFrames: React.PropTypes.object.isRequired,
      currentFrame: React.PropTypes.number,
    }
  },

  render() {
    return (
      <div className="timeline__time-controller">
        <TimeControllerCells composition={this.props.composition}
                             currentFrame={this.props.currentFrame}
                             cachedFrames={this.props.cachedFrames} />
      </div>
    );
  },
});
