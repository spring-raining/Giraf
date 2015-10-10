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
      onDragStart: React.PropTypes.func.isRequired,
      onDragEnter: React.PropTypes.func.isRequired,
      onDragEnd: React.PropTypes.func.isRequired,
    };
  },

  render() {
    let comp = this.props.composition;
    let layer = this.props.layer;

    return (
      <div className="timeline__layer-header" draggable="true"
           onDragStart={this._onDragStart}
           onDragEnter={this._onDragEnter}
           onDragEnd={this._onDragEnd}>
        <span className="timeline__layer-header__name">{layer.name}</span>
      </div>
    );
  },

  _onDragStart(e) {
    e.stopPropagation();
    this.props.onDragStart(this.props.layer, this)(e);
  },

  _onDragEnter(e) {
    e.stopPropagation();
    this.props.onDragEnter(this.props.layer, this)(e);
  },

  _onDragEnd(e) {
    e.stopPropagation();
    this.props.onDragEnd(this.props.layer, this)(e);
  },
});
