"use strict";

import {ArrayObserver, ObjectObserver}        from "observe-js";


const CHANGE_KIND = {
  NEW:      "N",
  DELETE:   "D",
  EDIT:     "E",
  ARRAY:    "A",
};

class History {
  constructor() {

  }

  recordNewDiff(target, path, to) {
    console.log({
      target: target,
      kind: CHANGE_KIND.NEW,
      path: path,
      rhs: to,
    });
  }

  recordDeleteDiff(target, path, from) {
    console.log({
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
    console.log({
      target: target,
      kind: CHANGE_KIND.EDIT,
      path: path,
      lhs: from,
      rhs: to,
    });
  }

  recordNewOnArrayDiff(target, path, index, to) {
    console.log({
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
}

export default new History();
