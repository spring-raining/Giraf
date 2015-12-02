"use strict";

import {applyChange, revertChange}            from "deep-diff";


const HISTORY_LIMIT = 50;

const CHANGE_KIND = {
  NEW:      "N",
  DELETE:   "D",
  EDIT:     "E",
  ARRAY:    "A",
};

class History {
  constructor() {
    this._changes = [];
    this._commitStack = [];
    this._revertStack = [];

    this._isChanged = false;
  }

  getLastChange() {
    return (this._commitStack.length === 0)? undefined
      : this._commitStack[this._commitStack.length - 1];
  }

  recordNewDiff(target, path, to) {
    this._changes.push({
      target: target,
      kind: CHANGE_KIND.NEW,
      path: path,
      rhs: to,
    });
  }

  recordDeleteDiff(target, path, from) {
    this._changes.push({
      target: target,
      kind: CHANGE_KIND.DELETE,
      path: path,
      lhs: from,
    });
  }

  recordEditDiff(target, path, from, to) {
    if (from === to) {
      return;
    }
    this._changes.push({
      target: target,
      kind: CHANGE_KIND.EDIT,
      path: path,
      lhs: from,
      rhs: to,
    });
  }

  recordNewOnArrayDiff(target, path, index, to) {
    this._changes.push({
      target: target,
      kind: CHANGE_KIND.ARRAY,
      path: path,
      index: index,
      item: {
        kind: CHANGE_KIND.NEW,
        rhs: to,
      },
    });
  }

  recordDeleteOnArrayDiff(target, path, index, from) {
    this._changes.push({
      target: target,
      kind: CHANGE_KIND.ARRAY,
      path: path,
      index: index,
      item: {
        kind: CHANGE_KIND.DELETE,
        lhs: from,
      },
    });
  }

  save(actionType, overwrite, info = {}) {
    const lastChange = this.getLastChange();
    if (overwrite && lastChange) {
      lastChange.actionType = actionType;
      lastChange.info = info;
      lastChange.changes = lastChange.changes.concat(this._changes);
    }
    else {
      this._commitStack.push({
        actionType: actionType,
        info: info,
        changes: this._changes,
      });
    }
    while (this._commitStack.length > HISTORY_LIMIT) {
      this._commitStack.shift();
    }
    this._changes = [];
    this._revertStack = [];
    this._isChanged = true;
  }

  undo() {
    const lastChange = this._commitStack.pop();
    if (lastChange) {
      for (let i = lastChange.changes.length - 1; i >= 0; i--) {
        let change = lastChange.changes[i];
        revertChange(change.target, true, change);
      }
      this._revertStack.push(lastChange);
    }
  }

  redo() {
    const lastChange = this._revertStack.pop();
    if (lastChange) {
      for (let i = 0; i < lastChange.changes.length; i++) {
        let change = lastChange.changes[i];
        applyChange(change.target, true, change);
      }
      this._commitStack.push(lastChange);
    }
  }

  isChanged() {
    return this._isChanged;
  }
}

export default new History();
