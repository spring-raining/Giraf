"use strict";

import keyMirror from "keymirror";

import Actions from "../../actions/actions";

const statusList = keyMirror({
  unknown: null,
  loading: null,
  normal: null,
  dying: null,
});

class File {
  /**
   *
   * @param {string} id
   * @param {string} name
   * @param {int} size
   * @param {string} type
   * @param content
   */
  constructor(id, name, size, type, content=null) {
    Object.assign(this, {
      id, name, size, type, content
    });
    this.status = (content)? statusList.normal : statusList.loading;
  }

  update(obj) {
    Object.assign(this, obj);
    this.status = (this.content)? statusList.normal : statusList.dying;
    Actions.updateFile(this);
  }
}

export default File;