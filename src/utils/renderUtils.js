"use strict";

import Store                          from "src/stores/store";
import {Composition}                  from "src/stores/model/composition";


function _createRenderedCanvasAsync(composition, frame) {
  return new Promise((resolve,reject) => {
    try {
      let canvas = document.createElement("canvas");
      canvas.width = composition.width;
      canvas.height = composition.height;
      let ctx = canvas.getContext("2d");

      composition.render(frame).then(
        (result) => {
          ctx.drawImage(result, 0, 0);
          resolve(canvas);
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

function renderFrameAsync(composition, frame) {
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

function renderFrameAutomatically(composition,
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
            let frameCache = Store.get("compositionFrameCache")[composition.id];
            console.log(frameCache);
            if (!frameCache || !frameCache[frame]) {
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
            let playing = Store.get("playing");
            if (!playing) {
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
  renderFrameAsync: renderFrameAsync,
  renderFrameAutomatically: renderFrameAutomatically,
};