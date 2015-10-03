"use strict";

import React                      from "react";

import {Footage, FootageKinds}    from "src/stores/model/footage";


class Preview extends React.Component {
  render() {
    let selectedItem = this.props.store.access.getSelectedItem();
    let previewContainer;
    if (selectedItem === null) {
      previewContainer = <div className="preview__container none"></div>;
    }
    else if (selectedItem instanceof Footage) {
      if (selectedItem.getFootageKind() === FootageKinds.IMAGE) {
        previewContainer =
          <div className="preview__container footage image">
            <img src={selectedItem.content} />
          </div>;
      }
      else if (selectedItem.getFootageKind() === FootageKinds.VIDEO) {
        previewContainer =
          <div className="preview__container footage video">
            <video controls src={selectedItem.content} />
          </div>;
      }
    }

    return <section className="preview panel">
      {previewContainer}
    </section>;
  }
}

export default Preview;
