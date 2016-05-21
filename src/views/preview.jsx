"use strict";

import React                      from "react";
import ReactDOM                   from "react-dom";

import {Footage, FootageKinds}    from "src/stores/model/footage";
import {Composition}              from "src/stores/model/composition";
import _Renderable                from "src/stores/model/_renderable";
import {Rect, Group, Layer}       from "src/views/preview/wireframes";
import {hasTrait}                 from "src/utils/traitUtils";


const WHEEL_ZOOM_RATIO = 0.01;

var Preview = React.createClass({
  getInitialState() {
    return {
      previewScale: 1,
      fullScreen: false,
      wireframeMousePos: {x: 0, y: 0},
      wireframeOffset: {top: 0, left: 0},
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
      const selectingItemId = this.props.store.get("selectingItem", "id");
      const svgTransform = `translate(${-activeItem.width * this.state.previewScale / 2} `
                                   + `${-activeItem.height * this.state.previewScale / 2}) `
                             + `scale(${this.state.previewScale})`;
      const layers = [].concat(activeItem.layers).reverse()
        .filter((e) => hasTrait(e.entity, _Renderable))
        .map((e) => {
          const className = e.getClassName()
            + ((e.id === selectingItemId)? " edited" : "");
          return (
            <Layer className={className}
                   key={e.id}
                   x={e.transform.position.x - e.transform.anchorPoint.x * e.transform.scale.x}
                   y={e.transform.position.y - e.transform.anchorPoint.y * e.transform.scale.y}
                   width={e.entity.width * e.transform.scale.x}
                   height={e.entity.height * e.transform.scale.y}
                   rotation={e.transform.rotation}
                   handle={{
                     x: e.transform.position.x,
                     y: e.transform.position.y,
                     r: (e.entity.width * Math.abs(e.transform.scale.x) + e.entity.height * Math.abs(e.transform.scale.y)) / 6,
                   }}
                   onDrag={this._onLayerDrag(e)}
                   onClick={this._onLayerClick(e)}
                   previewScale={this.state.previewScale} />
          );
        });

      previewContainer =
        <div className="preview__composition-container-wrapper">
          <div className="preview__container preview__composition-container"
               style={{transform: `scale(${this.state.previewScale})`}}
               ref="compositionContainer">
          </div>
        </div>;
      previewWireframe =
        <div className="preview__wireframe-wrapper"
             ref="wireframe">
          <svg className="preview__wireframe"
               onWheel={this._onScroll}
               onMouseEnter={this._onWireframeMouseEnter}
               onMouseMove={this._onWireframeMouseMove}>
            <svg x="50%" y="50%" style={{overflow: "visible"}}>
              <g transform={svgTransform}>
                <Layer x={0} y={0} width={activeItem.width} height={activeItem.height}
                       previewScale={this.state.previewScale} />
                {layers}
              </g>
            </svg>
          </svg>
        </div>;
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

  _onWireframeMouseEnter(e) {
    const wireframeDOM = ReactDOM.findDOMNode(this.refs.wireframe);
    let offsetTop = 0;
    let offsetLeft = 0;
    let el = wireframeDOM;
    while (el && !isNaN(el.offsetLeft)) {
      offsetLeft += el.offsetLeft;
      el = el.offsetParent;
    }
    el = wireframeDOM;
    while (el && !isNaN(el.offsetTop)) {
      offsetTop += el.offsetTop;
      el = el.offsetParent;
    }

    this.setState({
      wireframeOffset: {top: offsetTop, left: offsetLeft},
    });
  },

  _onWireframeMouseMove(e) {
    this.setState({
      wireframeMousePos: {
        x: e.clientX - this.state.wireframeOffset.left,
        y: e.clientY - this.state.wireframeOffset.top,
      }
    });
  },

  _onLayerDrag(layer) {
    return (el) => (e) => {
      //console.log(el, this.state.wireframeMousePos.x);
    };
  },

  _onLayerClick(layer) {
    return (e) => {

    };
  }
});

export default Preview;
