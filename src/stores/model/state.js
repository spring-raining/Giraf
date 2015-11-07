"use strict";

import _Array                     from "lodash/array";
import _Lang                      from "lodash/lang";

import {init as initHistory}      from "src/stores/history";
import ModelBase                  from "src/stores/model/modelBase";
import {FrameCacheHolder}         from "src/stores/model/frameCacheHolder";


class State extends ModelBase {
  constructor() {
    super();

    this._footages = [];
    this._compositions = [];
    this._selectingItem = null;
    this._editingComposition = null;
    this._editingLayer = null;
    this._dragging = null;
    this._currentFrame = null;
    this._frameCache = new FrameCacheHolder();
    this._isPlaying = false;
    this._expandingMenuId = null;
    this._modal = null;
  }

  get footages() {
    return [].concat(this._footages);
  }

  set footages(footages) {
    super.assign("_footages", footages);
  }

  get compositions() {
    return [].concat(this._compositions);
  }

  set compositions(compositions) {
    super.assign("_compositions", compositions);
  }

  get selectingItem() {
    return this._selectingItem;
  }

  set selectingItem(selectingItem) {
    super.assign("_selectingItem", selectingItem);
  }

  get editingComposition() {
    return this._editingComposition;
  }

  set editingComposition(editingComposition) {
    super.assign("_editingComposition", editingComposition);
  }

  get editingLayer() {
    return this._editingLayer;
  }

  set editingLayer(editingLayer) {
    super.assign("_editingLayer", editingLayer);
  }

  get dragging() {
    return this._dragging;
  }

  set dragging(dragging) {
    super.assign("_dragging", dragging);
  }

  get currentFrame() {
    return this._currentFrame;
  }

  set currentFrame(currentFrame) {
    super.assign("_currentFrame", currentFrame);
  }

  get frameCache() {
    return this._frameCache;
  }

  get isPlaying() {
    return this._isPlaying;
  }

  set isPlaying(isPlaying) {
    super.assign("_isPlaying", isPlaying);
  }

  get expandingMenuId() {
    return this._expandingMenuId;
  }

  set expandingMenuId(expandingMenuId) {
    super.assign("_expandingMenuId", expandingMenuId);
  }

  get modal() {
    return this._modal;
  }

  set modal(modal) {
    super.assign("_modal", modal);
  }
}

export default {
  State: State,
};
