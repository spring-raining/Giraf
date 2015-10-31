"use strict";

import React                      from "react";
import KeyMirror                  from "keyMirror";
import _Array                     from "lodash/array";
import _Utility                   from "lodash/utility";

import Actions                    from "src/actions/actions";
import {Composition as ModelComp} from "src/stores/model/composition";
import {Layer as ModelLayer}      from "src/stores/model/layer";
import {LayerKinds}               from "src/stores/model/layer";
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
        entityStart:  this.props.layer.entityStart,
        entityEnd:    this.props.layer.entityEnd,
        layerStart:   this.props.layer.layerStart,
        layerEnd:     this.props.layer.layerEnd,
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

  getDragDiffOfFrames() {
    let startInfo = this.state.dragStartInfo;
    let dragInfo = this.state.dragInfo;
    return dragInfo.frame - startInfo.frame;
  },

  getDragDiffOfRelativeFrames() {
    let startInfo = this.state.dragStartInfo;
    let dragInfo = this.state.dragInfo;
    return Math.round((dragInfo.x - startInfo.x) / this.getCellWidth());
  },

  render() {
    let comp = this.props.composition;
    let layer = this.props.layer;
    let layerPos = this.state.layerPos;

    if (layer.getLayerKind() === LayerKinds.ANIMATED) {
      return (
        <div className="timeline__layer-timetable timeline__layer-flex animated"
             data-giraf-dragging={this.state.dragging}>
          <LayerTimetableArea className="timeline__layer-timetable__before pointer-disable"
                              flexGrow={layerPos.layerStart} />

          <div className="timeline__layer-timetable__layer-container timeline__layer-flex"
               style={{flexGrow: layerPos.layerEnd - layerPos.layerStart}}>
            <LayerTimetableArea className="timeline__layer-timetable__layer-before"
                                flexGrow={layerPos.entityStart - layerPos.layerStart}
                                onLeftDragStart={this._onDragStart(draggingTarget.LAYER_START)}
                                onLeftDrag={this._onDrag(draggingTarget.LAYER_START)}
                                onLeftDragEnd={this._onDragEnd(draggingTarget.LAYER_START)}
                                onBodyDragStart={this._onDragStart(draggingTarget.LAYER)}
                                onBodyDrag={this._onDrag(draggingTarget.LAYER)}
                                onBodyDragEnd={this._onDragEnd(draggingTarget.LAYER)} />

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
            </LayerTimetableArea>

            <LayerTimetableArea className="timeline__layer-timetable__layer-after"
                                flexGrow={layerPos.layerEnd - layerPos.entityEnd}
                                onRightDragStart={this._onDragStart(draggingTarget.LAYER_END)}
                                onRightDrag={this._onDrag(draggingTarget.LAYER_END)}
                                onRightDragEnd={this._onDragEnd(draggingTarget.LAYER_END)}
                                onBodyDragStart={this._onDragStart(draggingTarget.LAYER)}
                                onBodyDrag={this._onDrag(draggingTarget.LAYER)}
                                onBodyDragEnd={this._onDragEnd(draggingTarget.LAYER)} />
          </div>

          <LayerTimetableArea className="timeline__layer-timetable__after pointer-disable"
                              flexGrow={comp.frame - layerPos.layerEnd} />
        </div>
      );
    }
    else if (layer.getLayerKind() === LayerKinds.STILL) {
      return (
        <div className="timeline__layer-timetable timeline__layer-flex still"
             data-giraf-dragging={this.state.dragging}>
          <LayerTimetableArea className="timeline__layer-timetable__before pointer-disable"
                              flexGrow={layerPos.layerStart} />

          <LayerTimetableArea className="timeline__layer-timetable__entity"
                              flexGrow={layerPos.layerEnd - layerPos.layerStart}
                              onLeftDragStart={this._onDragStart(draggingTarget.LAYER_START)}
                              onLeftDrag={this._onDrag(draggingTarget.LAYER_START)}
                              onLeftDragEnd={this._onDragEnd(draggingTarget.LAYER_START)}
                              onBodyDragStart={this._onDragStart(draggingTarget.LAYER)}
                              onBodyDrag={this._onDrag(draggingTarget.LAYER)}
                              onBodyDragEnd={this._onDragEnd(draggingTarget.LAYER)}
                              onRightDragStart={this._onDragStart(draggingTarget.LAYER_END)}
                              onRightDrag={this._onDrag(draggingTarget.LAYER_END)}
                              onRightDragEnd={this._onDragEnd(draggingTarget.LAYER_END)}>
          </LayerTimetableArea>

          <LayerTimetableArea className="timeline__layer-timetable__after pointer-disable"
                              flexGrow={comp.frame - layerPos.layerEnd} />
        </div>
      );
    }
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

      const minmax = (min, max) => (x) => Math.max(min, Math.min(max, x));
      const comp = this.props.composition;
      const layer = this.props.layer;

      let layerPos = Object.assign({}, this.state.layerPos);
      let diff;
      let entityDiff;

      switch(target) {
        case draggingTarget.LAYER_START:
          diff = this.getDragDiffOfRelativeFrames();
          layerPos.layerStart = minmax(0, layer.layerEnd - 1)
                                      (layer.layerStart + diff);
          if (layer.getLayerKind() === LayerKinds.ANIMATED) {
            entityDiff = Math.max(0, layer.layerStart + diff - layer.entityStart);
            layerPos.entityStart  = Math.min(layer.entityStart + entityDiff, layer.layerEnd - 1);
            layerPos.entityEnd    = Math.min(layer.entityEnd + entityDiff,   layer.layerEnd);
          }
          else {
            layerPos.entityStart  = layerPos.layerStart;
          }
          break;
        case draggingTarget.LAYER:
          diff = minmax(-layer.layerStart, comp.frame - layer.layerEnd)
                       (this.getDragDiffOfFrames());
          layerPos.layerStart  = layer.layerStart + diff;
          layerPos.layerEnd    = layer.layerEnd + diff;
          layerPos.entityStart = layer.entityStart + diff;
          layerPos.entityEnd   = layer.entityEnd + diff;
          break;
        case draggingTarget.LAYER_END:
          diff = this.getDragDiffOfRelativeFrames();
          layerPos.layerEnd = minmax(layer.layerStart + 1, comp.frame)
                                    (layer.layerEnd + diff);

          if (layer.getLayerKind() === LayerKinds.ANIMATED) {
            entityDiff = Math.min(0, layer.layerEnd + diff - layer.entityEnd);
            layerPos.entityStart  = Math.max(layer.entityStart + entityDiff, layer.layerStart);
            layerPos.entityEnd    = Math.max(layer.entityEnd + entityDiff,   layer.layerStart + 1);
          }
          else {
            layerPos.entityEnd    = layerPos.layerEnd;
          }
          break;
        case draggingTarget.ENTITY_START:
          diff = this.getDragDiffOfRelativeFrames();
          layerPos.entityStart = minmax(layer.layerStart, layer.entityEnd - 1)
                                       (layer.entityStart + diff);
          break;
        case draggingTarget.ENTITY:
          diff = minmax(-layer.entityStart, comp.frame - layer.entityEnd)
                       (this.getDragDiffOfFrames());
          layerPos.layerStart  = Math.min(layer.layerStart, layer.entityStart + diff);
          layerPos.layerEnd    = Math.max(layer.layerEnd,   layer.entityEnd + diff);
          layerPos.entityStart = layer.entityStart + diff;
          layerPos.entityEnd   = layer.entityEnd + diff;
          break;
        case draggingTarget.ENTITY_END:
          diff = this.getDragDiffOfRelativeFrames();
          layerPos.entityEnd = minmax(layer.entityStart + 1, layer.layerEnd)
                                     (layer.entityEnd + diff);
          break;
      }
      //if (!(layerPos.layerStart <= layerPos.entityStart && layerPos.entityStart < layerPos.entityEnd && layerPos.entityEnd <= layerPos.layerEnd)) {
      //  console.warn(layerPos);
      //}

      this.setState({
        dragInfo: this.getPositionInfo(e),
        layerPos: layerPos,
      });
    }
  },

  _onDragEnd(target) {
    return (e) => {
      e.stopPropagation();

      const fill = (a, b) => _Utility.range(Math.min(a, b), Math.max(a, b));
      const layer = this.props.layer;
      const layerPos = this.state.layerPos;

      let changedFrames = null;
      switch (target) {
        case draggingTarget.LAYER_START:
          if (layerPos.layerStart !== layer.layerStart) {
            if (layer.getLayerKind() === LayerKinds.ANIMATED
            &&  layerPos.entityStart !== layer.entityStart) {
              changedFrames = fill(layer.layerStart, layer.layerEnd);
            }
            else {
              changedFrames = fill(layerPos.layerStart, layer.layerStart);
            }
          }
          break;
        case draggingTarget.LAYER:
          if (layerPos.layerStart !== layer.layerStart) {
            changedFrames = _Array.union(
              fill(layer.layerStart,    layer.layerEnd),
              fill(layerPos.layerStart, layerPos.layerEnd));
          }
          break;
        case draggingTarget.LAYER_END:
          if (layerPos.layerEnd !== layer.layerEnd) {
            if (layer.getLayerKind() === LayerKinds.ANIMATED
            &&  layerPos.entityEnd !== layer.entityEnd) {
              changedFrames = fill(layer.layerStart, layer.layerEnd);
            }
            else {
              changedFrames = fill(layerPos.layerEnd, layer.layerEnd);
            }
          }
          break;
        case draggingTarget.ENTITY_START:
          if (layerPos.entityStart !== layer.entityStart) {
            changedFrames = fill(layerPos.layerStart, layerPos.layerEnd);
          }
          break;
        case draggingTarget.ENTITY:
          if (layerPos.entityStart !== layer.entityEnd) {
            changedFrames = fill(layerPos.layerStart, layerPos.layerEnd);
          }
          break;
        case draggingTarget.ENTITY_END:
          if (layerPos.entityEnd !== layer.entityEnd) {
            changedFrames = fill(layerPos.layerStart, layerPos.layerEnd);
          }
          break;
      }
      if (changedFrames) {
        Actions.clearFrameCache(this.props.composition, changedFrames);
      }

      layer.update({
        layerStart:   layerPos.layerStart,
        layerEnd:     layerPos.layerEnd,
        entityStart:  layerPos.entityStart,
        entityEnd:    layerPos.entityEnd,
      }, false);
      Actions.updateLayer(layer, false);
      this.setState({
        dragging: null,
        dragStartInfo: null,
        dragInfo: null,
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
