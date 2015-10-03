"use strict";

import { EventEmitter } from "events";

import Dispatcher           from "src/dispatcher";
import ActionConst          from "src/actions/const";
import GenUUID              from "src/utils/genUUID";
import FileLoader           from "src/utils/fileLoader";
import Access               from "src/stores/access";
import {Footage}            from "src/stores/model/footage";


const CHANGE_EVENT = "change";

var _state = {
  footages: [],
  compositions: [],
  idOfSelectingItem: null,
  dragging: null,
  currentFrame: null,
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
        let f = new Footage(GenUUID(), e.name, e.size, e.type);
        if (FileLoader.check(f)) {
          _state.footages.push(f);
          FileLoader.run(f, e);
        }
        else {
          console.warn("File load failed : " + e.name);
        }
      });
      Store.emitChange();
    }

    else if (action.actionType === ActionConst.UPDATE_FOOTAGE) {
      if (searchById(_state.footages)(action.footage.id)) {
        _state.footages = _state.footages.map((e) => {
          return (e.id === action.footage.id)? action.footage : e;
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
        _state.compositions = _state.compositions.map((e) => {
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

    else if (action.actionType === ActionConst.UPDATE_CURRENT_FRAME) {
      if (_state.currentFrame !== action.currentFrame) {
        _state.currentFrame = action.currentFrame;
        Store.emitChange();
      }
    }
});

export default Store;