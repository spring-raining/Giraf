"use strict";


export default (byte) => {
  return (byte >= 1000000) ? `${(byte / 1000000).toFixed(2)} MB`
       : (byte >= 1000)    ? `${(byte / 1000).toFixed(2)} KB`
       :                     `${byte} B`;
};
