"use strict";

import React                      from "react";

import {Footage, FootageKinds}    from "src/stores/model/footage";
import {Composition}              from "src/stores/model/composition";
import {Rect, Group, Layer}       from "src/views/preview/wireframes";


const WHEEL_ZOOM_RATIO = 0.01;

var Preview = React.createClass({
  getInitialState() {
    return {
      previewScale: 1,
      fullScreen: false,
    };
  },

  componentWillUpdate(nextProps, nextState) {
    let activeItem = nextProps.store.get("activeItem");

    if (this.refs.compositionContainer
    &&  !(activeItem instanceof Composition)) {
      this._flushDOM(this.refs.compositionContainer);
    }
  },

  componentDidUpdate() {
    let store = this.props.store;
    let activeItem = store.get("activeItem");

    if (activeItem !== null) {

      // insert canvas into DOM
      if (activeItem instanceof Composition) {
        this._updatePreviewCompositionDOM(activeItem);
      }

      // play video
      if (activeItem instanceof Footage
      &&  activeItem.getFootageKind() === FootageKinds.VIDEO) {
        let dom = this.refs.video;
        if (store.get("isPlaying")) {
          dom.play();
        }
        else {
          dom.pause();
        }
      }

    }
  },

  _updatePreviewCompositionDOM(composition) {
    let store = this.props.store;
    if (!this.refs.compositionContainer) {
      return;
    }
    let dom = this.refs.compositionContainer;

    let frameCache = store.get("frameCache")
                          .getFrameCache(composition, store.get("currentFrame"));
    // lazy update mode
    if (store.get("isPlaying")) {
      if (frameCache) {
        this._flushDOM(dom);
        dom.appendChild(frameCache);
      }
    }
    // sync with currentFrame
    else {
      this._flushDOM(dom);
      if (frameCache) {
        dom.appendChild(frameCache);
      }
    }
  },

  _flushDOM(dom) {
    while (dom.firstChild) {
      dom.removeChild(dom.firstChild);
    }
  },

  render() {
    const activeItem = this.props.store.get("activeItem");
    const className = "preview panel"
      + (this.state.fullScreen? " full-screen" : "");

    let previewContainer = null;
    let previewWireframe = null;
    if (activeItem instanceof Footage) {
      if (activeItem.getFootageKind() === FootageKinds.IMAGE
      ||  activeItem.getFootageKind() === FootageKinds.GIF) {
        previewContainer =
          <div className="preview__container preview__footage-container">
            <img src={activeItem.objectURL} />
          </div>;
      }
      else if (activeItem.getFootageKind() === FootageKinds.VIDEO) {
        previewContainer =
          <div className="preview__container preview__footage-container">
            <video controls src={activeItem.objectURL}
                   onPause={this._onPause}
                   ref="video" />
          </div>;
      }
    }
    else if (activeItem instanceof Composition) {
      const svgTransform = `translate(${-activeItem.width * this.state.previewScale / 2} `
                                   + `${-activeItem.height * this.state.previewScale / 2}) `
                             + `scale(${this.state.previewScale})`;

      previewContainer =
        <div className="preview__composition-container-wrapper">
          <div className="preview__container preview__composition-container"
               style={{transform: `scale(${this.state.previewScale})`}}
               ref="compositionContainer">
          </div>
        </div>;
      previewWireframe =
        <svg className="preview__wireframe"
             onWheel={this._onScroll}>
          <svg x="50%" y="50%" style={{overflow: "visible"}}>
            <g transform={svgTransform}>
              <Layer x={0} y={0} width={activeItem.width} height={activeItem.height}
                     previewScale={this.state.previewScale} />
            </g>
          </svg>
        </svg>;
    }
    else {
      previewContainer =
        <div className="preview__container preview__none-container"></div>;
    }

    return <section className={className}>
      {previewContainer}
      {previewWireframe}
      <button className="preview__full-screen-button flat lsf sub"
              onClick={this._onFullScreenButtonClick}>
        {this.state.fullScreen? "small" : "full"}
      </button>
    </section>;
  },

  _onPause(e) {

  },

  _onFullScreenButtonClick() {
    this.setState({
      fullScreen: !this.state.fullScreen,
    });
  },

  _onScroll(e) {
    e.stopPropagation();
    e.preventDefault();
    const val = this.state.previewScale * (1 - e.deltaY * WHEEL_ZOOM_RATIO);
    this.setState({
      previewScale: Math.min(10, Math.max(0.1, val)),
    });
  },
});

export default Preview;
