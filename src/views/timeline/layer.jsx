"use strict";

import React                      from "react";
import ReactDOM                   from "react-dom";
import KeyMirror                  from "keyMirror";
import _Array                     from "lodash/array";
import _Utility                   from "lodash/utility";
import _Object                    from "lodash/object";
import UAParser                   from "ua-parser-js";

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

const userAgent = new UAParser();

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
    if (this.props.flexGrow <= 0) {
      return null;
    }

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
      tmpLayerPos: null,
    }
  },

  getCellWidth() {
    return ReactDOM.findDOMNode(this).clientWidth / this.props.composition.frame
  },

  getPositionInfo(e) {
    let DOMNode   = ReactDOM.findDOMNode(this);
    let bcr       = DOMNode.getBoundingClientRect();
    let maxWidth  = DOMNode.clientWidth;
    let maxHeight = DOMNode.clientHeight;
    return {
      x:     Math.max(0, Math.min(maxWidth, e.clientX - bcr.left)),
      y:     Math.max(0, Math.min(maxHeight, e.clientY - bcr.top)),
      frame: Math.max(0, Math.min(this.props.composition.frame,
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
    const comp = this.props.composition;
    const layer = this.props.layer;
    const layerPos = (this.state.dragging)? this.state.tmpLayerPos
      : {
        entityStart:  layer.entityStart,
        entityEnd:    layer.entityEnd,
        layerStart:   layer.layerStart,
        layerEnd:     layer.layerEnd,
      };
    const className = "timeline__layer-timetable timeline__layer-flex"
      + (layer.getLayerKind() === LayerKinds.ANIMATED? " animated" : "")
      + (layer.getLayerKind() === LayerKinds.STILL? " still" : "");

    const floor = (x) => Math.min(x, comp.frame);
    const flex = [
      (layer.repeatBefore)
        ? floor(layerPos.layerStart)
        : floor(layerPos.entityStart),
      (layer.repeatBefore)
        ? floor(layerPos.entityStart) - floor(layerPos.layerStart)
        : 0,
      floor(layerPos.entityEnd) - floor(layerPos.entityStart),
      (layer.repeatAfter)
        ? floor(layerPos.layerEnd) - floor(layerPos.entityEnd)
        : 0,
      (layer.repeatAfter)
        ? comp.frame - floor(layerPos.layerEnd)
        : comp.frame - floor(layerPos.entityEnd),
    ];

    const cancelEvent = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };

    const layerBefore = (!layer.repeatBefore)? null
      : <LayerTimetableArea className="timeline__layer-timetable__layer-before"
                            flexGrow={flex[1]}
                            onLeftDragStart={this._onDragStart(draggingTarget.LAYER_START)}
                            onLeftDrag={this._onDrag(draggingTarget.LAYER_START)}
                            onLeftDragEnd={this._onDragEnd(draggingTarget.LAYER_START)}
                            onBodyDragStart={this._onDragStart(draggingTarget.LAYER)}
                            onBodyDrag={this._onDrag(draggingTarget.LAYER)}
                            onBodyDragEnd={this._onDragEnd(draggingTarget.LAYER)} />;

    const layerAfter = (!layer.repeatAfter)? null
      : <LayerTimetableArea className="timeline__layer-timetable__layer-after"
                            flexGrow={flex[3]}
                            onRightDragStart={this._onDragStart(draggingTarget.LAYER_END)}
                            onRightDrag={this._onDrag(draggingTarget.LAYER_END)}
                            onRightDragEnd={this._onDragEnd(draggingTarget.LAYER_END)}
                            onBodyDragStart={this._onDragStart(draggingTarget.LAYER)}
                            onBodyDrag={this._onDrag(draggingTarget.LAYER)}
                            onBodyDragEnd={this._onDragEnd(draggingTarget.LAYER)} />;

    const repeatBeforeButton = (layer.getLayerKind() !== LayerKinds.ANIMATED)? null
      : <button className="lsf-icon timeline__layer-timetable__repeat-before-button"
                title={layer.repeatBefore? "right" : "left"}
                draggable="true"
                onDragStart={cancelEvent}
                onDrag={cancelEvent}
                onDragEnd={cancelEvent}
                onClick={this._onRepeatBeforeButtonClick}>
        </button>;

    const repeatAfterButton = (layer.getLayerKind() !== LayerKinds.ANIMATED)? null
      : <button className="lsf-icon timeline__layer-timetable__repeat-after-button"
                title={layer.repeatAfter? "left" : "right"}
                draggable="true"
                onDragStart={cancelEvent}
                onDrag={cancelEvent}
                onDragEnd={cancelEvent}
                onClick={this._onRepeatAfterButtonClick}>
        </button>;

    return (
      <div className={className}
           data-giraf-dragging={this.state.dragging}>
        <LayerTimetableArea className="timeline__layer-timetable__before pointer-disable"
                            flexGrow={flex[0]} />
        <div className="timeline__layer-timetable__layer-container timeline__layer-flex"
             style={{flexGrow: flex[1] + flex[2] + flex[3]}}>
          {layerBefore}
          <LayerTimetableArea className="timeline__layer-timetable__entity"
                              flexGrow={flex[2]}
                              onLeftDragStart={this._onDragStart(draggingTarget.ENTITY_START)}
                              onLeftDrag={this._onDrag(draggingTarget.ENTITY_START)}
                              onLeftDragEnd={this._onDragEnd(draggingTarget.ENTITY_START)}
                              onBodyDragStart={this._onDragStart(draggingTarget.ENTITY)}
                              onBodyDrag={this._onDrag(draggingTarget.ENTITY)}
                              onBodyDragEnd={this._onDragEnd(draggingTarget.ENTITY)}
                              onRightDragStart={this._onDragStart(draggingTarget.ENTITY_END)}
                              onRightDrag={this._onDrag(draggingTarget.ENTITY_END)}
                              onRightDragEnd={this._onDragEnd(draggingTarget.ENTITY_END)}>
            {repeatBeforeButton}
            {repeatAfterButton}
          </LayerTimetableArea>
          {layerAfter}
        </div>

        <LayerTimetableArea className="timeline__layer-timetable__after pointer-disable"
                            flexGrow={flex[4]} />
      </div>
    );
  },

  _mouseMoveOnFirefox: null,
  _mouseUpOnFirefox: null,

  _onDragStart(target) {
    return (e) => {
      e.stopPropagation();

      // On Firefox, 'onDrag' and 'onDragEnd' won't fire.
      // https://bugzilla.mozilla.org/show_bug.cgi?id=505521
      if (userAgent.getBrowser().name === "Firefox") {
        this._mouseMoveOnFirefox = this._onDrag(target);
        this._mouseUpOnFirefox   = this._onDragEnd(target);
        e.target.setCapture();
        e.target.addEventListener("mousemove", this._mouseMoveOnFirefox, false);
        e.target.addEventListener("mouseup", this._mouseUpOnFirefox, false);
      }

      let pos = this.getPositionInfo(e);
      e.dataTransfer.setDragImage(GenDummyImg(), 0, 0);
      this.setState({
        dragging: target,
        dragStartInfo: pos,
        dragInfo: pos,
        tmpLayerPos: {
          entityStart:  this.props.layer.entityStart,
          entityEnd:    this.props.layer.entityEnd,
          layerStart:   this.props.layer.layerStart,
          layerEnd:     this.props.layer.layerEnd,
        },
      });
    }
  },

  _onDrag(target) {
    return (e) => {
      e.stopPropagation();

      const minmax = (min, max) => (x) => Math.max(min, Math.min(max, x));
      const comp = this.props.composition;
      const layer = this.props.layer;

      let layerPos = Object.assign({}, this.state.tmpLayerPos);
      let diff;

      switch(target) {
        case draggingTarget.LAYER_START:
          diff = this.getDragDiffOfRelativeFrames();
          layerPos.layerStart = minmax(0, layer.entityStart - 1)
                                      (layer.layerStart + diff);
          break;
        case draggingTarget.LAYER:
          diff = minmax(
            (layer.repeatBefore? -layer.layerStart : -layer.entityStart),
            comp.frame - (layer.repeatAfter? layer.layerEnd : layer.entityEnd)
          )(this.getDragDiffOfFrames());
          if (layer.repeatBefore) {
            layerPos.layerStart = layer.layerStart + diff;
          }
          if (layer.repeatAfter) {
            layerPos.layerEnd = layer.layerEnd + diff;
          }
          layerPos.entityStart = layer.entityStart + diff;
          layerPos.entityEnd = layer.entityEnd + diff;
          break;
        case draggingTarget.LAYER_END:
          diff = this.getDragDiffOfRelativeFrames();
          layerPos.layerEnd = minmax(layer.entityEnd + 1, comp.frame)
                                    (layer.layerEnd + diff);
          break;
        case draggingTarget.ENTITY_START:
          diff = this.getDragDiffOfRelativeFrames();
          if (layer.repeatBefore) {
            layerPos.entityStart = minmax(layer.layerStart + 1, layer.entityEnd - 1)
                                         (layer.entityStart + diff);
          }
          else {
            layerPos.entityStart = minmax(0, layer.entityEnd - 1)
                                        (layer.entityStart + diff);
          }
          break;
        case draggingTarget.ENTITY:
          diff = minmax(-layer.entityStart, comp.frame - layer.entityEnd)
                       (this.getDragDiffOfFrames());
          if (layer.repeatBefore) {
            layerPos.layerStart = Math.min(layer.layerStart, layer.entityStart + diff);
          }
          if (layer.repeatAfter) {
            layerPos.layerEnd = Math.max(layer.layerEnd, layer.entityEnd + diff);
          }
          layerPos.entityStart = layer.entityStart + diff;
          layerPos.entityEnd = layer.entityEnd + diff;
          break;
        case draggingTarget.ENTITY_END:
          diff = this.getDragDiffOfRelativeFrames();
          if (layer.repeatAfter) {
            layerPos.entityEnd = minmax(layer.entityStart + 1, layer.layerEnd - 1)
                                       (layer.entityEnd + diff);
          }
          else {
            layerPos.entityEnd = minmax(layer.entityStart + 1, comp.frame)
                                       (layer.entityEnd + diff);
          }
          break;
      }

      this.setState({
        dragInfo: this.getPositionInfo(e),
        tmpLayerPos: layerPos,
      });
    }
  },

  _onDragEnd(target) {
    return (e) => {
      e.stopPropagation();

      const fill = (a, b) => _Utility.range(Math.min(a, b), Math.max(a, b));
      const layer = this.props.layer;
      const layerPos = this.state.tmpLayerPos;

      if (userAgent.getBrowser().name === "Firefox") {
        e.target.removeEventListener("mousemove", this._mouseMoveOnFirefox, false);
        e.target.removeEventListener("mouseup", this._mouseUpOnFirefox, false);
        this._mouseMoveOnFirefox = null;
        this._mouseUpOnFirefox   = null;
      }

      let changedFrames = null;
      const layeredFrames = _Array.union(
        fill(
          layer.repeatBefore? layer.layerStart : layer.entityStart,
          layer.repeatAfter?  layer.layerEnd   : layer.entityEnd),
        fill(
          layer.repeatBefore? layerPos.layerStart : layerPos.entityStart,
          layer.repeatAfter?  layerPos.layerEnd   : layerPos.entityEnd));

      switch (target) {
        case draggingTarget.LAYER_START:
          if (layerPos.layerStart !== layer.layerStart) {
            changedFrames = fill(layerPos.layerStart, layer.layerStart);
          }
          break;
        case draggingTarget.LAYER:
          if (layerPos.entityStart !== layer.entityStart) {
            changedFrames = layeredFrames;
          }
          break;
        case draggingTarget.LAYER_END:
          if (layerPos.layerEnd !== layer.layerEnd) {
            changedFrames = fill(layerPos.layerEnd, layer.layerEnd);
          }
          break;
        case draggingTarget.ENTITY_START:
          if (layerPos.entityStart !== layer.entityStart) {
            changedFrames = layeredFrames;
          }
          break;
        case draggingTarget.ENTITY:
          if (layerPos.entityStart !== layer.entityStart) {
            changedFrames = layeredFrames;
          }
          break;
        case draggingTarget.ENTITY_END:
          if (layerPos.entityEnd !== layer.entityEnd) {
            changedFrames = layeredFrames;
          }
          break;
      }
      if (changedFrames) {
        Actions.clearFrameCache(this.props.composition, changedFrames);
      }

      let sourceStart = layer.sourceStart;
      let sourceEnd = layer.sourceEnd;
      if (layer.entity && target === draggingTarget.ENTITY_START) {
        sourceStart = layer.sourceEnd - (layer.sourceEnd - layer.sourceStart)
                      * (layer.entityEnd - layerPos.entityStart) / (layer.entityEnd - layer.entityStart);
      }
      else if (layer.entity && target === draggingTarget.ENTITY_END) {
        sourceEnd = layer.sourceStart + (layer.sourceEnd - layer.sourceStart)
                    * (layerPos.entityEnd - layer.entityStart) / (layer.entityEnd - layer.entityStart);
      }
      layer.update({
        layerStart:   layerPos.layerStart,
        layerEnd:     layerPos.layerEnd,
        entityStart:  layerPos.entityStart,
        entityEnd:    layerPos.entityEnd,
        sourceStart:  sourceStart,
        sourceEnd:    sourceEnd,
      }, false);
      Actions.updateLayer(layer, false);
      this.setState({
        dragging: null,
        dragStartInfo: null,
        dragInfo: null,
        tmpLayerPos: null,
      });
    }
  },

  _onRepeatBeforeButtonClick() {
    const layer = this.props.layer;
    const layerStart = (layer.layerStart < layer.entityStart)
      ? layer.layerStart
      : Math.min(0, layer.entityStart);

    Actions.clearFrameCache(this.props.composition,
      _Utility.range(layerStart, layer.entityStart));
    layer.update({
      repeatBefore: !layer.repeatBefore,
      layerStart: layerStart,
    }, false);
    Actions.updateLayer(layer, false);
  },

  _onRepeatAfterButtonClick() {
    const layer = this.props.layer;
    const layerEnd = (layer.layerEnd > layer.entityEnd)
      ? layer.layerEnd
      : Math.max(this.props.composition.frame, layer.entityEnd);

    Actions.clearFrameCache(this.props.composition,
      _Utility.range(layer.entityEnd, layerEnd));
    layer.update({
      repeatAfter: !layer.repeatAfter,
      layerEnd: layerEnd,
    }, false);
    Actions.updateLayer(layer, false);
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
    const layer = this.props.layer;

    for (var i=0; i < this.props.composition.frame; i++) {
      cells.push(<FlexibleCell key={i} index={i} flexGlow={1}
                               className="timeline__layer-cell" />);
    }

    const className = "timeline__layer"
      + (this.props.isEdited? " edited" : "")
      + (layer.entity? " " + layer.entity.getClassName() : "");

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

  _onClick(e) {
    this.props.onClick(this.props.layer)(e);
  },
});
