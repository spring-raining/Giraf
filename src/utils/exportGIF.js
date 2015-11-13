"use strict";

import gifshot                          from "gifshot";

import {renderFrameAsync}               from "src/utils/renderUtils";


export default (composition, options = {}) => {
  const canvasObjectURLs = [];

  function renderAll(fr) {
    return new Promise((resolve, reject) => {
      if (fr < composition.frame) {
        renderFrameAsync(composition, fr).then(
          (result) => {
            canvasObjectURLs.push(result);
            renderAll(fr + 1).then(
              ()      => { resolve(); },
              (error) => { reject(error); }
            );
          },
          (error) => {
            reject(error);
          }
        );
      }
      else {
        resolve();
      }
    });
  }

  return new Promise((resolve, reject) => {

    try {
      renderAll(0).then(
        (result) => {
          const opt = Object.assign({
            images: canvasObjectURLs,
            gifWidth: composition.width,
            gifHeight: composition.height,
            interval: 1 / composition.fps,
          }, options);

          gifshot.createGIF(opt, (obj) => {
            if (obj.error) {
              reject(obj);
            }
            else {
              resolve(obj);
            }
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
    catch (e) {
      reject(e);
    }
    finally {
      canvasObjectURLs.forEach((e) => {
        window.URL.revokeObjectURL(e);
      });
    }
  });
};
