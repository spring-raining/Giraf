"use strict";

import keyMirror from "keymirror";

const dragActionType = keyMirror({
  FOOTAGE: null,
  COMPOSITION: null,
  LAYER: null,
  UNKNOWN: null,
});

class DragAction {
  constructor(type, object) {
    if (!dragActionType[type]) {
      throw new TypeError(`Drag action type '${type}' is not defined.`);
    }
    Object.assign(this, {
      type, object
    });
  }
}

export default {
  DragAction: DragAction,
  DragActionType: dragActionType
};