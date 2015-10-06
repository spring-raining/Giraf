"use strict";

import keyMirror from "keymirror";

import Actions            from "src/actions/actions";
import _Selectable        from "src/stores/model/_selectable";
import _Renderable        from "src/stores/model/_renderable";
import {classWithTraits}  from "src/utils/traitUtils";


const StatusTypes = keyMirror({
  UNKNOWN: null,
  LOADING: null,
  NORMAL: null,
  DYING: null,
});

const FootageKinds = keyMirror({
  UNKNOWN: null,
  IMAGE: null,
  VIDEO: null,
});

class Footage extends classWithTraits(null, _Selectable, _Renderable) {
  /**
   *
   * @param {string} id
   * @param {string} name
   * @param {int} size
   * @param {string} type
   * @param content
   */
  constructor(id, name, size, type, content=null) {
    super();
    Object.assign(this, {
      id, name, size, type, content
    });
    this.status = (content)? StatusTypes.NORMAL : StatusTypes.LOADING;
  }

  update(obj) {
    Object.assign(this, obj);
    if (this.content) {
      this.status = StatusTypes.NORMAL;
    };
    if (obj.width > 0 && obj.height > 0) {
      this._prepareCanvas(obj.width, obj.height);
    }
    Actions.updateFootage(this);
  }

  getFootageKind() {
    if      (this.type.indexOf("image/") === 0) return FootageKinds.IMAGE;
    else if (this.type.indexOf("video/") === 0) return FootageKinds.VIDEO;
    else                                        return FootageKinds.UNKNOWN;
  }

  render(time) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.canvas) {
          throw Error("Canvas not created.");
        }

        this.context.clearRect(0, 0, this.width, this.height);
        if (this.getFootageKind() === FootageKinds.IMAGE) {
          let img = document.createElement("img");
          img.src = this.content;
          img.onload = () => {
            this.context.drawImage(img, 0, 0);
            resolve(this.canvas);
          };
        }
        else if (this.getFootageKind() === FootageKinds.VIDEO) {
          let video = document.createElement("video");
          video.addEventListener("timeupdate", () => {
            video.addEventListener("canplay", () => {
              this.context.drawImage(video, 0, 0);
              resolve(this.canvas);
            });
          });
          video.src = this.content;
          video.currentTime = time;
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  _prepareCanvas(width, height) {
    return new Promise((resolve, reject) => {
      try {
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d");
        resolve(this.canvas);
      } catch (e) {
        reject(e);
      }
    });
  }
}

export default {
  Footage: Footage,
  StatusTypes: StatusTypes,
  FootageKinds: FootageKinds,
};