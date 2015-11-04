"use strict";

import { EventEmitter }                       from "events";
import _Array                                 from "lodash/array";
import _Lang                                  from "lodash/lang";

import History                                from "src/stores/history";
import {State}                                from "src/stores/model/state";


const CHANGE_EVENT = "change";

const Store = Object.assign({}, EventEmitter.prototype, {

  _state: new State(),

  _history: {
    change: [],
    commitStack: [],
    revertStack: [],
  },

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

  push: function(...keys) {
    return (...values) => {
      let flattenKeys = _Array.flatten(keys);
      let lastKey = _Array.last(flattenKeys);
      let target = this.get(_Array.dropRight(flattenKeys));
      target[lastKey] = target[lastKey].concat(values);
    };
  },

  set: function(...keys) {
    return (value) => {
      let flattenKeys = _Array.flatten(keys);
      let lastKey = _Array.last(flattenKeys);
      let target = this.get(_Array.dropRight(flattenKeys));
      target[lastKey] = value;
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

  save: function(actionType, actionParam) {

  },

  undo: function() {

  },

  redo: function() {

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
