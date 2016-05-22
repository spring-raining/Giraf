"use strict";

import ModelBase            from "src/stores/model/modelBase";


export class Point extends ModelBase {
  constructor(points) {
    super();
    if (points.length === 2) {
      this._dimension = 2;
      this._x = points[0];
      this._y = points[1];
    }
    else {
      throw new TypeError("Invalid argument length.");
    }
  }
  
  get x() {
    return this._x;
  }

  set x(x) {
    super.assign("_x", x);
  }

  get y() {
    return this._y;
  }

  set y(y) {
    super.assign("_y", y);
  }
  
  get dimension() {
    return this._dimension;
  }

  get() {
    if (this.dimension === 2) {
      return [this.x, this.y];
    }
  }

  clone() {
    return new Point(this.get.bind(this)());
  }
}

export default {
  Point: Point,
};
