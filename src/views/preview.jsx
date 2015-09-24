"use strict";

import React from "react";

import File from "../stores/model/file";

class Preview extends React.Component {
  render() {
    let selectedItem = this.props.store.access.getSelectedItem();
    let previewContainer;
    if (selectedItem === null) {
      previewContainer = <div className="preview__container none"></div>;
    }
    else if (selectedItem instanceof File) {
      console.log(selectedItem);
      if (selectedItem.type.indexOf("image/") === 0) {
        previewContainer =
          <div className="preview__container file image">
            <img src={selectedItem.content} />
          </div>;
      }
      else if(selectedItem.type.indexOf("video/") === 0) {
        previewContainer =
          <div className="preview__container file video">
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
