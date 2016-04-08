"use strict";

import Store                          from "src/stores/store";
import {Composition}                  from "src/stores/model/composition";


function _createRenderedCanvasAsync(composition, frame) {
  return new Promise((resolve,reject) => {
    try {
      composition.render(frame).then(
        cloneCanvas,
        (error) => {
          throw error;
        }
      ).then(
        (result) => {
          resolve(result);
        },
        (error) => {
          throw error;
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}

export function cloneCanvas(src) {
  return new Promise((resolve,reject) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = src.width;
      canvas.height = src.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(src, 0, 0);
      resolve(canvas);
    } catch (e) {
      reject(e);
    }
  });
}

export function renderFrameAsync(composition, frame) {
  return new Promise((resolve, reject) => {
    if (frame !== null
    &&  frame >= 0
    &&  frame < composition.frame) {
      _createRenderedCanvasAsync(composition, frame).then(
        (result) => {
          resolve(result);
        },
        (error) => {
          reject(error);
        }
      );
    }
    else {
      reject(new Error("Invalid frame."));
    }
  });
}

export function renderFrameAutomatically(composition,
                                  firstFrame,
                                  onFrameUpdated,
                                  onRenderFinished,
                                  onErrorOccurred) {
  Promise.resolve(firstFrame).then(
    function loop(frame) {
      return new Promise((resolve, reject) => {
        if (typeof(onFrameUpdated) === "function") {
          onFrameUpdated(frame);
        }
        Promise.all([
          new Promise((resolve_, reject_) => {
            setTimeout(() => {
              resolve_();
            }, 1000 / composition.fps);
          }),
          new Promise((resolve_, reject_) => {
            let frameCache = Store.get("frameCache")
                                  .getFrameCache(composition, frame);
            if (!frameCache) {
              _createRenderedCanvasAsync(composition, frame).then(
                (result) => {
                  if (typeof(onRenderFinished) === "function") {
                    onRenderFinished(result, frame);
                  }
                  resolve_();
                },
                (error) => {
                  reject_(error);
                }
              );
            }
            else {
              resolve_();
            }
          })
        ]).then(
          (result) => {
            let isPlaying = Store.get("isPlaying");
            if (!isPlaying) {
              reject();
            }
            let nextFrame = (frame + 1 < composition.frame)? frame + 1 : 0;
            resolve(nextFrame);
          },
          (error) => {
            if (typeof(onErrorOccurred) === "function") {
              onErrorOccurred(error);
            }
            reject();
          }
        );
      }).then(loop)
        .catch(() => {
          // stopped
        });
    }
  );
}

export default {
  cloneCanvas: cloneCanvas,
  renderFrameAsync: renderFrameAsync,
  renderFrameAutomatically: renderFrameAutomatically,
};