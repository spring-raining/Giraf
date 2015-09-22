"use strict";

import { EventEmitter } from "events";

import Dispatcher from "../dispatcher";
import ActionConst from "../actions/const";
import GenUUID from "../utils/genUUID";
import FileLoader from "../utils/fileLoader";
import File from "./model/file";

const CHANGE_EVENT = "change";

var _state = {
  files: [],
};

var Store = Object.assign({}, EventEmitter.prototype, {
  getAll: function() {
    return _state;
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

Dispatcher.register((action) => {
  switch (action.actionType) {
    case ActionConst.IMPORT_FILE:
      action.file.forEach((e) => {
        let f = new File(GenUUID(), e.name, e.size, e.type);
        if (FileLoader.check(f)) {
          _state.files.push(f);
          FileLoader.run(f, e);
        }
        else {
          console.warn("File load failed : " + e.name);
        }
      });
      Store.emitChange();
      break;

    case ActionConst.UPDATE_FILE:
      if (_state.files.map((e) => e.id).indexOf(action.file.id) >= 0) {
        _state.files = _state.files.map((e) => {
          return (e.id === action.file.id)? action.file : e;
        });
        Store.emitChange();
      }
      break;
  }
});

export default Store;