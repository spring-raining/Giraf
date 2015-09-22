"use strict";

import Dispatcher from "../dispatcher";
import ActionConst from "./const";
import SelectFile from "../utils/selectFile";

const actions = {
  importFile(file = null) {
    if (file) {
      Dispatcher.dispatch({
        actionType: ActionConst.IMPORT_FILE,
        file: file
      });
    }
    else {
      SelectFile.run((f) => {
        let files = [];
        for (let i=0; i < f.length; i++) files.push(f[i]);
        Dispatcher.dispatch({
          actionType: ActionConst.IMPORT_FILE,
          file: files
        })
      });
    }
  },

  updateFile(file) {
    Dispatcher.dispatch({
      actionType: ActionConst.UPDATE_FILE,
      file: file
    });
  }
};

export default actions;