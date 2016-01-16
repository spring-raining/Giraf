"use strict";

import _Array                                 from "lodash/array";
import _Lang                                  from "lodash/lang";

import History                                from "src/stores/history";


class ModelBase {
  constructor() {

  }

  update(obj) {
    for (let k of Object.keys(obj)) {
      this[k] = obj[k];
    }
  }

  assign(key, value) {
    const wrap = (k, v) => {
      const ret = {};
      ret[k[0]] = (k.length <= 1)? v : wrap (k.slice(1), v);
      return ret;
    };

    const keys = (Array.isArray(key))? _Array.flatten(key) : [key];
    let target = this;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!_Lang.isObject(target[k])) {
        let newValue = wrap(keys.slice(i + 1), value);
        History.recordNewDiff(this, keys.slice(0, i + 1), newValue);
        target[k] = newValue;
        return;
      }
      target = target[k];
    }
    const lastKey = _Array.last(keys);
    const trimmedKeys = _Array.dropRight(keys);
    if (typeof target[lastKey] === "undefined") {
      if (typeof value !== "undefined") {
        if (Array.isArray(target)) {
          History.recordNewOnArrayDiff(this, trimmedKeys, lastKey, value);
        }
        else {
          History.recordNewDiff(this, keys, value);
        }
      }
      target[lastKey] = value;
    }
    else {
      if (Array.isArray(target[lastKey]) && Array.isArray(value)) {
        let i;
        for (i = 0; i < value.length; i++) {
          if (typeof target[lastKey][i] === "undefined") {
            History.recordNewOnArrayDiff(this, keys, i, value[i]);
          } else {
            History.recordEditDiff(this, keys.concat(i), target[lastKey][i], value[i]);
          }
        }
        while (i < target[lastKey].length) {
          History.recordDeleteOnArrayDiff(this, keys, i, target[lastKey][i]);
          i += 1;
        }
      }
      else {
        if (typeof value === "undefined") {
          History.recordDeleteDiff(this, keys, target[lastKey]);
        }
        else {
          History.recordEditDiff(this, keys, target[lastKey], value);
        }
      }
      target[_Array.last(keys)] = value;
    }
  }
}

export default ModelBase;
