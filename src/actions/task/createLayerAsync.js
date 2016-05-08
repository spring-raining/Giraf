"use strict";

import React                          from "react";
import {defineMessages, FormattedMessage}
                                      from "react-intl";
import _Array                         from "lodash/array";

import Actions                        from "src/actions/actions";
import {Alert}                        from "src/stores/model/alert";
import {Composition}                  from "src/stores/model/composition";
import {Footage}                      from "src/stores/model/footage";
import {Layer}                        from "src/stores/model/layer";
import {Point}                        from "src/stores/model/point";
import {Transform}                    from "src/stores/model/transform"
import _Renderable                    from "src/stores/model/_renderable";
import genUUID                        from "src/utils/genUUID";
import {hasTrait}                     from "src/utils/traitUtils";
import CreateVideoLayerModal          from "src/views/modal/createVideoLayerModal";


const messages = defineMessages({
  alert_circular_reference: {
    id: "actions.task.create_layer_async.alert_circular_reference",
    defaultMessage: "Cannot add a layer which causes circular reference.",
  },
});

export default ((parentComp, entity = null) =>
  new Promise((resolve, reject) => {
    if (entity && (entity instanceof Footage)) {
      if (entity.isAnimatable()) {
        Actions.updateModal(
          React.createElement(CreateVideoLayerModal, {
            targetFootage: entity,
            parentComp: parentComp,
            onCancelClicked: () => {
              reject();
            },
            onCreateClicked: (e) => {
              resolve(e);
            },
          })
        );
      }
      else {
        resolve(new Layer(
          genUUID(),
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
          parentComp.frame,
          0,
          parentComp.frame
        ));
      }
    }
    else if (entity && (entity instanceof Composition)) {
      if (!parentComp.checkCircularReference(entity)) {
        const message = React.createElement(FormattedMessage, messages.alert_circular_reference);
        reject(new Alert(genUUID(), message));
      }
      else {
        resolve(new Layer(
          genUUID(),
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
        genUUID(),
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
  })
);
