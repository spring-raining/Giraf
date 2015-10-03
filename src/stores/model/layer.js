"use strict";

import Actions            from "src/actions/actions";
import _Selectable        from "src/stores/model/_selectable";
import {classWithTraits}  from "src/utils/traitUtils";


class Layer extends classWithTraits(null, _Selectable) {
  constructor(id, name, parentCompId, entity, effect, start, end) {
    super();
    Object.assign(this, {
      id, name, parentCompId, entity, effect
    });
    this.layerStart = start;
    this.layerEnd = end;
    this.entityStart = start;
    this.entityEnd = end;
    this.visible = true;
    this.solo = false;
    this.repeatBefore = false;
    this.repeatAfter = false;
  }

  update(obj) {
    Actions.updateLayer(Object.assign(this, obj));
  }
}

export default {
  Layer: Layer,
};
