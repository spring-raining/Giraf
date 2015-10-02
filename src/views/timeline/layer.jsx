import React from "react";
import KeyMirror from "keyMirror";

import ModelComp from "../../stores/model/composition";
import ModelLayer from "../../stores/model/layer";
import FlexibleCell from "./flexibleCell";
import GenDummyImg from "../../utils/genDummyImg";


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
      if (target === draggingTarget.ENTITY) {
        layer.update({
          layerStart: layer.layerStart + this.getEntityDragDiff(),
          entityStart: layer.entityStart + this.getEntityDragDiff(),
          layerEnd: layer.layerEnd + this.getEntityDragDiff(),
          entityEnd: layer.entityEnd + this.getEntityDragDiff(),
        });
      }
      else if (target === draggingTarget.ENTITY_START) {
        layer.update({
          layerStart: layer.layerStart + this.getEntityStartDragDiff(),
          entityStart: layer.entityStart + this.getEntityStartDragDiff(),
        })
      }
      else if (target === draggingTarget.ENTITY_END) {
        layer.update({
          layerEnd: layer.layerEnd + this.getEntityEndDragDiff(),
          entityEnd: layer.entityEnd + this.getEntityEndDragDiff(),
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

    return <div className="timeline__layer">
      <div className="timeline__layer-flex-container">
        <div className="timeline__layer-flex">
          {cells}
        </div>
      </div>
      <div className="timeline__layer-flex-container">
        <LayerTimetable layer={this.props.layer}
                        composition={this.props.composition} />
      </div>
    </div>;
  },
});
