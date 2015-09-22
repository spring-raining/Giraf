"use strict";


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
    this.id = id;
    this.name = name;
    this.size = size;
    this.type = type;
    this.content = content;
  }
}

export default File;