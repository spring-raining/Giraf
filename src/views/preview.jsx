"use strict";

import React                      from "react";

import {Footage, FootageKinds}    from "src/stores/model/footage";
import {Composition}              from "src/stores/model/composition";


var Preview = React.createClass({
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
    let previewContainer;
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
      previewContainer =
        <div className="preview__container preview__composition-container"
             ref="compositionContainer"></div>;
    }
    else {
      previewContainer =
        <div className="preview__container preview__none-container"></div>;
    }

    return <section className="preview panel">
      {previewContainer}
    </section>;
  },

  _onPause(e) {

  },
});

export default Preview;
