"use strict";

import keyMirror                      from "keymirror";

import Actions                        from "src/actions/actions";
import {Composition}                  from "src/stores/model/composition";
import {Footage}                      from "src/stores/model/footage";
import _Selectable                    from "src/stores/model/_selectable";
import _Renderable                    from "src/stores/model/_renderable";
import {classWithTraits, hasTrait}    from "src/utils/traitUtils";


const Base = classWithTraits(null, _Selectable);

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
    Object.assign(this, {
      id, name, parentCompId, entity, transform
    });
    this.layerStart = start;
    this.layerEnd = end;
    this.entityStart = start;
    this.entityEnd = end;
    this.visible = true;
    this.solo = false;
    this.repeatBefore = false;
    this.repeatAfter = false;
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

  update(obj, fireAction = true) {
    Object.assign(this, obj);
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
