"use strict";

import ModelBase            from "src/stores/model/modelBase";


export class Transform extends ModelBase {
  /**
   *
   * @param {Point} anchorPoint
   * @param {Point} position
   * @param {Point} scale
   * @param {int} rotation
   * @param {int} opacity
   */
  constructor(anchorPoint, position, scale, rotation, opacity) {
    super();
    this._anchorPoint = anchorPoint;
    this._position = position;
    this._scale = scale;
    this._rotation = rotation;
    this._opacity = opacity;
  }

  get anchorPoint() {
    return this._anchorPoint;
  }

  set anchorPoint(anchorPoint) {
    super.assign("_anchorPoint", anchorPoint);
  }

  get position() {
    return this._position;
  }

  set position(position) {
    super.assign("_position", position);
  }

  get scale() {
    return this._scale;
  }

  set scale(scale) {
    super.assign("_scale", scale);
  }

  get rotation() {
    return this._rotation;
  }

  set rotation(rotation) {
    super.assign("_rotation", rotation);
  }

  get opacity() {
    return this._opacity;
  }

  set opacity(opacity) {
    super.assign("_opacity", opacity);
  }
}

export default {
  Transform: Transform,
};
