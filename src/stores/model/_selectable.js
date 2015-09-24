"use strict";

export default class _Selectable {
  constructor(id) {
    if (this.constructor === _Selectable) {
      throw new TypeError("Abstract class cannot be instantiated directly.");
    }

    this.id = id;
  }
}
