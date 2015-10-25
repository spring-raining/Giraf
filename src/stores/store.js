"use strict";

import { EventEmitter }                       from "events";
import _Array                                 from "lodash/array";


const CHANGE_EVENT = "change";

const _state = {
  footages: [],
  compositions: [],
  selectingItem: null,
  editingComposition: null,
  editingLayer: null,
  dragging: null,
  currentFrame: null,
  compositionFrameCache: {},
  isPlaying: false,
};

const Store = Object.assign({}, EventEmitter.prototype, {

  _state: _state,

  get: function(...keys) {
    let flattenKeys = _Array.flatten(keys);
    let _ = this._state;
    flattenKeys.forEach((e) => {
      _ = (_ === undefined || _ === null)? _ : _[e];
    });
    return _;
  },

  getAll: function() {
    return this._state;
  },

  set: function(...keys) {
    return (value) => {
      let flattenKeys = _Array.flatten(keys);
      let _ = this._state;
      _Array.dropRight(flattenKeys).forEach((e) => {
        if (_[e] === undefined || _[e] === null) {
          _[e] = {};
        }
        _ = _[e];
      });
      _[_Array.last(flattenKeys)] = value;
    }
  },

  remove: function(...keys) {
    let flattenKeys = _Array.flatten(keys);
    let _ = this.get(_Array.dropRight(flattenKeys));
    if (_ === undefined || _ === null) {
      return;
    }
    delete _[_Array.last(flattenKeys)];
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
});

export default Store;
