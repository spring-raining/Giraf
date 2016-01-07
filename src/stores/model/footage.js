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
    this._gifFrames = [];
    this._videoDuration = null;
    this._thumbnail = null;
    this._videoSemaphore = 0;
    if (objectURL && width && height) {
      _loadContent(objectURL, type, width, height).then(
        (result) => {
          super.assign("_status", StatusTypes.NORMAL);
          Actions.updateFootage(this);
        },
        (error) => {
          console.error(error);
          console.warn("Failed to load file : " + this.name);
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

  get videoDuration() {
    return this._videoDuration;
  }

  get thumbnail() {
    return this._thumbnail;
  }

  update(obj = {}, fireAction = true) {
    super.update(obj);

    if (obj.objectURL) {
      super.assign("_status", StatusTypes.LOADING);
      this._loadContent(obj.objectURL, this.type, this.width, this.height).then(
        () => {
          super.assign("_status", StatusTypes.NORMAL);
          Actions.updateFootage(this);
          this._prepareThumbnail().then(
            (result) => {
              super.assign("_thumbnail", result);
              Actions.updateFootage(this);
            },
            (error) => {
              console.error(error);
              console.warn("Failed to create thumbnail : " + this.name);
            }
          );
        },
        (error) => {
          console.error(error);
          console.warn("Failed to load file : " + this.name);
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
    }
  }

  getFootageKind() {
    if      (this.type.indexOf("image/") === 0) return FootageKinds.IMAGE;
    else if (this.type.indexOf("video/") === 0) return FootageKinds.VIDEO;
    else                                        return FootageKinds.UNKNOWN;
  }

  getLength() {
    if (this.getFootageKind() === FootageKinds.VIDEO) {
      return this.videoDuration;
    }
    else if (this.type === "image/gif") {
      return this.gifFrames.length;
    }
    else {
      return 0;
    }
  }

  getThumbnail() {
    return this.thumbnail;
  }

  getFormattedLength() {
    if (this.getFootageKind() === FootageKinds.VIDEO
    &&  this.videoDuration > 0) {
      const d = this.videoDuration;
      return ((d >= 3600)? Math.floor(d / 3600) + ":" : "")
           + (Math.floor(d % 3600 / 60 + 100) + "").slice(1, 3)
           + ":"
           + (Math.floor(d % 60 + 100) + "").slice(1, 3)
           + "."
           + (Math.round(d * 100 % 100 + 100) + "").slice(1, 3)
    }
    else if (this.type === "image/gif"
         &&  this.gifFrames.length > 0) {
      return this.gifFrames.length + "f";
    }
    else {
      return "";
    }
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

        const time_ = Math.max(0, Math.min(this.getLength(), time));

        if (this.getFootageKind() === FootageKinds.IMAGE) {
          this.context.clearRect(0, 0, this.width, this.height);
          if (this.type === "image/gif") {
            this.context.putImageData(
              this.gifFrames[Math.round(time_)].imageData,
              0, 0);
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
          const video = document.createElement("video");
          const wait = () => {
            return new Promise((resolve_, reject_) => {
              if (this._videoSemaphore > 0) {
                // the video is locked
                setTimeout(resolve_, 50);
              } else {
                this._videoSemaphore += 1;
                reject_();
              }
            });
          };
          const run = (canvas) => {
            return new Promise((resolve_, reject_) => {
              try {
                const context = canvas.getContext("2d");
                if (time_ === 0) {
                  // timeupdate will not fire
                  video.addEventListener("canplay", () => {
                    context.drawImage(video, 0, 0);
                    this._videoSemaphore -= 1;
                    resolve_(canvas);
                  });
                  video.src = this.objectURL;
                }
                else {
                  setTimeout(() => {
                    video.addEventListener("timeupdate", () => {
                      video.addEventListener("canplaythrough", () => {
                        setTimeout(
                          () => {
                            context.drawImage(video, 0, 0);
                            this._videoSemaphore -= 1;
                            resolve_(canvas);
                          }, 0);
                      });
                    });
                  }, 0);
                  video.src = this.objectURL;
                  video.currentTime = time_;
                }
              } catch (e) {
                reject_(e);
              }
            });
          };

          // prepare temporary canvas
          this._prepareCanvas(this.width, this.height, true).then(
            (canvas) => {
              function loop() {
                return wait().then(
                  loop,
                  () => {
                    // my turn
                    run(canvas).then(
                      resolve,
                      (error) => {
                        reject(error);
                      }
                    )
                  }
                );
              }
              loop();
            },
            (error) => {
              reject(error);
            }
          );
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

      this._prepareCanvas(width, height, false).then(
        (result) => {
          if (type.indexOf("video/") === 0) {
            const video = document.createElement("video");
            video.addEventListener("durationchange", () => {
              this._videoDuration = video.duration;
              resolve();
            });
            video.src = objectURL;
          }
          else if (type === "image/gif") {
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

  _prepareCanvas(width, height, temporary=true) {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        if (!temporary) {
          this.canvas = canvas;
          this.context = canvas.getContext("2d");
        }
        resolve(canvas);
      } catch (e) {
        reject(e);
      }
    });
  }

  _prepareThumbnail() {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext("2d");

        this.render(0).then(
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
}

export default {
  Footage: Footage,
  StatusTypes: StatusTypes,
  FootageKinds: FootageKinds,
};