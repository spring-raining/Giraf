"use strict";

import React                      from "react";
import KeyMirror                  from "keyMirror";
import _Array                     from "lodash/array";
import _Utility                   from "lodash/utility";

import Actions                    from "src/actions/actions";
import {Composition as ModelComp} from "src/stores/model/composition";
import {Layer as ModelLayer}      from "src/stores/model/layer";
import GenDummyImg                from "src/utils/genDummyImg";
import FlexibleCell               from "src/views/timeline/flexibleCell";


const draggingTarget = KeyMirror({
  ENTITY: null,
  ENTITY_START: null,
  ENTITY_END: null,
  LAYER: null,
  LAYER_START: null,
  LAYER_END: null,
});

var LayerTimetableArea = React.createClass({
  propTypes() {
    return  {
      flexGrow:         React.PropTypes.number.isRequired,
      className:        React.PropTypes.string,
      onLeftDragStart:  React.PropTypes.func,
      onLeftDrag:       React.PropTypes.func,
      onLeftDragEnd:    React.PropTypes.func,
      onBodyDragStart:  React.PropTypes.func,
      onBodyDrag:       React.PropTypes.func,
      onBodyDragEnd:    React.PropTypes.func,
      onRightDragStart: React.PropTypes.func,
      onRightDrag:      React.PropTypes.func,
      onRightDragEnd:   React.PropTypes.func,
    }
  },

  render() {
    let className = "timeline__layer-timetable-area " + this.props.className;
    let isBodyDraggable = this.props.onBodyDragStart
                       || this.props.onBodyDrag
                       || this.props.onBodyDragEnd;
    let leftHandle = null;
    let rightHandle = null;

    if (this.props.onLeftDragStart
    ||  this.props.onLeftDrag
    ||  this.props.onLeftDragEnd) {
      leftHandle = (
        <div className="timeline__layer-timetable-area__left-handle"
             draggable="true"
             onDragStart={this.props.onLeftDragStart}
             onDrag={this.props.onLeftDrag}
             onDragEnd={this.props.onLeftDragEnd}>
        </div>
      );
    }

    if (this.props.onRightDragStart
    ||  this.props.onRightDrag
    ||  this.props.onRightDragEnd) {
      rightHandle = (
        <div className="timeline__layer-timetable-area__right-handle"
             draggable="true"
             onDragStart={this.props.onRightDragStart}
             onDrag={this.props.onRightDrag}
             onDragEnd={this.props.onRightDragEnd}>
        </div>
      );
    }

    return (
      <div className={className}
           style={{flexGrow: this.props.flexGrow}}
           draggable={isBodyDraggable}
           onDragStart={this.props.onBodyDragStart}
           onDrag={this.props.onBodyDrag}
           onDragEnd={this.props.onBodyDragEnd}>
        {this.props.children}
        {leftHandle}
        {rightHandle}
      </div>
    );
  },
});

