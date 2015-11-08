"use strict";

import ModelBase            from "src/stores/model/modelBase";


class Script extends ModelBase {
  constructor(scriptString = "") {
    super();
    this._scriptString = scriptString;
    this._scriptURL = null;
    this._worker = null;
    this._genJSWorker(scriptString);
  }

  get scriptString() {
    return this._scriptString;
  }

  set scriptString(scriptString) {
    if (scriptString !== this._scriptString) {
      this._genJSWorker(scriptString);
    }
    super.assign("_scriptString", scriptString);
  }

  runAsync(data) {
    return new Promise((resolve, reject) => {
      const wk = this._worker;
      function messageEventListener(e) {
        wk.removeEventListener("message", messageEventListener);
        resolve(e.data);
      }

      try {
        wk.addEventListener("message", messageEventListener);
        wk.addEventListener("error", (e) => {
          throw e;
        });
        wk.postMessage(data);
      } catch (e) {
        wk.removeEventListener("message", messageEventListener);
        reject(e);
      }
    });
  }

  _genJSWorker(scriptString) {
    if (this._scriptURL) {
      window.URL.revokeObjectURL(this._scriptURL);
    }
    if (this._worker) {
      this._worker.terminate();
    }

    const formedScriptStr = `
      self.addEventListener("message", function(e) {
        var data = e.data;
        var run = function() {
          ${scriptString}
          return data;
        };
        self.postMessage(run());
      });
    `;
    this._scriptURL = window.URL.createObjectURL(
      new Blob([formedScriptStr], {type: "application/javascript"})
    );
    this._worker = new Worker(this._scriptURL);
  }
}

export default {
  Script: Script,
};
