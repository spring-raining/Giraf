"use strict";

const supportedImageTypes = [
  "image/gif",
  "image/png",
  "image/jpeg",
];

const supportedVideoTypes = [
  "video/mp4",
];

export default {
  check: (file) => {
    return (supportedImageTypes.indexOf(file.type) >= 0
         || supportedVideoTypes.indexOf(file.type) >= 0);
  },
  run: (file, fileApiObj) => {
    let p = new Promise((resolve, reject) => {
      try {
        resolve(window.URL.createObjectURL(fileApiObj));
      } catch (e) {
        reject(e);
      }
    });
    p.then(
      (result) => {
        file.update({content: result});
      },
      (error) => { throw error });
  }
}