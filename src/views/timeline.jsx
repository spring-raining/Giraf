"use strict";

import React from "react";

import Actions                        from "src/actions/actions";
import {Composition}                  from "src/stores/model/composition";
import {DragAction, DragActionType}   from "src/stores/model/dragAction";
import Summary                        from "src/views/timeline/summary";
import Layer                          from "src/views/timeline/layer";
import LayerHeader                    from "src/views/timeline/layerHeader";
import TimeController                 from "src/views/timeline/timeController";
import TimetableOverlay               from "src/views/timeline/timetableOverlay"
import genDummyImg                    from "src/utils/genDummyImg";


var ZOOM_RATIO = 0.01;

var Timeline = React.createClass({
  getInitialState() {
    return {
      timetableWidth: 1000,
      scrollTop: 0,
      scrollLeft: 0,
      dragSemaphore: 0, // become 1 or more when onDragOver
      layers: null,
      draggingLayer: null,
      executingAutoRender: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    let comp = nextProps.store.editingComposition;
    this.setState({
      layers: (comp)? comp.layers : null,
    });
  },

  componentDidUpdate(prevProps, prevState) {
    var _;
    this.timetableDOM = (_ = this.refs.timetable)? _.getDOMNode() : null;
    this.headerDOM    = (_ = this.refs.header)? _.getDOMNode() : null;
    this.leftDOM      = (_ = this.refs.left)? _.getDOMNode() : null;

    let comp = this.props.store.editingComposition;
    let currentFrame = this.props.store.currentFrame;
    if (comp != null) {
      // start auto render
      if (this.props.store.selectingItem.id === comp.id
      &&  this.props.store.playing
      &&  !prevProps.store.palying
      &&  !this.state.executingAutoRender) {
        this.setState({
          executingAutoRender: true,
        });
        Actions.renderFrameAutomatically(comp);
      }

      // render current frame
      else if (!this.props.store.playing && currentFrame !== null) {
        this._createFrameCache(comp, currentFrame);
      }
    }

    // end auto render
    if (!this.props.store.playing && prevProps.store.playing) {
      this.setState({
        executingAutoRender: false,
      });
    }
  },

  _createFrameCache(composition, frame) {
    let frameCache = this.props.store.compositionFrameCache[composition.id];
    if (!frameCache || !frameCache[frame]) {
      Actions.renderFrame(composition, frame);
    }
  },

  render() {
    let store = this.props.store;
    let comp = store.editingComposition;

    if (comp) {
      let summary = <Summary composition={comp} />;
      let layers = this.state.layers.map((e) =>
        <Layer composition={comp} layer={e} key={e.id} />
      );
      let layerHeaders = this.state.layers.map((e) =>
        <LayerHeader composition={comp} layer={e} key={e.id}
                     onDragStart={this._onLayerHeaderDragStart}
                     onDragEnter={this._onLayerHeaderDragEnter}
                     onDragEnd={this._onLayerHeaderDragEnd} />
      );

      return (
        <section className="timeline panel"
                 onDragEnter={this._onDragEnter}
                 onDragOver={this._onDragOver}
                 onDragLeave={this._onDragLeave}
                 onDrop={this._onDrop}>
          <div className="timeline__summary">
            {summary}
          </div>
          <div className="timeline__header-container scroll-area"
               ref="header"
               onWheel={this._onWheel("header")}>
            <div className="timeline__header" style={{width: this.state.timetableWidth + "px"}}>
              <TimeController composition={comp}
                              currentFrame={store.currentFrame} />
            </div>
          </div>
          <div className="timeline__left-container scroll-area"
               ref="left"
               onWheel={this._onWheel("left")}>
            <div className="timeline__left">
              {layerHeaders}
              <button onClick={this._onCreateLayerButtonClicked}>Create Layer</button>
            </div>
          </div>
          <div className="timeline__timetable-container scroll-area"
               ref="timetable"
               onWheel={this._onWheel("timetable")}>
            <div className="timeline__timetable" style={{width: this.state.timetableWidth + "px"}}>
              {layers}
              <TimetableOverlay composition={comp}
                                currentFrame={store.currentFrame} />
            </div>
          </div>
        </section>
      );
    }
    else {
      return (
        <section className="timeline panel">
        </section>
      );
    }
  },

  _onWheel(scrollArea) {
    return (e) => {
      if (e.altKey) {
        e.stopPropagation();
        e.preventDefault();
        let width = this.state.timetableWidth;
        let diff = width * e.deltaY * ZOOM_RATIO;
        this.setState({
          timetableWidth: Math.max(100, width + diff)
        });
        this.headerDOM.scrollLeft    += diff / 2;
        this.timetableDOM.scrollLeft += diff / 2;
      }
      else {
        setTimeout(() => {
          if (scrollArea === "timetable") {
            this.headerDOM.scrollLeft = this.timetableDOM.scrollLeft;
            this.leftDOM.scrollTop = this.timetableDOM.scrollTop;
          }
          else if (scrollArea === "header") {
            this.timetableDOM.scrollLeft = this.headerDOM.scrollLeft;
          }
          else if (scrollArea === "left") {
            this.timetableDOM.scrollTop = this.leftDOM.scrollTop;
          }
        }, 0);
      }
    }
  },

  _onCreateLayerButtonClicked() {
    let comp = this.props.store.editingComposition;
    if (!comp) {
      return;
    }
    Actions.createLayer(comp);
  },

  _onDragEnter(e) {
    e.preventDefault();
    this.setState({dragSemaphore: this.state.dragSemaphore + 1});
  },

  _onDragOver(e) {
    e.preventDefault();
  },

  _onDragLeave(e) {
    e.preventDefault();
    this.setState({dragSemaphore: this.state.dragSemaphore - 1});
  },

  _onDrop(e) {
    e.preventDefault();
    let nowComp = this.props.store.editingComposition;
    if (!nowComp) {
      return;
    }
    let dropped = this.props.store.dragging;
    if (!dropped) {
      return;
    }
    if (dropped.type === DragActionType.FOOTAGE) {
      Actions.createLayer(nowComp, 0, dropped.object);
    }
    else if (dropped.type === DragActionType.COMPOSITION) {
      if (dropped.object.id === nowComp.id) {
        console.warn("Cannot create a layer of same composition.")
        return;
      }
      Actions.createLayer(nowComp, 0, dropped.object);
    }
  },

  _onLayerHeaderDragStart(layer, layerHeader) {
    return (e) => {
      e.dataTransfer.setDragImage(genDummyImg(), 0, 0);
      this.setState({draggingLayer: layer});
    };
  },

  _onLayerHeaderDragEnter(layer, layerHeader) {
    return (e) => {
      let layers = this.state.layers;
      let draggingLayer = this.state.draggingLayer;
      if (draggingLayer === null) {
        return;
      }
      let srcIndex = layers.map(e => e.id).indexOf(draggingLayer.id);
      let dstIndex = layers.map(e => e.id).indexOf(layer.id);
      if (srcIndex < dstIndex) {
        this.setState({layers:
          layers.slice(0, srcIndex).concat(
            layer,
            layers.slice(srcIndex + 1, dstIndex),
            draggingLayer,
            layers.slice(dstIndex + 1)
          ),
        });
      }
      else if (srcIndex > dstIndex) {
        this.setState({layers:
          layers.slice(0, dstIndex).concat(
            draggingLayer,
            layers.slice(dstIndex + 1, srcIndex),
            layer,
            layers.slice(srcIndex + 1)
          ),
        });
      }
    };
  },

  _onLayerHeaderDragEnd(layer, layerHeader) {
    return (e) => {
      let comp = this.props.store.editingComposition;
      if (!comp) {
        return;
      }
      let clearingFrames = new Array(comp.frame).fill(0);

      for (var i = 0; i < this.state.layers.length; i++) {
        let layer = this.state.layers[i];
        if (layer.id === comp.layers[i].id) {
          continue;
        }
        for (var j = layer.layerStart; j < layer.layerEnd; j++) {
          clearingFrames[i] += 1;
        }
      }
      Actions.clearFrameCache(comp,
        clearingFrames.map((e, i) => i)
                      .filter((e) => clearingFrames[e] > 0));

      comp.update({layers: this.state.layers});
      this.setState({draggingLayer: null});
    };
  },
});

export default Timeline;
