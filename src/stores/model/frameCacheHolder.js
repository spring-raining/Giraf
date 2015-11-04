"use strict";

import _Lang                from "lodash/lang";

import _Renderable          from "src/stores/model/_renderable";
import ModelBase            from "src/stores/model/modelBase";
import {hasTrait}           from "src/utils/traitUtils";


class FrameCacheHolder extends ModelBase {
  constructor() {
    super();
    this._frameCache = {};
  }

  getFrameCache(target, frame) {
    let _ = this._frameCache[target.id];
    return (!_)? undefined : _[frame];
  }

  getAllFrameCache(target) {
    let _ = this._frameCache[target.id];
    return (!_)? {} : _Lang.clone(_);

  }

  addFrameCache(target, frame, renderedFrameCache) {
    if (!hasTrait(target, _Renderable)) {
      throw new Error("Cannot add an unrenderable frame.");
      return;
    }
    if (this._frameCache[target.id] === undefined) {
      let newValue = {};
      newValue[frame] = renderedFrameCache;
      super.assign(["_frameCache", target.id], newValue);
    }
    else {
      super.assign(["_frameCache", target.id, frame], renderedFrameCache);
    }
  }

  removeFrameCache(target, frame) {
    if (this.getFrameCache(target, frame)) {
      // Don't record removing history.
      delete this._frameCache[target.id][frame];
    }
  }
}

export default {
  FrameCacheHolder: FrameCacheHolder,
};
