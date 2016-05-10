"use strict";

import _Array                     from "lodash/array";
import _Lang                      from "lodash/lang";

import {init as initHistory}      from "src/stores/history";
import ModelBase                  from "src/stores/model/modelBase";
import {FrameCacheHolder}         from "src/stores/model/frameCacheHolder";


export class State extends ModelBase {
  constructor() {
    super();

    this._activeItem = null;
    this._compositions = [];
    this._currentFrame = 0;
    this._dragging = null;
    this._expandingMenuId = null;
    this._footages = [];
    this._frameCache = new FrameCacheHolder();
    this._isPlaying = false;
    this._modal = null;
    this._alerts = [];
    this._selectingItem = null;
  }

  get activeItem() {
    return this._activeItem;
  }

  set activeItem(activeItem) {
    super.assign("_activeItem", activeItem);
  }

  get alerts() {
    return [].concat(this._alerts);
  }

  set alerts(alerts) {
    super.assign("_alerts", alerts);
  }

  get compositions() {
    return [].concat(this._compositions);
  }

  set compositions(compositions) {
    super.assign("_compositions", compositions);
  }

  get currentFrame() {
    return this._currentFrame;
  }

  set currentFrame(currentFrame) {
    super.assign("_currentFrame", currentFrame);
  }

  get dragging() {
    return this._dragging;
  }

  set dragging(dragging) {
    super.assign("_dragging", dragging);
  }

  get expandingMenuId() {
    return this._expandingMenuId;
  }

  set expandingMenuId(expandingMenuId) {
    super.assign("_expandingMenuId", expandingMenuId);
  }

  get footages() {
    return [].concat(this._footages);
  }

  set footages(footages) {
    super.assign("_footages", footages);
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

  get modal() {
    return this._modal;
  }

  set modal(modal) {
    super.assign("_modal", modal);
  }

  get selectingItem() {
    return this._selectingItem;
  }

  set selectingItem(selectingItem) {
    super.assign("_selectingItem", selectingItem);
  }
}

export default {
  State: State,
};
