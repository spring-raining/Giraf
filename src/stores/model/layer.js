"use strict";

import Actions from "../../actions/actions";
import _Selectable from "./_selectable";

class Layer extends _Selectable {
  constructor(id, name, parentCompId, footage, effect, start, end) {
    super(id);
    Object.assign(this, {
      name, parentCompId, footage, effect
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

export default Layer;
