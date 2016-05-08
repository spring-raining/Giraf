"use strict";

import ModelBase                      from "src/stores/model/modelBase";


export class Alert extends ModelBase {
  constructor(id, content, autoDelete = true) {
    super();
    this._id = id;
    this._content = content;
    this._autoDelete = autoDelete;
  }

  get id() {
    return this._id;
  }

  get content() {
    return this._content;
  }

  get autoDelete() {
    return this._autoDelete;
  }
}

export default {
  Alert: Alert,
};
