"use strict";

import React                      from "react";

import {Footage, FootageKinds}    from "src/stores/model/footage";
import {Composition}              from "src/stores/model/composition";


var Preview = React.createClass({
  componentDidUpdate() {
    let store = this.props.store;
    let selectedItem = store.access.getSelectedItem();

    // insert canvas into DOM
    if (selectedItem instanceof Composition) {
      let _ = store.compositionFrameCache;
      let frameCache = (_ = _[selectedItem.id])?
                       (_ = _[store.currentFrame])? _ : null : null;

      let dom = this.refs.compositionContainer.getDOMNode();
      while (dom.firstChild) {
        dom.removeChild(dom.firstChild);
      }
      if (frameCache) {
        dom.appendChild(frameCache);
      }
    }
  },

  render() {
    let selectedItem = this.props.store.access.getSelectedItem();
    let previewContainer;
    if (selectedItem === null) {
      previewContainer = <div className="preview__container none"></div>;
    }
    else if (selectedItem instanceof Footage) {
      if (selectedItem.getFootageKind() === FootageKinds.IMAGE) {
        previewContainer =
          <div className="preview__container preview__footage">
            <img src={selectedItem.content} />
          </div>;
      }
      else if (selectedItem.getFootageKind() === FootageKinds.VIDEO) {
        previewContainer =
          <div className="preview__container preview__footage">
            <video controls src={selectedItem.content} />
          </div>;
      }
    }
    else if (selectedItem instanceof Composition) {
      previewContainer =
        <div className="preview__container composition"
             ref="compositionContainer"></div>;
    }

    return <section className="preview panel">
      {previewContainer}
    </section>;
  },
});

export default Preview;
