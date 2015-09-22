"use strict";

import { EventEmitter } from "events";

import Dispatcher from "../dispatcher";
import ActionConst from "../actions/const";
import GenUUID from "../utils/genUUID";
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
        _state.files.push(new File(GenUUID(), e.name, e.size, e.type));
      });
      Store.emitChange();
      break;
  }
});

export default Store;