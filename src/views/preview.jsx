"use strict";

import React                      from "react";

import {Footage, FootageKinds}    from "src/stores/model/footage";
import {Composition}              from "src/stores/model/composition";


var Preview = React.createClass({
  componentWillUpdate() {
    if (this.refs.compositionContainer) {
      let dom = this.refs.compositionContainer.getDOMNode();
      while (dom.firstChild) {
        dom.removeChild(dom.firstChild);
      }
    }
  },

  componentDidUpdate() {
    let store = this.props.store;
    let selectingItem = store.selectingItem;

    // insert canvas into DOM
    if (selectingItem !== null
    &&  selectingItem instanceof Composition) {
      let _ = store.compositionFrameCache;
      let frameCache = (_ = _[selectingItem.id])?
                       (_ = _[store.currentFrame])? _ : null : null;

      let dom = this.refs.compositionContainer.getDOMNode();
      if (frameCache) {
        dom.appendChild(frameCache);
      }
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
            <video controls src={selectingItem.content} />
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
