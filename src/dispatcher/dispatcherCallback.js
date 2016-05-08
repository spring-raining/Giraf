"use strict";

import { EventEmitter } from "events";

import ActionConst          from "src/actions/const";
import FileLoader           from "src/utils/fileLoader";
import History              from "src/stores/history";
import Store                from "src/stores/store";
import {Footage}            from "src/stores/model/footage";


function dispatcherCallback(action) {

  const searchById = (list) => (id) => list.filter((e) => e.id === id)[0];

  if (action.actionType === ActionConst.IMPORT_FILE) {
    Store.push("footages")(action.footage);
    History.save(action.actionType, false);
    Store.emitChange();
  }

  else if (action.actionType === ActionConst.UPDATE_FOOTAGE) {
    if (searchById(Store.get("footages"))(action.footage.id)) {
      Store.set("footages")(Store.get("footages").map((e) => {
        return (e.id === action.footage.id)? action.footage : e;
      }));
      Store.emitChange();
    }
  }

  else if (action.actionType === ActionConst.CHANGE_SELECTING_ITEM) {
    Store.set("selectingItem")(action.item);
    Store.set("isPlaying")(false);
    Store.emitChange();
  }

  else if (action.actionType === ActionConst.CHANGE_ACTIVE_ITEM) {
    Store.set("activeItem")(action.item);
    Store.set("isPlaying")(false);
    Store.emitChange();
  }

  else if (action.actionType === ActionConst.CREATE_COMPOSITION) {
    Store.push("compositions")(action.composition);
    Store.update({
      selectingItem: action.composition,
      activeItem: action.composition,
      isPlaying: false,
    });
    History.save(action.actionType, false);
    Store.emitChange();
  }

  else if (action.actionType === ActionConst.UPDATE_COMPOSITION) {
    if (searchById(Store.get("compositions"))(action.composition.id)) {
      Store.set("compositions")(Store.get("compositions").map((e) => {
        return (e.id === action.composition.id)? action.composition : e;
      }));
      Store.update({
        activeItem: action.composition,
        isPlaying: false,
      });
      History.save(action.actionType, false);
      Store.emitChange();
    }
  }

  else if (action.actionType === ActionConst.CREATE_LAYER) {
    let comp = searchById(Store.get("compositions"))(action.layer.parentCompId);
    if (comp) {
      comp.layers = [action.layer].concat(comp.layers);
      Store.update({
        selectingItem: action.layer,
        activeItem: comp,
        isPlaying: false,
      });
      History.save(action.actionType, false);
      Store.emitChange();
    }
  }

  else if (action.actionType === ActionConst.UPDATE_LAYER) {
    let comp = searchById(Store.get("compositions"))(action.layer.parentCompId);
    if (comp && searchById(comp.layers)(action.layer.id)) {
      comp.layers = comp.layers.map((e) => {
        return (e.id === action.layer.id)? action.layer : e;
      });
      Store.update({
        selectingItem: action.layer,
        activeItem: comp,
        isPlaying: false,
      });
      History.save(action.actionType, false);
      Store.emitChange();
    }
  }

  else if (action.actionType === ActionConst.DELETE_LAYER) {
    const comp = searchById(Store.get("compositions"))(action.layer.parentCompId);
    if (comp && searchById(comp.layers)(action.layer.id)) {
      comp.layers = comp.layers.filter((e) => e.id !== action.layer.id);
      Store.update({
        selectingItem: null,
        activeItem: comp,
        isPlaying: false,
      });
      History.save(action.actionType, false);
      Store.emitChange();
    }
  }

  else if (action.actionType === ActionConst.START_DRAG) {
    Store.set("dragging")(action.dragAction);
    Store.emitChange();
  }

  else if (action.actionType === ActionConst.END_DRAG) {
    if (Store.get("dragging")) {
      Store.set("dragging")(null);
      Store.emitChange();
    }
  }

  else if (action.actionType === ActionConst.UPDATE_CURRENT_FRAME) {
    if (Store.get("currentFrame") !== action.currentFrame) {
      Store.set("currentFrame")(action.currentFrame);
      Store.emitChange();
    }
  }

  else if (action.actionType === ActionConst.RENDER_FRAME) {
    Store.get("frameCache")
         .addFrameCache(action.composition, action.frame, action.canvas);
    Store.emitChange();
  }

  else if (action.actionType === ActionConst.CLEAR_FRAME_CACHE) {
    action.frames.forEach((e) => {
      Store.get("frameCache")
           .removeFrameCache(action.composition, e);
    });
    Store.emitChange();
  }

  else if (action.actionType === ActionConst.PLAY) {
    if (action.play !== Store.get("isPlaying")) {
      Store.set("isPlaying")(action.play);
      Store.emitChange();
    }
  }

  else if (action.actionType === ActionConst.UNDO) {
    for (let i = 0; i < action.repeat; i++) {
      History.undo();
    }
    Store.emitChange();
  }

  else if (action.actionType === ActionConst.REDO) {
    for (let i = 0; i < action.repeat; i++) {
      History.redo();
    }
    Store.emitChange();
  }

  else if (action.actionType === ActionConst.UPDATE_EXPANDING_MENU_ID) {
    Store.update({
      expandingMenuId: action.id,
    });
    Store.emitChange();
  }

  else if (action.actionType === ActionConst.UPDATE_MODAL) {
    Store.update({
      modal: action.modal,
    });
    Store.emitChange();
  }

  else if (action.actionType === ActionConst.PUSH_ALERT) {
    Store.push("alerts")(action.alert);
    Store.emitChange();
  }

  else if (action.actionType === ActionConst.DELETE_ALERT) {
    const newAlerts = Store.get("alerts")
      .filter((e) => e.id !== action.alert.id);
    Store.set("alerts")(newAlerts);
    Store.emitChange();
  }
}

export default dispatcherCallback;
