"use strict";

var access = (store) => {
  return {
    getSelectedItem() {
      var file = store.files.filter((e) => e.id === store.idOfSelectingItem);
      var comp = store.compositions.filter((e) => e.id === store.idOfSelectingItem);
      if (file.length > 0) {
        return file[0];
      }
      else if (comp.length > 0) {
        return comp[0];
      }
      else {
        return null;
      }
    }
  }
};

export default access;