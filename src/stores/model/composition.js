"use strict";

import Actions from "../../actions/actions";
import _Selectable from "./_selectable";

class Composition extends _Selectable {
  /**
   *
   * @param {string} id
   * @param {string} name
   * @param {int} width
   * @param {int} height
   * @param {int} frame
   * @param {int} fps
   */
  constructor(id, name, width, height, frame, fps) {
    super(id);
    Object.assign(this, {
      name, width, height, frame, fps
    });
    this.layers = [];
  }

  update(obj) {
    object.assign(this, obj);
    Actions.updateComposition(this);
  }
}

export default Composition;
