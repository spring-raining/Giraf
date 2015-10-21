"use strict";


class Point {
  constructor(points) {
    if (points.length === 2) {
      this.value = points;
      this.x = points[0];
      this.y = points[1];
    }
    else {
      throw new TypeError("Invalid argument length.");
    }
  }

  get() {
    return this.value;
  }
}

export default {
  Point: Point,
};
