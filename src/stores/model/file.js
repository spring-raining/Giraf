"use strict";

import keyMirror from "keymirror";

import Actions from "../../actions/actions";
import _Selectable from "./_selectable";
import {classWithTraits} from "../../utils/traitUtils";




const StatusTypes = keyMirror({
  UNKNOWN: null,
  LOADING: null,
  NORMAL: null,
  DYING: null,
});

const FileKinds = keyMirror({
  UNKNOWN: null,
  IMAGE: null,
  VIDEO: null,
});

class File extends classWithTraits(null, _Selectable) {
  /**
   *
   * @param {string} id
   * @param {string} name
   * @param {int} size
   * @param {string} type
   * @param content
   */
  constructor(id, name, size, type, content=null) {
    super();
    Object.assign(this, {
      id, name, size, type, content
    });
    this.status = (content)? StatusTypes.NORMAL : StatusTypes.LOADING;
  }

  update(obj) {
    Object.assign(this, obj);
    this.status = (this.content)? StatusTypes.NORMAL : StatusTypes.DYING;
    Actions.updateFile(this);
  }

  getFileKind() {
    if      (this.type.indexOf("image/") === 0) return FileKinds.IMAGE;
    else if (this.type.indexOf("video/") === 0) return FileKinds.VIDEO;
    else                                        return FileKinds.UNKNOWN;
  }
}

export default {
  File: File,
  StatusTypes: StatusTypes,
  FileKinds: FileKinds,
};