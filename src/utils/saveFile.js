"use strict";

export default (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  const evt = document.createEvent("MouseEvent");

  a.download = filename;
  a.href = url;
  evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

  window.URL.revokeObjectURL(url);
};
