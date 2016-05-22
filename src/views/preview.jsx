"use strict";

import React                      from "react";
import ReactDOM                   from "react-dom";
import Decimal                    from "decimal.js";

import Actions                    from "src/actions/actions";
import {Footage, FootageKinds}    from "src/stores/model/footage";
import {Composition}              from "src/stores/model/composition";
import {Rect, Group, Layer}       from "src/views/preview/wireframes";


const WHEEL_ZOOM_RATIO = 0.01;

var Preview = React.createClass({
  getInitialState() {
    return {
      previewScale: 1,
      fullScreen: false,
      wireframeMousePos: {x: 0, y: 0},
      wireframeOffset: {top: 0, left: 0},
      dragStartMousePos: null,
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
        .filter((e) => e.isVisible(this.props.store.get("currentFrame")))
        .map((e) => {
          const className = e.getClassName()
            + ((e.id === selectingItemId)? " edited" : "");
          const transform = e.tmpTransform || e.transform;
          return (
            <Layer className={className}
                   key={e.id}
                   x={transform.position.x - transform.anchorPoint.x * transform.scale.x}
                   y={transform.position.y - transform.anchorPoint.y * transform.scale.y}
                   width={e.entity.width * transform.scale.x}
                   height={e.entity.height * transform.scale.y}
                   rotation={transform.rotation}
                   handle={{
                     x: transform.position.x,
                     y: transform.position.y,
                   }}
                   onDragStart={this._onLayerDragStart(e)}
                   onDrag={this._onLayerDrag(e)}
                   onDragEnd={this._onLayerDragEnd(e)}
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
               onClick={this._onWireframeClick}
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

  _onWireframeClick(e) {
    Actions.changeEditingLayer(null);
  },

  _onLayerClick(layer) {
    return (e) => {
      e.stopPropagation();
      Actions.changeEditingLayer(layer);
    };
  },

  _onLayerDragStart(layer) {
    return (el) => (e) => {
      if (layer.id !== this.props.store.get("selectingItem", "id")) {
        return;
      }
      
      layer.update({
        tmpTransform: layer.transform.clone(),
      }, false);
      this.setState({
        dragStartMousePos: {
          x: e.clientX,
          y: e.clientY,
        },
      });
    };
  },

  _onLayerDrag(layer) {
    return (el) => (e) => {
      if (layer.id !== this.props.store.get("selectingItem", "id")) {
        return;
      }

      const diffX = (e.clientX - this.state.dragStartMousePos.x) / this.state.previewScale;
      const diffY = (e.clientY - this.state.dragStartMousePos.y) / this.state.previewScale;
      if (el === "rect") {
        layer.tmpTransform.position.update({
          x: layer.transform.position.x + diffX,
          y: layer.transform.position.y + diffY,
        });
      }
      else if (el === "corner-nw") {
        layer.tmpTransform.position.update({
          x: layer.transform.position.x + diffX * (layer.entity.width - layer.transform.anchorPoint.x) / layer.entity.width,
          y: layer.transform.position.y + diffY * (layer.entity.height - layer.transform.anchorPoint.y) / layer.entity.height,
        });
        layer.tmpTransform.scale.update({
          x: layer.transform.scale.x - diffX / layer.entity.width,
          y: layer.transform.scale.y - diffY / layer.entity.height,
        });
      }
      else if (el === "corner-n") {
        layer.tmpTransform.position.update({
          y: layer.transform.position.y + diffY * (layer.entity.height - layer.transform.anchorPoint.y) / layer.entity.height,
        });
        layer.tmpTransform.scale.update({
          y: layer.transform.scale.y - diffY / layer.entity.height,
        });
      }
      else if (el === "corner-ne") {
        layer.tmpTransform.position.update({
          x: layer.transform.position.x + diffX * layer.transform.anchorPoint.x / layer.entity.width,
          y: layer.transform.position.y + diffY * (layer.entity.height - layer.transform.anchorPoint.y) / layer.entity.height,
        });
        layer.tmpTransform.scale.update({
          x: layer.transform.scale.x + diffX / layer.entity.width,
          y: layer.transform.scale.y - diffY / layer.entity.height,
        });
      }
      else if (el === "corner-e") {
        layer.tmpTransform.position.update({
          x: layer.transform.position.x + diffX * layer.transform.anchorPoint.x / layer.entity.width,
        });
        layer.tmpTransform.scale.update({
          x: layer.transform.scale.x + diffX / layer.entity.width,
        });
      }
      else if (el === "corner-se") {
        layer.tmpTransform.position.update({
          x: layer.transform.position.x + diffX * layer.transform.anchorPoint.x / layer.entity.width,
          y: layer.transform.position.y + diffY * layer.transform.anchorPoint.y / layer.entity.height,
        });
        layer.tmpTransform.scale.update({
          x: layer.transform.scale.x + diffX / layer.entity.width,
          y: layer.transform.scale.y + diffY / layer.entity.height,
        });
      }
      else if (el === "corner-s") {
        layer.tmpTransform.position.update({
          y: layer.transform.position.y + diffY * layer.transform.anchorPoint.y / layer.entity.height,
        });
        layer.tmpTransform.scale.update({
          y: layer.transform.scale.y + diffY / layer.entity.height,
        });
      }
      else if (el === "corner-sw") {
        layer.tmpTransform.position.update({
          x: layer.transform.position.x + diffX * (layer.entity.width - layer.transform.anchorPoint.x) / layer.entity.width,
          y: layer.transform.position.y + diffY * layer.transform.anchorPoint.y / layer.entity.height,
        });
        layer.tmpTransform.scale.update({
          x: layer.transform.scale.x - diffX / layer.entity.width,
          y: layer.transform.scale.y + diffY / layer.entity.height,
        });
      }
      else if (el === "corner-w") {
        layer.tmpTransform.position.update({
          x: layer.transform.position.x + diffX * (layer.entity.width - layer.transform.anchorPoint.x) / layer.entity.width,
        });
        layer.tmpTransform.scale.update({
          x: layer.transform.scale.x - diffX / layer.entity.width,
        });
      }
      // else if (el === "handle-circle") {
      //
      // }
      else if (el === "handle-anchor") {
        layer.tmpTransform.anchorPoint.update({
          x: layer.transform.anchorPoint.x + diffX / layer.transform.scale.x,
          y: layer.transform.anchorPoint.y + diffY / layer.transform.scale.y,
        });
        layer.tmpTransform.position.update({
          x: layer.transform.position.x + diffX,
          y: layer.transform.position.y + diffY,
        });
      }
    };
  },

  _onLayerDragEnd(layer) {
    return (el) => (e) => {
      if (layer.id !== this.props.store.get("selectingItem", "id")) {
        return;
      }

      const round = (step, n) => new Decimal(n + "").toNearest(step).toNumber();
      layer.transform.anchorPoint.update({
        x: round(1, layer.tmpTransform.anchorPoint.x),
        y: round(1, layer.tmpTransform.anchorPoint.y),
      });
      layer.transform.position.update({
        x: round(1, layer.tmpTransform.position.x),
        y: round(1, layer.tmpTransform.position.y),
      });
      layer.transform.scale.update({
        y: round(0.01, layer.tmpTransform.scale.y),
        x: round(0.01, layer.tmpTransform.scale.x),
      });
      layer.tmpTransform = null;
      layer.update();
      this.setState({
        dragStartMousePos: null,
      });
    };
  },
});

export default Preview;
