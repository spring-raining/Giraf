"use strict";

import React                          from "react";

import GenUUID                        from "src/utils/genUUID";
import Actions                        from "src/actions/actions";
import {Composition}                  from "src/stores/model/composition";
import CreateCompositionModal         from "src/views/modal/createCompositionModal";


export default (() =>
  new Promise((resolve, reject) => {
    try {
      Actions.updateModal(
        React.createElement(CreateCompositionModal, {
          onCreateClicked: (composition) => {
            resolve(composition);
          }
        })
      );
    } catch (e) {
      reject(e);
    }
  })
);
