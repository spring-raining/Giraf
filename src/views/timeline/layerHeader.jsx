"use strict";

import React                      from "react";

import Actions                    from "src/actions/actions";
import {Composition as ModelComp} from "src/stores/model/composition";
import {Layer as ModelLayer}      from "src/stores/model/layer";


export default React.createClass({
  propTypes() {
    return {
      composition: React.PropTypes.instanceOf(ModelComp).isRequired,
      layer: React.PropTypes.instanceOf(ModelLayer).isRequired,
    };
  },

  render() {
    let comp = this.props.composition;
    let layer = this.props.layer;

    return (
      <div className="timeline__layer-header" draggable="true"
           onDragStart={this._onDragStart}
           onDragEnd={this._onDragEnd}>
        <span className="timeline__layer-header__name">{layer.name}</span>
      </div>
    );
  },

  _onDragStart() {
    Actions.startDrag(this.props.layer);
  },

  _onDragEnd() {
    Actions.endDrag(this.props.layer);
  },
});
