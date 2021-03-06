"use strict";

import _Array               from "lodash/array";
import _Math                from "lodash/math";
import _Object              from "lodash/object";
import _Utility             from "lodash/utility";

import Actions              from "src/actions/actions";
import _Selectable          from "src/stores/model/_selectable";
import _Renderable          from "src/stores/model/_renderable";
import ModelBase            from "src/stores/model/modelBase";
import Store                from "src/stores/store";
import {classWithTraits}    from "src/utils/traitUtils";


const Base = classWithTraits(ModelBase, _Selectable, _Renderable);

export class Composition extends Base {
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
    this._id = id;
    this._name = name;
    this._width = width;
    this._height = height;
    this._frame = frame;
    this._fps = fps;
    this._layers = [];

    this._prepareCanvas(width, height);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    super.assign("_name", name);
  }

  get width() {
    return this._width;
  }

  set width(width) {
    console.warn("Setting width directly is not recommended. Please use updateSize(width, height)");
    this.updateSize(width, this.height);
  }

  get height() {
    return this._height;
  }

  set height(height) {
    console.warn("Setting height directly is not recommended. Please use updateSize(width, height)");
    this.updateSize(this.width, height);
  }

  get frame() {
    return this._frame;
  }

  set frame(frame) {
    if (frame < this._frame) {
      Actions.clearFrameCache(this, _Utility.range(frame, this._frame));
    }
    Actions.updateCurrentFrame(
      Math.min(frame - 1, Store.get("currentFrame")));
    super.assign("_frame", frame);
  }

  get fps() {
    return this._fps;
  }

  set fps(fps) {
    super.assign("_fps", fps);
  }

  get layers() {
    return [].concat(this._layers);
  }

  set layers(layers) {
    layers.forEach((l) => {
      if (l.entity && (l.entity instanceof Composition)) {
        if (!this.checkCircularReference(l.entity)) {
          throw new Error("Cannot add a layer which causes circular reference.");
        }
      }
    });
    super.assign("_layers", layers);
  }

  getLength() {
    return this.frame;
  }

  getThumbnail() {
    const caches = Store.get("frameCache")
                       .getAllFrameCache(this);
    if (caches && Object.keys(caches).length > 0) {
      return caches[_Math.min(Object.keys(caches))];
    }
    else {
      return null;
    }
  }

  update(obj = {}, fireAction = true) {
    const obj_ = _Object.omit(obj, "width", "height");
    super.update(obj_);

    if (obj.width >= 1 || obj.height >= 1) {
      this.updateSize(
        (obj.width  >= 1)? obj.width  : this.width,
        (obj.height >= 1)? obj.height : this.height);
    }
    if (fireAction) {
      Actions.updateComposition(this, false);
    }
  }

  updateSize(width, height) {
    if (width !== this._width || height !== this._height) {
      super.assign("_width", width);
      super.assign("_height", height);
      Actions.clearFrameCache(this);
      this._prepareCanvas(width, height);
    }
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
        const _ = this.layers.filter((e) => e.solo);
        const renderingLayers = (_.length !== 0)
          ? _.filter((e) => e.visible)
          : this.layers.filter((e) => e.visible);

        Promise.all(
          renderingLayers.map((e) => e.capture(frame))
        ).then(
          (results) => {
            for (var i = renderingLayers.length - 1; i >= 0; i--) {
              let layer = renderingLayers[i];
              let cap = results[i];
              if (!cap) {
                continue;
              }
              let rad = layer.transform.rotation * Math.PI / 180;
              this.context.setTransform(
                layer.transform.scale.x * Math.cos(rad),
                layer.transform.scale.x * Math.sin(rad),
                layer.transform.scale.y * -Math.sin(rad),
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

  getChildrenCompId() {
    return _Array.flatten(
      this.layers.map((l) => {
        if (l.entity && (l.entity instanceof Composition)) {
          return l.entity
            .getChildrenCompId()
            .concat(l.entity.id);
        }
        else {
          return [];
        }
      })
    );
  }

  // If false, this composition cannot add the newComp as layer.
  checkCircularReference(newComp) {
    return newComp.getChildrenCompId()
      .concat(newComp.id)
      .indexOf(this.id) === -1;
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
