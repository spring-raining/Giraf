"use strict";

class Transform {
  /**
   *
   * @param {Point} anchorPoint
   * @param {Point} position
   * @param {Point} scale
   * @param {int} rotation
   * @param {int} opacity
   */
  constructor(anchorPoint, position, scale, rotation, opacity) {
    Object.assign(this, {
      anchorPoint, position, scale, rotation, opacity
    });
  }
}

export default {
  Transform: Transform,
};
