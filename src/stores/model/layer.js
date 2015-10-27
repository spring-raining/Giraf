"use strict";

import Actions                        from "src/actions/actions";
import Composition                    from "src/stores/model/composition";
import Footage                        from "src/stores/model/footage";
import _Selectable                    from "src/stores/model/_selectable";
import _Renderable                    from "src/stores/model/_renderable";
import {classWithTraits, hasTrait}    from "src/utils/traitUtils";


const Base = classWithTraits(null, _Selectable);

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

  isAnimatable() {
    return this.entity instanceof Composition
        || (this.entity instanceof Footage && this.entity.isAnimatable());
  }

  update(obj) {
    Actions.updateLayer(Object.assign(this, obj));
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

        let r = this.layerEnd - this.layerStart;
        let f = (frame + (r - (this.layerStart % r))) % r;
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
};
