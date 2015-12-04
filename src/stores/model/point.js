"use strict";

import ModelBase            from "src/stores/model/modelBase";


class Point extends ModelBase {
  constructor(points) {
    super();
    if (points.length === 2) {
      this._value = points;
      this._x = points[0];
      this._y = points[1];
    }
    else {
      throw new TypeError("Invalid argument length.");
    }
  }

  get() {
    return [].concat(this._value);
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
}

export default {
  Point: Point,
};
