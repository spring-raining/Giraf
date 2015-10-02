"use strict";

import { EventEmitter } from "events";

import Dispatcher from "../dispatcher";
import ActionConst from "../actions/const";
import GenUUID from "../utils/genUUID";
import FileLoader from "../utils/fileLoader";
import Access from "./access";
import File from "./model/file";

const CHANGE_EVENT = "change";

var _state = {
  files: [],
  compositions: [],
  idOfSelectingItem: null,
  dragging: null,
};

var Store = Object.assign({}, EventEmitter.prototype, {
  getAll: function() {
    return Object.assign(_state, {access: Access(_state)});
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

  const searchById = (list) => (id) => list.filter((e) => e.id === id)[0];

    if (action.actionType === ActionConst.IMPORT_FILE) {
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
    }

    else if (action.actionType === ActionConst.UPDATE_FILE) {
      if (searchById(_state.files)(action.file.id)) {
        _state.files = _state.files.map((e) => {
          return (e.id === action.file.id)? action.file : e;
        });
        Store.emitChange();
      }
    }

    else if (action.actionType === ActionConst.CHANGE_SELECTING_ITEM) {
      _state.idOfSelectingItem = (action.item)? action.item.id : null;
      Store.emitChange();
    }

    else if (action.actionType === ActionConst.CREATE_COMPOSITION) {
      _state.compositions.push(action.composition);
      Store.emitChange();
    }

    else if (action.actionType === ActionConst.UPDATE_COMPOSITION) {
      if (searchById(_state.compositions)(action.comopsition.id)) {
        _state.composiitons = _state.compositions.map((e) => {
          return (e.id === action.composition.id)? action.composition : e;
        });
        Store.emitChange();
      }
    }

    else if (action.actionType === ActionConst.CREATE_LAYER) {
      let comp = searchById(_state.compositions)(action.layer.parentCompId);
      if (comp) {
        comp.layers.splice(action.index, 0, action.layer);
        Store.emitChange();
      }
    }

    else if (action.actionType === ActionConst.UPDATE_LAYER) {
      let comp = searchById(_state.compositions)(action.layer.parentCompId);
      if (comp && searchById(comp.layers)(action.layer.id)) {
        comp.layers = comp.layers.map((e) => {
          return (e.id === action.layer.id)? action.layer : e;
        });
        Store.emitChange();
      }
    }

    else if (action.actionType === ActionConst.START_DRAG) {
      _state.dragging = action.dragAction;
      Store.emitChange();
    }

    else if (action.actionType === ActionConst.END_DRAG) {
      if (_state.dragging) {
        _state.dragging = null;
        Store.emitChange();
      }
    }
});

export default Store;