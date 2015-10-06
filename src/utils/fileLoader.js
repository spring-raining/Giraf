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
        let url = window.URL.createObjectURL(fileApiObj);
        if (supportedImageTypes.indexOf(fileApiObj.type) >=0) {
          let img = document.createElement("img");
          img.onload = () => {
            resolve({
              content: url,
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
          };
          img.src = url;
        }
        else if (supportedVideoTypes.indexOf(fileApiObj.type) >= 0) {
          let video = document.createElement("video");
          video.addEventListener("canplay", () => {
            resolve({
              content: url,
              width: video.videoWidth,
              height: video.videoHeight,
            });
          });
          video.src = url;
        }
        else {
          throw Error("Cannot load file : " + fileApiObj.name);
        }
      } catch (e) {
        reject(e);
      }
    });
    p.then(
      (result) => {
        file.update({
          content: result.content,
          width: result.width,
          height: result.height,
        });
      },
      (error) => { throw error });
  }
}