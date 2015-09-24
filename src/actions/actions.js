"use strict";

import Dispatcher from "../dispatcher";
import ActionConst from "./const";
import SelectFile from "../utils/selectFile";
import _Selectable from "../stores/model/_selectable";

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
  },

  changeSelectingItem(item) {
    if (item === null || item instanceof _Selectable) {
      Dispatcher.dispatch({
        actionType: ActionConst.CHANGE_SELECTING_ITEM,
        item: item
      })
    }
  },
};

export default actions;