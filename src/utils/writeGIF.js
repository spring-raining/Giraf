"use strict";

import gifshot                          from "gifshot";

import {renderFrameAsync}               from "src/utils/renderUtils";


export default (images,
                gifWidth,
                gifHeight,
                interval,
                options = {}) => {
  return new Promise((resolve, reject) => {

    try {
      const opt = Object.assign({
        images: images,
        gifWidth: gifWidth,
        gifHeight: gifHeight,
        interval: interval,
      }, options);

      gifshot.createGIF(opt, (obj) => {
        if (obj.error) {
          reject(obj);
        }
        else {
          resolve(obj);
        }
      });
    }
    catch (e) {
      reject(e);
    }
  });
};
