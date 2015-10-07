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


var Timeline = React.createClass({
  getInitialState() {
    return {
      timetableWidth: 1000,
      scrollTop: 0,
      scrollLeft: 0,
      dragSemaphore: 0, // become 1 or more when onDragOver
    };
  },

  componentDidUpdate() {
    var _;
    this.timetableDOM = (_ = this.refs.timetable)? _.getDOMNode() : null;
    this.headerDOM    = (_ = this.refs.header)? _.getDOMNode() : null;
    this.leftDOM      = (_ = this.refs.left)? _.getDOMNode() : null;

    let selectedItem = this.props.store.access.getSelectedItem();
    let currentFrame = this.props.store.currentFrame;
    if (selectedItem instanceof Composition
    && currentFrame !== null) {
      this._fetchFrameCache(selectedItem, currentFrame);
    }
  },

  _fetchFrameCache(composition, frame) {
    let frameCache = this.props.store.compositionFrameCache[composition.id];
    if (!frameCache || !frameCache[frame]) {
      Actions.renderFrame(composition, frame);
    }
  },

  render() {
    let store = this.props.store;
    let selectedItem = store.access.getSelectedItem();

    if (selectedItem instanceof Composition) {
      let comp = selectedItem;
      let summary = <Summary composition={comp} />;
      let layers = comp.layers.map((e) =>
        <Layer composition={comp} layer={e} key={e.id} />
      );
      let layerHeaders = comp.layers.map((e) =>
        <LayerHeader composition={comp} layer={e} key={e.id} />
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
               onScroll={this._onScroll("header")}>
            <div className="timeline__header" style={{width: this.state.timetableWidth + "px"}}>
              <TimeController composition={comp}
                              currentFrame={store.currentFrame} />
            </div>
          </div>
          <div className="timeline__left-container scroll-area"
               ref="left"
               onScroll={this._onScroll("left")}>
            <div className="timeline__left">
              {layerHeaders}
              <button onClick={this._onCreateLayerButtonClicked}>Create Layer</button>
            </div>
          </div>
          <div className="timeline__timetable-container scroll-area"
               ref="timetable"
               onScroll={this._onScroll("timetable")}>
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

  _onScroll(scrollArea) {
    return () => {
      setTimeout(() => {
        if (scrollArea === "timetable") {
          this.headerDOM.scrollLeft    = this.timetableDOM.scrollLeft;
          this.leftDOM.scrollTop       = this.timetableDOM.scrollTop;
        }
        else if (scrollArea === "header") {
          this.timetableDOM.scrollLeft = this.headerDOM.scrollLeft;
        }
        else if (scrollArea === "left") {
          this.timetableDOM.scrollTop  = this.leftDOM.scrollTop;
        }
      }, 0);
    }
  },

  _onCreateLayerButtonClicked() {
    Actions.createLayer(this.props.store.access.getSelectedItem());
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
    let nowComp = this.props.store.access.getSelectedItem();
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
  }
});

export default Timeline;
