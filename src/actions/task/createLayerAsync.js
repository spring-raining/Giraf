"use strict";

import React                          from "react";
import _Array                         from "lodash/array";

import Actions                        from "src/actions/actions";
import {Composition}                  from "src/stores/model/composition";
import {Footage}                      from "src/stores/model/footage";
import {Layer}                        from "src/stores/model/layer";
import {Point}                        from "src/stores/model/point";
import {Transform}                    from "src/stores/model/transform"
import _Renderable                    from "src/stores/model/_renderable";
import GenUUID                        from "src/utils/genUUID";
import {hasTrait}                     from "src/utils/traitUtils";
import CreateVideoLayerModal          from "src/views/modal/createVideoLayerModal";


export default ((parentComp, entity = null) =>
  new Promise((resolve, reject) => {
    try {
      if (entity && (entity instanceof Footage)) {
        Actions.updateModal(
          React.createElement(CreateVideoLayerModal, {
            targetFootage: entity,
            parentComp: parentComp,
            onCancelClicked: () => {
              reject("Creating layer canceled.");
            },
            onCreateClicked: (e) => {
              resolve(e);
            },
          })
        );
      }
      else if (entity && (entity instanceof Composition)) {
        if (!parentComp.checkCircularReference(entity)) {
          reject("Cannot add a layer which causes circular reference.");
        }
        else {
          resolve(new Layer(
            GenUUID(),
            entity.name,
            parentComp.id,
            entity,
            new Transform(
              new Point([entity.width / 2, entity.height / 2]),
              new Point([parentComp.width / 2, parentComp.height / 2]),
              new Point([1, 1]),
              0,
              1),
            0,
            entity.frame,
            0,
            entity.frame
          ));
        }
      }
      else {
        resolve(new Layer(
          GenUUID(),
          "new layer",
          parentComp.id,
          null,
          new Transform(
            new Point([0, 0]),
            new Point([0, 0]),
            new Point([1, 1]),
            0,
            1),
          0,
          parentComp.frame));
      }
    } catch (e) {
      reject(e);
    }
  })
);
