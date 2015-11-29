"use strict";

import {Stream, parseGIF}               from "src/utils/jsgif";


function url2Binary(objectURL) {
  return new Promise((resolve, reject) => {
    try {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", objectURL, true);
      xhr.overrideMimeType('text/plain; charset=x-user-defined');
      xhr.onload = (e) => {
        if (xhr.status == 200) {
          setTimeout(() => {
            resolve(xhr.responseText);
          }, 0);
        }
        else {
          throw new Error("request returns a failure status.");
        }
      };
      xhr.send();
    } catch (e) {
      reject(e);
    }
  });
}

export default (objectURL) => {
  return new Promise((resolve, reject) => {

    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");

    let frames = [];
    let frameInfo = null;
    let header = null;

    const hdrCallback = (hdr) => {
      header = hdr;
      canvas.width = hdr.width;
      canvas.height = hdr.height;
    };

    const gceCallback = (gce) => {
      frameInfo = {
        disposalMethod: gce.disposalMethod,
        transparencyIndex: gce.transparencyGiven ? gce.transparencyIndex : null,
        delayTime: gce.delayTime,
      };
    };

    const imgCallback = (img) => {
      let colorTable = img.lctFlag ? img.lct : header.gct;
      let delayTime = frameInfo ? frameInfo.delayTime : null;
      let transparencyIndex = frameInfo ? frameInfo.transparencyIndex : null;

      let imageData = context.getImageData(img.leftPos, img.topPos, img.width, img.height);
      for (let i = 0; i < img.pixels.length; i++) {
        let pixel = img.pixels[i];
        if (transparencyIndex === pixel) {
          // This code don't support the disposal method yet.
          imageData.data[i * 4 + 3] = 0;
        }
        else {
          imageData.data[i * 4]     = colorTable[pixel][0];
          imageData.data[i * 4 + 1] = colorTable[pixel][1];
          imageData.data[i * 4 + 2] = colorTable[pixel][2];
          imageData.data[i * 4 + 3] = 255;
        }
      }
      context.putImageData(imageData, img.leftPos, img.topPos);
      frames.push({
        imageData: context.getImageData(0, 0, header.width, header.height),
        delayTime: delayTime * 10, // (1 delayTime = 10 msec)
      });
      frameInfo = null;
    };

    const pteCallback = (pte) => {
      frameInfo = null;
    };

    const eofCallback = (eof) => {
      resolve(frames);
    };

    try {
      url2Binary(objectURL).then(
        (result) => {
          let stream = new Stream(result);

          try {
            parseGIF(stream, {
              hdr: hdrCallback,
              gce: gceCallback,
              img: imgCallback,
              pte: pteCallback,
              eof: eofCallback,
            });
          } catch (e) {
            console.warn(e);
            throw new Error("Failed to parse GIF");
          }
        },
        (error) => {
          throw error;
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};
