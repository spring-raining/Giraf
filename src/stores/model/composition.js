"use strict";

import Actions from "../../actions/actions";
import _Selectable from "./_selectable";
import {classWithTraits} from "../../utils/traitUtils";


class Composition extends classWithTraits(null, _Selectable) {
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
    super();
    Object.assign(this, {
      id, name, width, height, frame, fps
    });
    this.layers = [];
  }

  update(obj) {
    Actions.updateComposition(Object.assign(this, obj));
  }
}

export default {
  Composition: Composition,
};