var LayerTimetable = React.createClass({
  propTypes() {
    return {
      composition: React.PropTypes.instanceOf(ModelComp).isRequired,
      layer: React.PropTypes.instanceOf(ModelLayer).isRequired,
    }
  },

  getInitialState() {
    return {
      dragging: null,
      dragStartInfo: null,
      dragInfo: null,
      layerPos: {
        entityStart: this.props.layer.entityStart,
        entityEnd: this.props.layer.entityEnd,
      }
    }
  },

  getCellWidth() {
    return this.getDOMNode().clientWidth / this.props.composition.frame
  },

  getPositionInfo(e) {
    let DOMNode   = this.getDOMNode();
    let bcr       = DOMNode.getBoundingClientRect();
    let maxWidth  = DOMNode.clientWidth;
    let maxHeight = DOMNode.clientHeight;
    return {
      x:     Math.max(0, Math.min(maxWidth, e.clientX - bcr.left)),
      y:     Math.max(0, Math.min(maxHeight, e.clientY - bcr.top)),
      frame: Math.max(0, Math.min(this.props.composition.frame - 1,
                                  Math.floor((e.clientX - bcr.left) / this.getCellWidth())))
    }
  },

  getEntityDragDiff() {
    let comp = this.props.composition;
    let layer = this.props.layer;
    let startInfo = this.state.dragStartInfo;
    let dragInfo = this.state.dragInfo;
    return Math.min(comp.frame - layer.entityEnd,
           Math.max(-layer.entityStart,
           dragInfo.frame - startInfo.frame));
  },

  getEntityStartDragDiff() {
    let comp = this.props.composition;
    let layer = this.props.layer;
    let startInfo = this.state.dragStartInfo;
    let dragInfo = this.state.dragInfo;
    return Math.min(layer.entityEnd - layer.entityStart - 1,
           Math.max(-layer.entityStart,
           Math.round((dragInfo.x - startInfo.x) / this.getCellWidth())));
  },

  getEntityEndDragDiff() {
    let comp = this.props.composition;
    let layer = this.props.layer;
    let startInfo = this.state.dragStartInfo;
    let dragInfo = this.state.dragInfo;
    return Math.min(comp.frame - layer.entityEnd,
           Math.max(layer.entityStart - layer.entityEnd + 1,
           Math.round((dragInfo.x - startInfo.x) / this.getCellWidth())));
  },

  render() {
    let comp = this.props.composition;
    let layer = this.props.layer;
    let layerPos = this.state.layerPos;

    return (
      <div className="timeline__layer-timetable timeline__layer-flex"
           data-giraf-dragging={this.state.dragging}>
        <LayerTimetableArea className="timeline__layer-timetable__before pointer-disable"
                            flexGrow={layerPos.entityStart} />

        <LayerTimetableArea className="timeline__layer-timetable__entity"
                            flexGrow={layerPos.entityEnd - layerPos.entityStart}
                            onLeftDragStart={this._onDragStart(draggingTarget.ENTITY_START)}
                            onLeftDrag={this._onDrag(draggingTarget.ENTITY_START)}
                            onLeftDragEnd={this._onDragEnd(draggingTarget.ENTITY_START)}
                            onBodyDragStart={this._onDragStart(draggingTarget.ENTITY)}
                            onBodyDrag={this._onDrag(draggingTarget.ENTITY)}
                            onBodyDragEnd={this._onDragEnd(draggingTarget.ENTITY)}
                            onRightDragStart={this._onDragStart(draggingTarget.ENTITY_END)}
                            onRightDrag={this._onDrag(draggingTarget.ENTITY_END)}
                            onRightDragEnd={this._onDragEnd(draggingTarget.ENTITY_END)}>
          {layer.layerStart} - {layer.layerEnd}
        </LayerTimetableArea>

        <LayerTimetableArea className="timeline__layer-timetable__after pointer-disable"
                            flexGrow={comp.frame - layerPos.entityEnd} />
      </div>
    );
  },

  _onDragStart(target) {
    return (e) => {
      e.stopPropagation();
      let pos = this.getPositionInfo(e);
      e.dataTransfer.setDragImage(GenDummyImg(), 0, 0);
      this.setState({
        dragging: target,
        dragStartInfo: pos,
        dragInfo: pos,
      });
    }
  },

  _onDrag(target) {
    return (e) => {
      e.stopPropagation();

      let layer = this.props.layer;
      let layerPos =
        (this.state.dragging === draggingTarget.ENTITY)? {
          entityStart: layer.entityStart + this.getEntityDragDiff(),
          entityEnd: layer.entityEnd + this.getEntityDragDiff(),
        } : (this.state.dragging === draggingTarget.ENTITY_START)? {
          entityStart: layer.entityStart + this.getEntityStartDragDiff(),
          entityEnd: layer.entityEnd,
        } : (this.state.dragging === draggingTarget.ENTITY_END)? {
          entityStart: layer.entityStart,
          entityEnd: layer.entityEnd + this.getEntityEndDragDiff(),
        } : {
          entityStart: layer.entityStart,
          entityEnd: layer.entityEnd,
        };
      this.setState({
        dragInfo: this.getPositionInfo(e),
        layerPos: layerPos,
      });
    }
  },

  _onDragEnd(target) {
    return (e) => {
      e.stopPropagation();
      let layer = this.props.layer;
      let fill = (a, b) => _Utility.range(Math.min(a, b), Math.max(a, b));

      if (target === draggingTarget.ENTITY) {
        let diff = this.getEntityDragDiff();
        if (diff !== 0) {
          let changedFrames = _Array.union(
            fill(layer.layerStart,        layer.layerEnd),
            fill(layer.layerStart + diff, layer.layerEnd + diff));
          Actions.clearFrameCache(this.props.composition, changedFrames);
        }
        layer.update({
          layerStart:   layer.layerStart + diff,
          entityStart:  layer.entityStart + diff,
          layerEnd:     layer.layerEnd + diff,
          entityEnd:    layer.entityEnd + diff,
        });
      }
      else if (target === draggingTarget.ENTITY_START) {
        let diff = this.getEntityStartDragDiff();
        if (diff !== 0) {
          let changedFrames = fill(layer.layerStart, layer.layerStart + diff);
          Actions.clearFrameCache(this.props.composition, changedFrames);
        }
        layer.update({
          layerStart:   layer.layerStart + diff,
          entityStart:  layer.entityStart + diff,
        });
      }
      else if (target === draggingTarget.ENTITY_END) {
        let diff = this.getEntityEndDragDiff();
        if (diff !== 0) {
          let changedFrames = fill(layer.layerEnd, layer.layerEnd + diff);
          Actions.clearFrameCache(this.props.composition, changedFrames);
        }
        layer.update({
          layerEnd:   layer.layerEnd + diff,
          entityEnd:  layer.entityEnd + diff,
        })
      }

      this.setState({
        dragging: null,
        dragStartInfo: null,
        dragInfo: null,
        layerPos: {
          entityStart: this.props.layer.entityStart,
          entityEnd: this.props.layer.entityEnd,
        }
      });
    }
  },
});

export default React.createClass({
  propTypes() {
    return {
      composition: React.PropTypes.instanceOf(ModelComp).isRequired,
      layer: React.PropTypes.instanceOf(ModelLayer).isRequired,
      onClick: React.PropTypes.func.isRequired,
      isEdited: React.PropTypes.boolean.isRequired,
    };
  },

  getInitialState() {
    return {
      isEntityDragging: false,
    }
  },

  render() {
    let cells = [];
    for (var i=0; i < this.props.composition.frame; i++) {
      cells.push(<FlexibleCell key={i} index={i} flexGlow={1}
                               className="timeline__layer-cell" />);
    }

    let className = "timeline__layer"
                  + (this.props.isEdited? " edited" : "");

    return (
      <div className={className}
           onClick={this._onClick}>
        <div className="timeline__layer-flex-container">
          <div className="timeline__layer-flex">
            {cells}
          </div>
        </div>
        <div className="timeline__layer-flex-container">
          <LayerTimetable layer={this.props.layer}
                          composition={this.props.composition} />
        </div>
      </div>
    );
  },

  _onClick() {
    this.props.onClick(this.props.layer);
  },
});
