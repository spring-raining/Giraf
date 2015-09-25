"use strict";

import Actions from "../../actions/actions";
import _Selectable from "./_selectable";

class Layer extends _Selectable {
  constructor(id, name, parentComp, target, effect, start, end) {
    super(id);
    Object.assign(this, {
      name, parentComp, target, effect
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
    object.assign(this, obj);
    Actions.updateComposition(this);
  }
}

export default Layer;
