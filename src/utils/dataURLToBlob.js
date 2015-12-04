"use strict";

/*
 *  Inspired: http://stackoverflow.com/questions/12168909/blob-from-dataurl
 */

export default (dataURL) => {
  const BASE64_MARKER = ';base64,';

  const parts = dataURL.split(BASE64_MARKER);
  const type = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], {type: type});
};
