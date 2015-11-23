"use strict";

import React                          from "react";

import Actions                        from "src/actions/actions";
import RenderGIFModal                 from "src/views/modal/renderGIFModal";


export default ((composition) =>
  new Promise((resolve, reject) => {
    try {
      Actions.updateModal(
        React.createElement(RenderGIFModal, {
          composition: composition,
          onCancelClicked: () => {
            reject("Creating GIF canceled.");
          },
          onDoneClicked: () => {
            resolve();
          },
        })
      );
    } catch (e) {
      reject(e);
    }
  })
);
