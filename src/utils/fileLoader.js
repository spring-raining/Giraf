"use strict";

import React                          from "react";
import {defineMessages, FormattedMessage}
                                      from "react-intl";

import {Alert}                        from "src/stores/model/alert";
import genUUID                        from "src/utils/genUUID";


const supportedImageTypes = [
  "image/gif",
  "image/png",
  "image/jpeg",
];

const supportedVideoTypes = [
  "video/mp4",
];

const messages = defineMessages({
  alert_load_failed: {
    id: "utils.file_loader.alert_cannot_load",
    defaultMessage: "Cannot load this file : {filename}",
  },
});

export function check(file) {
  return (supportedImageTypes.indexOf(file.type) >= 0
       || supportedVideoTypes.indexOf(file.type) >= 0);
}

export function run(footage, fileApiObj) {
  return new Promise((resolve, reject) => {
    new Promise((resolve_) => {
      try {
        let url = window.URL.createObjectURL(fileApiObj);
        if (supportedImageTypes.indexOf(fileApiObj.type) >= 0) {
          let img = document.createElement("img");
          img.onload = () => {
            resolve_({
              objectURL: url,
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
          };
          img.src = url;
        }
        else if (supportedVideoTypes.indexOf(fileApiObj.type) >= 0) {
          let video = document.createElement("video");
          video.addEventListener("canplay", () => {
            resolve_({
              objectURL: url,
              width: video.videoWidth,
              height: video.videoHeight,
            });
          });
          video.src = url;
        }
        else {
          const message = React.createElement(FormattedMessage,
            Object.assign(messages.alert_load_failed, {
              values: {
                filename: fileApiObj.name,
              }
            }));
          reject(new Alert(genUUID(), message));
        }
      } catch (e) {
        reject(e);
      }
    }).then(
      (result) => {
        footage.update({
          objectURL: result.objectURL,
          width: result.width,
          height: result.height,
        });
        resolve();
      });
  });
}

export default {
  check: check,
  run: run,
};
