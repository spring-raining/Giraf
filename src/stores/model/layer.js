"use strict";

import keyMirror                      from "keymirror";

import Actions                        from "src/actions/actions";
import {Composition}                  from "src/stores/model/composition";
import {Footage}                      from "src/stores/model/footage";
import _Selectable                    from "src/stores/model/_selectable";
import _Renderable                    from "src/stores/model/_renderable";
import ModelBase                      from "src/stores/model/modelBase";
import {classWithTraits, hasTrait}    from "src/utils/traitUtils";


const Base = classWithTraits(ModelBase, _Selectable);

const LayerKinds = keyMirror({
  UNKNOWN: null,
  STILL: null,
  ANIMATED: null,
});

class Layer extends Base {
  /**
   *
   * @param {string} id
   * @param {string} name
   * @param {string} parentCompId
   * @param {_Renderable} entity
   * @param {Transform} transform
   * @param {int} start
   * @param {int} end
   */
  constructor(id, name, parentCompId, entity, transform, start, end) {
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
        if (!this.entity
          || !hasTrait(this.entity, _Renderable)
          || frame < this.layerStart
          || frame >= this.layerEnd
        ) {
          resolve(null);
        }

        let r = this.entityEnd - this.entityStart;
        let f = (frame + (r - (this.entityStart % r))) % r;
        this.entity.render(f).then(
          (result) => {
            resolve(result);
          },
          (error) => { throw error });
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
