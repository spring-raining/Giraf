"use strict";

import React                          from "react";
import {FormattedMessage}             from "react-intl";
import _Array                         from "lodash/array";
import _Lang                          from "lodash/lang";
import _Utility                       from "lodash/utility";

import Actions                        from "src/actions/actions";
import {Composition}                  from "src/stores/model/composition";
import {DragAction, DragActionType}   from "src/stores/model/dragAction";
import Summary                        from "src/views/timeline/summary";
import Layer                          from "src/views/timeline/layer";
import LayerHeader                    from "src/views/timeline/layerHeader";
import TimeController                 from "src/views/timeline/timeController";
import TimetableOverlay               from "src/views/timeline/timetableOverlay";
import TutorialModal                  from "src/views/modal/tutorialModal";
import {Range}                        from "src/views/forms";
import Scroll                         from "src/views/scroll";
import genDummyImg                    from "src/utils/genDummyImg";


const WHEEL_ZOOM_RATIO = 0.01;
const STEP_ZOOM_RATIO = 0.5;
const MIN_TIMETABLE_WIDTH = 500;
const MAX_TIMETABLE_WIDTH = 10000;

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
    const activeItem = nextProps.store.get("activeItem");
    const layers = (activeItem instanceof Composition)? activeItem.layers : null;
    this.setState({
      layers: layers,
    });
  },

  componentDidUpdate(prevProps, prevState) {
    var _;
    this.timetableDOM = (_ = this.refs.timetable)? _.getContentDOM() : null;
    this.headerDOM    = (_ = this.refs.header)? _.getContentDOM() : null;
    this.leftDOM      = (_ = this.refs.left)? _.getContentDOM() : null;

    const activeItem = this.props.store.get("activeItem");
    const comp = (activeItem instanceof Composition)? activeItem : null;
    const currentFrame = this.props.store.get("currentFrame");
    if (comp !== null) {
      // start auto render
      if (this.props.store.get("isPlaying")
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

  _updateTimetableScale(width, left = null) {
    const timetableWidth = Math.min(MAX_TIMETABLE_WIDTH,
                           Math.max(MIN_TIMETABLE_WIDTH, width));
    const timetableLeft = _Lang.isNumber(left) ? left
      : this.timetableDOM.scrollLeft * timetableWidth / this.state.timetableWidth
        + this.timetableDOM.offsetWidth * (timetableWidth / this.state.timetableWidth - 1) / 2;

    this.setState({
      timetableWidth: timetableWidth,
    });
    this.headerDOM.scrollLeft = timetableLeft;
    this.timetableDOM.scrollLeft = timetableLeft;
  },

  _calculateTimetableWidthToRange(width) {
    return Math.log((Math.E - 1)
                  * (width - MIN_TIMETABLE_WIDTH)
                  / (MAX_TIMETABLE_WIDTH - MIN_TIMETABLE_WIDTH)
                  + 1);
  },

  _calculateTimetableRangeToWidth(range) {
    return (Math.exp(range) - 1)
         * (MAX_TIMETABLE_WIDTH - MIN_TIMETABLE_WIDTH)
         / (Math.E - 1)
         + MIN_TIMETABLE_WIDTH;
  },

  render() {
    const store = this.props.store;
    const activeItem = store.get("activeItem");
    const comp = (activeItem instanceof Composition) ? activeItem : null;
    const dragging = store.get("dragging");

    let drophere = null;
    if (dragging) {
      if (dragging.type === DragActionType.FOOTAGE
      ||  dragging.type === DragActionType.COMPOSITION) {
        drophere = (
          <div className="timeline__drophere">
            <div className="timeline__drophere__card">
              <FormattedMessage id="views.timeline.drop_here"
                                defaultMessage="Drop Here" />
            </div>
          </div>
        );
      }
    }

    if (comp) {
      let cachedFrames = store.get("frameCache").getAllFrameCache(comp);

      let summary = <Summary composition={comp}
                             currentFrame={store.get("currentFrame")}
                             onClick={this._onBlankAreaClick}/>;
      let layers = this.state.layers.map((e) =>
        <Layer composition={comp} layer={e} key={e.id}
               isEdited={e.id === store.get("selectingItem", "id")}
               onClick={this._onLayerClick} />
      );
      let layerHeaders = this.state.layers.map((e) =>
        <LayerHeader composition={comp} layer={e} key={e.id}
                     isEdited={e.id === store.get("selectingItem", "id")}
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
                    onScroll={this._onScroll("header")}>
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
                    onScroll={this._onScroll("left")}>
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
                    onScroll={this._onScroll("timetable")}
                    onWheel={this._onWheel}>
              <div className="timeline__timetable"
                   style={{width: this.state.timetableWidth + "px"}}>
                {layers}
                <TimetableOverlay composition={comp}
                                  currentFrame={store.get("currentFrame")} />
              </div>
            </Scroll>
          </div>
          <div className="timeline__scale-scroller">
            <button className="flat lsf-icon timeline__scale-scroller__zoom-out"
                    title="minus"
                    onClick={this._onZoomOutButtonClick}>
            </button>
            <Range value={this._calculateTimetableWidthToRange(this.state.timetableWidth)}
                   min={0} max={1} step={0.01}
                   onChange={this._onScaleRangeChange} />
            <button className="flat lsf-icon timeline__scale-scroller__zoom-in"
                    title="plus"
                    onClick={this._onZoomInButtonClick}>
            </button>
          </div>
          {drophere}
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
          <TutorialModal />
          {drophere}
        </section>
      );
    }
  },

  _onScroll(scrollArea) {
    return (e) => {
      if (!e.altKey) {
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
      }
    }
  },

  _onWheel(e) {
    if (e.altKey) {
      e.stopPropagation();
      e.preventDefault();
      let el = this.timetableDOM;
      let layerX = 0;
      while (el && !isNaN(el.offsetLeft)) {
        layerX += el.offsetLeft;
        el = el.offsetParent;
      }
      const timetableWidth = this.state.timetableWidth * (e.deltaY * WHEEL_ZOOM_RATIO + 1);
      const timetableLeft = (this.timetableDOM.scrollLeft + e.clientX - layerX) * timetableWidth / this.state.timetableWidth
                            - (e.clientX - layerX);
      this._updateTimetableScale(timetableWidth, timetableLeft);
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
    const dropped = this.props.store.get("dragging");
    if (!dropped) {
      return;
    }
    Actions.endDrag();

    const activeItem = this.props.store.get("activeItem");
    const nowComp = (activeItem instanceof Composition)? activeItem : null;
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
      const activeItem = this.props.store.get("activeItem");
      const comp = (activeItem instanceof Composition)? activeItem : null;
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
  },

  _onScaleRangeChange(value) {
    const width = this._calculateTimetableRangeToWidth(value);
    this._updateTimetableScale(width);
  },

  _onZoomInButtonClick() {
    const width = this.state.timetableWidth * (1 + STEP_ZOOM_RATIO);
    this._updateTimetableScale(width);
  },

  _onZoomOutButtonClick() {
    const width = this.state.timetableWidth * (1 - STEP_ZOOM_RATIO);
    this._updateTimetableScale(width);
  },
});

export default Timeline;
