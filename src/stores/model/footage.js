"use strict";

import keyMirror                        from "keymirror";

import Actions                          from "src/actions/actions";
import _Selectable                      from "src/stores/model/_selectable";
import _Renderable                      from "src/stores/model/_renderable";
import ModelBase                        from "src/stores/model/modelBase";
import {classWithTraits}                from "src/utils/traitUtils";
import readGIF                          from "src/utils/readGIF";


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

const Base = classWithTraits(ModelBase, _Selectable, _Renderable);

class Footage extends Base {
  /**
   *
   * @param {string} id
   * @param {string} name
   * @param {number} size
   * @param {string} type
   * @param {string} objectURL
   * @param {number} width
   * @param {number} height
   */
  constructor(id, name, size, type, objectURL=null, width=null, height=null) {
    super();
    this._id = id;
    this._name = name;
    this._size = size;
    this._type = type;
    this._objectURL = objectURL;
    this._width = width;
    this._height = height;
    this._status = StatusTypes.LOADING;
    this._gifFrame = null;
    if (objectURL && width && height) {
      _loadContent(objectURL, type, width, height).then(
        (result) => {
          super.assign("_status", StatusTypes.NORMAL);
          Actions.updateFootage(this);
        },
        (error) => {
          console.log(error);
          super.assign("_status", StatusTypes.DYING);
          Actions.updateFootage(this);
        }
      );
    }
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    super.assign("_name", name);
  }

  get size() {
    return this._size;
  }

  set size(size) {
    super.assign("_size", size);
  }

  get type() {
    return this._type;
  }

  set type(type) {
    super.assign("_type", type);
  }

  get objectURL() {
    return this._objectURL;
  }

  set objectURL(objectURL) {
    super.assign("_objectURL", objectURL);
  }

  get width() {
    return this._width;
  }

  set width(width) {
    console.warn("Setting width directly is not recommended. Please use updateSize(width, height)");
    this.updateSize(width, this.height);
  }

  get height() {
    return this._height;
  }

  set height(height) {
    console.warn("Setting height directly is not recommended. Please use updateSize(width, height)");
    this.updateSize(this.width, height);
  }

  get status() {
    return this._status;
  }

  get gifFrames() {
    return this._gifFrames;
  }

  update(obj = {}, fireAction = true) {
    super.update(obj);

    if (obj.objectURL) {
      super.assign("_status", StatusTypes.LOADING);
      this._loadContent(obj.objectURL, this.type, this.width, this.height).then(
        (result) => {
          super.assign("_status", StatusTypes.NORMAL);
          Actions.updateFootage(this);
        },
        (error) => {
          console.log(error);
          super.assign("_status", StatusTypes.DYING);
          Actions.updateFootage(this);
        }
      )
    }
    if (fireAction) {
      Actions.updateFootage(this);
    }
  }

  updateSize(width, height) {
    if (width !== this._width || height !== this._height) {
      super.assign("_width", width);
      super.assign("_height", height);
      //this._prepareCanvas(width, height);
    }
  }

  getFootageKind() {
    if      (this.type.indexOf("image/") === 0) return FootageKinds.IMAGE;
    else if (this.type.indexOf("video/") === 0) return FootageKinds.VIDEO;
    else                                        return FootageKinds.UNKNOWN;
  }

  isAnimatable() {
    return this.getFootageKind() === FootageKinds.VIDEO
        || this.type === "image/gif";
  }

  render(time) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.canvas) {
          throw Error("Canvas not created.");
        }

        this.context.clearRect(0, 0, this.width, this.height);
        if (this.getFootageKind() === FootageKinds.IMAGE) {
          if (this.type === "image/gif") {
            let frame = Math.max(0, Math.min(this.gifFrames.length, time));
            this.context.putImageData(this.gifFrames[frame].imageData, 0 , 0);
            resolve(this.canvas);
          }
          else {
            let img = document.createElement("img");
            img.src = this.objectURL;
            img.onload = () => {
              this.context.drawImage(img, 0, 0);
              resolve(this.canvas);
            };
          }
        }
        else if (this.getFootageKind() === FootageKinds.VIDEO) {
          let video = document.createElement("video");
          if (time === 0) {
            // timeupdate will not fire
            video.addEventListener("canplay", () => {
              this.context.drawImage(video, 0, 0);
              resolve(this.canvas);
            });
            video.src = this.objectURL;
          }
          else {
            video.addEventListener("timeupdate", () => {
              video.addEventListener("canplay", () => {
                this.context.drawImage(video, 0, 0);
                resolve(this.canvas);
              });
            });
            video.src = this.objectURL;
            video.currentTime = time;
          }
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  _loadContent(objectURL, type, width, height) {
    return new Promise((resolve, reject) => {
      if (!width || width < 1 || !height || height < 1) {
        reject(new RangeError("Invalid width or height."));
      }

      this._prepareCanvas(width, height).then(
        (result) => {
          if (type === "image/gif") {
            // parse GIF frames
            readGIF(objectURL).then(
              (result) => {
                this._gifFrames = result;
                resolve();
              },
              (error) => {
                reject(error);
              }
            );
          }
          else {
            resolve();
          }
        },
        (error) => {
          reject(error);
        }
      );
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