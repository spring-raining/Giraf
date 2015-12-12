"use strict";

import React                          from "react";
import _Array                         from "lodash/array";
import _Utility                       from "lodash/utility";

import Actions                        from "src/actions/actions";
import {Composition}                  from "src/stores/model/composition";
import {DragAction, DragActionType}   from "src/stores/model/dragAction";
import Summary                        from "src/views/timeline/summary";
import Layer                          from "src/views/timeline/layer";
import LayerHeader                    from "src/views/timeline/layerHeader";
import TimeController                 from "src/views/timeline/timeController";
import TimetableOverlay               from "src/views/timeline/timetableOverlay"
import Scroll                         from "src/views/scroll";
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
    this.setState({
      layers: nextProps.store.get("editingComposition", "layers"),
    });
  },

  componentDidUpdate(prevProps, prevState) {
    var _;
    this.timetableDOM = (_ = this.refs.timetable)? _.getContentDOM() : null;
    this.headerDOM    = (_ = this.refs.header)? _.getContentDOM() : null;
    this.leftDOM      = (_ = this.refs.left)? _.getContentDOM() : null;

    let comp = this.props.store.get("editingComposition");
    let currentFrame = this.props.store.get("currentFrame");
    if (comp !== null) {
      // start auto render
      if (this.props.store.get("selectingItem", "id") === comp.id
      &&  this.props.store.get("isPlaying")
      &&  !this.state.executingAutoRender) {
        this.setState({
          executingAutoRender: true,
        });
        Actions.renderFrameAutomatically(comp);
      }

      // render current frame
      else if (!this.props.store.get("isPlaying") && currentFrame !== null) {
        this._createFrameCache(comp, currentFrame);
      }
    }

    // end auto render
    if (!this.props.store.get("isPlaying") && this.state.executingAutoRender) {
      this.setState({
        executingAutoRender: false,
      });
    }
  },

  _createFrameCache(composition, frame) {
    let frameCache = this.props.store.get("frameCache")
                                     .getFrameCache(composition, frame);
    if (!frameCache) {
      Actions.renderFrame(composition, frame);
    }
  },

  render() {
    let _;
    let store = this.props.store;
    let comp = store.get("editingComposition");

    if (comp) {
      let cachedFrames = store.get("frameCache").getAllFrameCache(comp);

      let summary = <Summary composition={comp}
                             currentFrame={store.get("currentFrame")}
                             onClick={this._onBlankAreaClick}/>;
      let layers = this.state.layers.map((e) =>
        <Layer composition={comp} layer={e} key={e.id}
               isEdited={e.id === store.get("editingLayer", "id")}
               onClick={this._onLayerClick} />
      );
      let layerHeaders = this.state.layers.map((e) =>
        <LayerHeader composition={comp} layer={e} key={e.id}
                     isEdited={e.id === store.get("editingLayer", "id")}
                     onClick={this._onLayerClick}
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
          <div className="timeline__header-container">
            <Scroll scrollX={true}
                    scrollY={false}
                    hideScrollBar={true}
                    ref="header"
                    onWheel={this._onWheel("header")}>
              <div className="timeline__header"
                   style={{width:this.state.timetableWidth + "px"}}>
                <TimeController composition={comp}
                                cachedFrames={cachedFrames}
                                currentFrame={store.get("currentFrame")} />
              </div>
            </Scroll>
          </div>
          <div className="timeline__left-container">
            <Scroll scrollX={false}
                    scrollY={true}
                    hideScrollBar={true}
                    ref="left"
                    onClick={this._onBlankAreaClick}
                    onWheel={this._onWheel("left")}>
              <div className="timeline__left">
                {layerHeaders}
              </div>
            </Scroll>
          </div>
          <div className="timeline__timetable-container">
            <Scroll scrollX={true}
                    scrollY={true}
                    ref="timetable"
                    onClick={this._onBlankAreaClick}
                    onWheel={this._onWheel("timetable")}>
              <div className="timeline__timetable"
                   style={{width: this.state.timetableWidth + "px"}}>
                {layers}
                <TimetableOverlay composition={comp}
                                  currentFrame={store.get("currentFrame")} />
              </div>
            </Scroll>
          </div>
        </section>
      );
    }
    else {
      return (
        <section className="timeline panel"
                 onDragEnter={this._onDragEnter}
                 onDragOver={this._onDragOver}
                 onDragLeave={this._onDragLeave}
                 onDrop={this._onDrop}>
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
    let dropped = this.props.store.get("dragging");
    if (!dropped) {
      return;
    }
    let nowComp = this.props.store.get("editingComposition");
    if (nowComp) {
      if (dropped.type === DragActionType.FOOTAGE) {
        Actions.createLayer(nowComp, 0, dropped.object);
      }
      else if (dropped.type === DragActionType.COMPOSITION) {
        Actions.createLayer(nowComp, 0, dropped.object);
      }
    }
    else {
      if (dropped.type === DragActionType.FOOTAGE) {
        Actions.createCompositionWithFootage(dropped.object);
      }
      else if (dropped.type === DragActionType.COMPOSITION) {
        Actions.changeSelectingItem(dropped.object);
        Actions.changeEditingComposition(dropped.object);
      }
    }
  },

  _onLayerHeaderDragStart(layer, layerHeader) {
    return (e) => {
      e.dataTransfer.setDragImage(genDummyImg(), 0, 0);
      e.dataTransfer.setData("text", "layer");
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
      let comp = this.props.store.get("editingComposition");
      if (!comp) {
        return;
      }
      let changedFrames = [];
      for (var i = 0; i < this.state.layers.length; i++) {
        let layer = this.state.layers[i];
        if (layer.id === comp.layers[i].id) {
          continue;
        }
        changedFrames = _Array.union(
          changedFrames,
          _Utility.range(layer.layerStart, layer.layerEnd));
      }
      Actions.clearFrameCache(comp, changedFrames);

      comp.update({layers: this.state.layers});
      this.setState({draggingLayer: null});
    };
  },

  _onLayerClick(layer) {
    return (e) => {
      e.stopPropagation();
      Actions.changeEditingLayer(layer);
    }
  },

  _onBlankAreaClick() {
    Actions.changeEditingLayer(null);
  }
});

export default Timeline;
