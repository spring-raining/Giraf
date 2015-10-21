"use strict";

import React                      from "react";

import {Footage, FootageKinds}    from "src/stores/model/footage";
import {Composition}              from "src/stores/model/composition";


var Preview = React.createClass({
  componentWillUpdate(nextProps, nextState) {
    let selectingItem = nextProps.store.selectingItem;

    if (this.refs.compositionContainer
    &&  !(selectingItem instanceof Composition)) {
      this._flushDOM(this.refs.compositionContainer.getDOMNode());
    }
  },

  componentDidUpdate() {
    let store = this.props.store;
    let selectingItem = store.selectingItem;

    if (selectingItem !== null) {

      // insert canvas into DOM
      if (selectingItem instanceof Composition) {
        this._updatePreviewCompositionDOM(selectingItem);
      }

      // play video
      if (selectingItem instanceof Footage
      &&  selectingItem.getFootageKind() === FootageKinds.VIDEO) {
        let dom = this.refs.video.getDOMNode();
        if (store.playing) {
          dom.play();
        }
        else {
          dom.pause();
        }
      }

    }
  },

  _updatePreviewCompositionDOM(composition) {
    var _;
    let store = this.props.store;
    if (!this.refs.compositionContainer) {
      return;
    }
    let dom = this.refs.compositionContainer.getDOMNode();

    _ = store.compositionFrameCache;
    let frameCache = !(_ = _[composition.id]) ? null
                   : !(_ = _[store.currentFrame]) ? null
                   : _;
    // lazy update mode
    if (store.playing) {
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
    let selectingItem = this.props.store.selectingItem;
    let previewContainer;
    if (selectingItem === null) {
      previewContainer =
        <div className="preview__container preview__none-container"></div>;
    }
    else if (selectingItem instanceof Footage) {
      if (selectingItem.getFootageKind() === FootageKinds.IMAGE) {
        previewContainer =
          <div className="preview__container preview__footage-container">
            <img src={selectingItem.content} />
          </div>;
      }
      else if (selectingItem.getFootageKind() === FootageKinds.VIDEO) {
        previewContainer =
          <div className="preview__container preview__footage-container">
            <video controls src={selectingItem.content}
                   ref="video" />
          </div>;
      }
    }
    else if (selectingItem instanceof Composition) {
      previewContainer =
        <div className="preview__container preview__composition-container"
             ref="compositionContainer"></div>;
    }

    return <section className="preview panel">
      {previewContainer}
    </section>;
  },
});

export default Preview;
