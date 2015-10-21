"use strict";

import React                      from "react";
import KeyMirror                  from "keyMirror";

import Actions                    from "src/actions/actions";
import {Composition as ModelComp} from "src/stores/model/composition";
import {Layer as ModelLayer}      from "src/stores/model/layer";
import GenDummyImg                from "src/utils/genDummyImg";
import FlexibleCell               from "src/views/timeline/flexibleCell";


const draggingTarget = KeyMirror({
  ENTITY: null,
  ENTITY_START: null,
  ENTITY_END: null,
});

var LayerTimetable = React.createClass({
  propTypes() {
    return {
      composition: React.Proptypes.instanceOf(ModelComp).isRequired,
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
        <div className="timeline__layer-timetable__before"
             style={{flexGrow: layerPos.entityStart}}>
        </div>

        <div className="timeline__layer-timetable__entity"
             style={{flexGrow: layerPos.entityEnd - layerPos.entityStart}}
             draggable="true"
             onDragStart={this._onDragStart(draggingTarget.ENTITY)}
             onDrag={this._onDrag(draggingTarget.ENTITY)}
             onDragEnd={this._onDragEnd(draggingTarget.ENTITY)}>
          {layer.layerStart} - {layer.layerEnd}
          <div className="timeline__layer-timetable__entity__start"
               draggable="true"
               onDragStart={this._onDragStart(draggingTarget.ENTITY_START)}
               onDrag={this._onDrag(draggingTarget.ENTITY_START)}
               onDragEnd={this._onDragEnd(draggingTarget.ENTITY_START)}></div>
          <div className="timeline__layer-timetable__entity__end"
               draggable="true"
               onDragStart={this._onDragStart(draggingTarget.ENTITY_END)}
               onDrag={this._onDrag(draggingTarget.ENTITY_END)}
               onDragEnd={this._onDragEnd(draggingTarget.ENTITY_END)}></div>
        </div>

        <div className="timeline__layer-timetable__after"
             style={{flexGrow: comp.frame - layerPos.entityEnd}}>
        </div>
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
      var i;
      let fill = (a, b) => {
        let arr = [];
        for (var i = Math.min(a, b); i < Math.max(a, b); i++) {
          arr.push(i);
        }
        return arr;
      };

      if (target === draggingTarget.ENTITY) {
        let diff = this.getEntityDragDiff();
        if (diff !== 0) {
          let changedFrames = fill(Math.min(layer.layerStart, layer.layerStart + diff),
                                   Math.max(layer.layerEnd,   layer.layerEnd + diff));
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
