"use strict";

import keyMirror from "keymirror";

export const DragActionType = keyMirror({
  FOOTAGE: null,
  COMPOSITION: null,
  LAYER: null,
  UNKNOWN: null,
});

export class DragAction {
  constructor(type, object) {
    if (!DragActionType[type]) {
      throw new TypeError(`Drag action type '${type}' is not defined.`);
    }
    Object.assign(this, {
      type, object
    });
  }
}

export default {
  DragAction: DragAction,
  DragActionType: DragActionType
};