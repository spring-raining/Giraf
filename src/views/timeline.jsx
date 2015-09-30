"use strict";

import React from "react";

import Summary from "./timeline/summary";
import Layer from "./timeline/layer";
import LayerHeader from "./timeline/layerHeader";
import Actions from "../actions/actions";
import Composition from "../stores/model/composition";
import {DragAction, DragActionType} from "../stores/model/dragAction";

var Timeline = React.createClass({
  getInitialState() {
    return {
      timetableWidth: 1500,
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
              <button onClick={this._onCreateLayerButtonClicked}>Create Layer</button>
            </div>
          </div>
          <div className="timeline__left-container scroll-area"
               ref="left"
               onScroll={this._onScroll("left")}>
            <div className="timeline__left">
              {layerHeaders}
            </div>
          </div>
          <div className="timeline__timetable-container scroll-area"
               ref="timetable"
               onScroll={this._onScroll("timetable")}>
            <div className="timeline__timetable" style={{width: this.state.timetableWidth + "px"}}>
              {layers}
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
    if (this.props.store.dragging.type === DragActionType.FILE) {
      Actions.createLayer(
        this.props.store.access.getSelectedItem(),
        0,
        this.props.store.dragging.object);
    }
  }
});

export default Timeline;
