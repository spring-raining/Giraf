"use strict";

import Actions              from "src/actions/actions";
import _Selectable          from "src/stores/model/_selectable";
import _Renderable          from "src/stores/model/_renderable";
import {classWithTraits}    from "src/utils/traitUtils";


const Base = classWithTraits(null, _Selectable, _Renderable);

class Composition extends Base {
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
    this._prepareCanvas(width, height);
  }

  update(obj) {
    Object.assign(this, obj);
    if (obj.width > 0 && obj.height > 0) {
      this._prepareCanvas(obj.width, obj.height);
    }
    Actions.updateComposition(this);
  }

  render(frame) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.canvas) {
          throw Error("Canvas not created.");
        }

        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.globalAlpha = 1;
        this.context.clearRect(0, 0, this.width, this.height);
        Promise.all(
          this.layers.map((e) => e.capture(frame))
        ).then(
          (results) => {
            for (var i = this.layers.length - 1; i >= 0; i--) {
              let layer = this.layers[i];
              let cap = results[i];
              if (!cap) {
                continue;
              }
              let rad = layer.transform.rotation * Math.PI / 180;
              this.context.setTransform(
                layer.transform.scale.x * Math.cos(rad),
                Math.sin(rad),
                -Math.sin(rad),
                layer.transform.scale.y * Math.cos(rad),
                layer.transform.position.x,
                layer.transform.position.y);
              this.context.globalAlpha = layer.transform.opacity;
              this.context.drawImage(
                cap,
                -layer.transform.anchorPoint.x,
                -layer.transform.anchorPoint.y);
            }
            resolve(this.canvas);
          },
          (error) => { throw error });
      } catch (e) {
        reject(e);
      }
    });
  }

  _prepareCanvas(width, height) {
    return new Promise((resolve, reject) => {
      try {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
        resolve(this.canvas);
      } catch (e) {
        reject(e);
      }
    });
  }
}

export default {
  Composition: Composition,
};
