"use strict";

import GenUUID                        from "src/utils/genUUID";
import {Layer}                        from "src/stores/model/layer";
import {Point}                        from "src/stores/model/point";
import {Transform}                    from "src/stores/model/transform"
import _Renderable                    from "src/stores/model/_renderable";
import {hasTrait}                     from "src/utils/traitUtils";


export default ((parentComp, entity) =>
  new Promise((resolve, reject) => {
    try {
      if (entity && hasTrait(entity, _Renderable)) {
        resolve(new Layer(
          GenUUID(),
          entity.name,
          parentComp.id,
          entity,
          new Transform(
            new Point([0, 0]),
            new Point([parentComp.width/2, parentComp.height/2]),
            new Point([1, 1]),
            0,
            1),
          0,
          parentComp.frame));
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
