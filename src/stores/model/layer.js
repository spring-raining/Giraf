"use strict";

import keyMirror                      from "keymirror";

import Actions                        from "src/actions/actions";
import {Composition}                  from "src/stores/model/composition";
import {Footage}                      from "src/stores/model/footage";
import _Selectable                    from "src/stores/model/_selectable";
import _Renderable                    from "src/stores/model/_renderable";
import ModelBase                      from "src/stores/model/modelBase";
import {Script}                       from "src/stores/model/script";
import {classWithTraits, hasTrait}    from "src/utils/traitUtils";


const Base = classWithTraits(ModelBase, _Selectable);

export const LayerKinds = keyMirror({
  UNKNOWN: null,
  STILL: null,
  ANIMATED: null,
});

export class Layer extends Base {
  /**
   *
   * @param {string} id
   * @param {string} name
   * @param {string} parentCompId
   * @param {_Renderable} entity
   * @param {Transform} transform
   * @param {int} start
   * @param {int} end
   * @param {number} sourceStart
   * @param {number} sourceEnd
   */
  constructor(id,
              name,
              parentCompId,
              entity,
              transform,
              start,
              end,
              sourceStart = null,
              sourceEnd = null) {
    super();
    this._id = id;
    this._name = name;
    this._parentCompId = parentCompId;
    this._entity = entity;
    this._transform = transform;
    this._layerStart = start;
    this._layerEnd = end;
    this._entityStart = start;
    this._entityEnd = end;
    this._visible = true;
    this._solo = false;
    this._repeatBefore = false;
    this._repeatAfter = false;
    this._script = new Script("");
    this._sourceStart = sourceStart;
    this._sourceEnd = sourceEnd;
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

  get parentCompId() {
    return this._parentCompId;
  }

  get entity() {
    return this._entity;
  }

  get transform() {
    return this._transform;
  }

  get layerStart() {
    return this._layerStart;
  }

  set layerStart(layerStart) {
    super.assign("_layerStart", layerStart);
  }

  get layerEnd() {
    return this._layerEnd;
  }

  set layerEnd(layerEnd) {
    super.assign("_layerEnd", layerEnd);
  }

  get entityStart() {
    return this._entityStart;
  }

  set entityStart(entityStart) {
    super.assign("_entityStart", entityStart);
  }

  get entityEnd() {
    return this._entityEnd;
  }

  set entityEnd(entityEnd) {
    super.assign("_entityEnd", entityEnd);
  }

  get visible() {
    return this._visible;
  }

  set visible(visible) {
    super.assign("_visible", visible);
  }

  get solo() {
    return this._solo;
  }

  set solo(solo) {
    super.assign("_solo", solo);
  }

  get repeatBefore() {
    return this._repeatBefore;
  }

  set repeatBefore(repeatBefore) {
    super.assign("_repeatBefore", repeatBefore);
  }

  get repeatAfter() {
    return this._repeatAfter;
  }

  set repeatAfter(repeatAfter) {
    super.assign("_repeatAfter", repeatAfter);
  }

  get scriptString() {
    return this._script.scriptString;
  }

  set scriptString(script) {
    this._script.scriptString = script;
  }

  get sourceStart() {
    return this._sourceStart;
  }

  set sourceStart(sourceStart) {
    super.assign("_sourceStart", sourceStart);
  }

  get sourceEnd() {
    return this._sourceEnd;
  }

  set sourceEnd(sourceEnd) {
    super.assign("_sourceEnd", sourceEnd);
  }

  getLayerKind() {
    if ((this.entity instanceof Footage && this.entity.isAnimatable())
    ||  this.entity instanceof Composition) {
      return LayerKinds.ANIMATED;
    }
    else if (this.entity instanceof Footage && !this.entity.isAnimatable()
         ||  !this.entity) {
      return LayerKinds.STILL;
    }
    else {
      return LayerKinds.UNKNOWN;
    }
  }

  update(obj = {}, fireAction = true) {
    super.update(obj);
    if (fireAction) {
      Actions.updateLayer(this);
    }
  }

  capture(frame) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.entity || !hasTrait(this.entity, _Renderable)) {
          resolve(null);
        }

        const start = (this.repeatBefore)? this.layerStart : this.entityStart;
        const end = (this.repeatAfter)? this.layerEnd : this.entityEnd;
        if (frame < start || frame >= end) {
          resolve(null);
        }

        const entityLength = this.entityEnd - this.entityStart;
        const f = (frame + (entityLength - (this.entityStart % entityLength))) % entityLength;
        const sourceFrame = this.sourceStart + (f / entityLength) * (this.sourceEnd - this.sourceStart);
        this.entity.render(sourceFrame).then(
          (canvas) => {
            const context = canvas.getContext("2d");
            const srcImageData = context.getImageData(0, 0,
                                                      this.entity.width,
                                                      this.entity.height);
            this._script.runAsync(srcImageData).then(
              (dstImageData) => {
                context.putImageData(dstImageData, 0, 0);
                resolve(canvas);
              },
              (error) => { throw error; }
            );
          },
          (error)  => { throw error }
        );
      } catch (e) {
        reject(e);
      }
    });
  }
}

export default {
  Layer: Layer,
  LayerKinds: LayerKinds,
};
