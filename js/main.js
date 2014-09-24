// Generated by CoffeeScript 1.8.0
var Giraf, app,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if (typeof Giraf === "undefined" || Giraf === null) {
  Giraf = {};
}

if (Giraf._base == null) {
  Giraf._base = {};
}

if (Giraf._settings == null) {
  Giraf._settings = {};
}

if (Giraf.App == null) {
  Giraf.App = {};
}

if (Giraf.FileHandler == null) {
  Giraf.FileHandler = {};
}

if (Giraf.History == null) {
  Giraf.History = {};
}

if (Giraf.Settings == null) {
  Giraf.Settings = {};
}

if (Giraf.Settings._base == null) {
  Giraf.Settings._base = {};
}

if (Giraf.Settings.CookieBinder == null) {
  Giraf.Settings.CookieBinder = {};
}

if (Giraf.Task == null) {
  Giraf.Task = {};
}

if (Giraf.Task._base == null) {
  Giraf.Task._base = {};
}

if (Giraf.Thumbnail == null) {
  Giraf.Thumbnail = {};
}

if (Giraf.Thumbnails == null) {
  Giraf.Thumbnails = {};
}

if (Giraf.Timeline == null) {
  Giraf.Timeline = {};
}

if (Giraf.Timelines == null) {
  Giraf.Timelines = {};
}

if (Giraf.View == null) {
  Giraf.View = {};
}

if (Giraf.View._base == null) {
  Giraf.View._base = {};
}

if (Giraf.View.Expert == null) {
  Giraf.View.Expert = {};
}

if (Giraf.View.Expert._base == null) {
  Giraf.View.Expert._base = {};
}

if (Giraf.View.Modal == null) {
  Giraf.View.Modal = {};
}

if (Giraf.View.Nav == null) {
  Giraf.View.Nav = {};
}

if (Giraf.View.Quick == null) {
  Giraf.View.Quick = {};
}

if (Giraf.View.Quick._base == null) {
  Giraf.View.Quick._base = {};
}

Giraf._base = (function() {
  function _base() {}

  return _base;

})();

Giraf._settings = (function() {
  var captureFrameValues, gifSizeValues, gifSpeedValues;

  captureFrameValues = [1, 2, 3, 4, 6, 8, 12, 15, 24, 30];

  gifSpeedValues = [0.5, 0.8, 1, 1.2, 1.5, 2, 3, 5];

  gifSizeValues = [40, 80, 120, 240, 320, 480, 640, 720];

  function _settings($video) {
    var i, _, _i, _j, _k, _len, _len1, _len2;
    this.$video = $video;
    this.$captureFrame = $("#form_capture_frame");
    this.$gifSpeed = $("#form_gif_speed");
    this.$gifSize = $("#form_gif_size");
    this.event = {};
    for (_i = 0, _len = captureFrameValues.length; _i < _len; _i++) {
      i = captureFrameValues[_i];
      this.$captureFrame.append("<option value=" + i + ">" + i + "fps</option>");
    }
    for (_j = 0, _len1 = gifSpeedValues.length; _j < _len1; _j++) {
      i = gifSpeedValues[_j];
      this.$gifSpeed.append("<option value=" + i + ">x" + i + "</option>");
    }
    this.$gifSize.append("<option value=-1>元サイズに合わせる</option>");
    for (_k = 0, _len2 = gifSizeValues.length; _k < _len2; _k++) {
      i = gifSizeValues[_k];
      this.$gifSize.append("<option value=" + i + ">" + i + "px</option>");
    }
    this.captureFrameVal = 12;
    this.gifSpeedVal = 1;
    this.gifSizeVal = -1;
    this.effectScript = "";
    this.crop = false;
    this.$captureFrame.val(this.captureFrameVal);
    this.$gifSpeed.val(this.gifSpeedVal);
    this.$gifSize.val(this.gifSizeVal);
    this.initJcrop();
    this.initCodeMirror();

    /*@$captureFrame.bind "change", =>
      if "change" in @event then @event["change"]()
    @$gifSpeed.bind "change", =>
      if "change" in @event then @event["change"]()
    @$gifSize.bind "change", =>
      if "change" in @event then @event["change"]()
     */
    $("#modal_capture_frame").on("hidden.bs.modal", (function(_this) {
      return function() {
        return _this.$captureFrame.val(_this.captureFrameVal);
      };
    })(this));
    $("#modal_capture_frame_save").bind("click", (function(_this) {
      return function() {
        var fn, type, _ref, _results;
        _this.captureFrameVal = _this.$captureFrame.val();
        $("#modal_capture_frame").modal("hide");
        _ref = _this.event;
        _results = [];
        for (type in _ref) {
          fn = _ref[type];
          if (type === "change") {
            _results.push(fn());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
    })(this));
    $("#modal_gif_size").on("hidden.bs.modal", (function(_this) {
      return function() {
        return _this.$gifSize.val(_this.gifSizeVal);
      };
    })(this));
    $("#modal_gif_size_save").bind("click", (function(_this) {
      return function() {
        _this.gifSizeVal = _this.$gifSize.val();
        return $("#modal_gif_size").modal("hide");
      };
    })(this));
    $("#modal_gif_speed").on("hidden.bs.modal", (function(_this) {
      return function() {
        return _this.$gifSpeed.val(_this.gifSpeedVal);
      };
    })(this));
    $("#modal_gif_speed_save").bind("click", (function(_this) {
      return function() {
        _this.gifSpeedVal = _this.$gifSpeed.val();
        return $("#modal_gif_speed").modal("hide");
      };
    })(this));
    $("#modal_effect").on("hide.bs.modal", (function(_this) {
      return function() {
        return _this.codeMirrorApi.setValue(_this.effectScript);
      };
    })(this));
    $("#modal_effect_save").bind("click", (function(_this) {
      return function() {
        _this.effectScript = _this.codeMirrorApi.getValue();
        return $("#modal_effect").modal("hide");
      };
    })(this));
    $(".modal-effect-preset").bind("click", {
      self: this
    }, function(event) {
      return event.data.self.codeMirrorApi.setValue(preset[parseInt($(this).attr("data-value"), 10)]);
    });
    $("#modal_crop").on("shown.bs.modal", (function(_this) {
      return function() {
        var canvas, ctx, video;
        canvas = $("<canvas>").get(0);
        ctx = canvas.getContext("2d");
        video = _this.$video.get(0);
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        $("#modal_crop_img").get(0).onload = function() {
          return _this.initJcrop();
        };
        return $("#modal_crop_img").attr("src", canvas.toDataURL());
      };
    })(this));
    $("#modal_crop").on("hidden.bs.modal", (function(_this) {
      return function() {
        $("#form_crop").prop("checked", _this.crop);
        _this.jcropApi.destroy();
        return $("#modal_crop_img").attr("src", "");
      };
    })(this));
    $("#modal_crop_save").bind("click", (function(_this) {
      return function() {
        _this.crop = $("#form_crop").prop("checked");
        return $("#modal_crop").modal("hide");
      };
    })(this));
    $("#form_crop").bind("change", (function(_this) {
      return function() {
        if ($("#form_crop").prop("checked")) {
          _this.jcropApi.enable();
          return _this.jcropApi.setSelect([0, 0, 50, 50]);
        } else {
          _this.jcropApi.release();
          return _this.jcropApi.disable();
        }
      };
    })(this));
    _ = this;
    $(".modal-crop-aspect").bind("click", function() {
      var aspect;
      aspect = [0, 1, 4 / 3, 8 / 5, 3 / 4, 5 / 8];
      return _.jcropApi.setOptions({
        aspectRatio: aspect[parseInt($(this).attr("data-value"), 10)]
      });
    });
  }

  _settings.prototype.initJcrop = function() {
    this.jcropApi = $.Jcrop("#modal_crop_img");
    $("#modal_crop_img").Jcrop({
      onChange: (function(_this) {
        return function(c) {
          return _this.cropCoords = c;
        };
      })(this),
      onSelect: (function(_this) {
        return function(c) {
          return _this.cropCoords = c;
        };
      })(this)
    });
    if (this.crop) {
      return this.jcropApi.setSelect([this.cropCoords.x, this.cropCoords.y, this.cropCoords.x2, this.cropCoords.y2]);
    } else {
      this.jcropApi.release();
      return this.jcropApi.disable();
    }
  };

  _settings.prototype.initCodeMirror = function() {
    return this.codeMirrorApi = CodeMirror($("#form_effect_holder").get(0), {
      mode: "javascript",
      indentUnit: 4,
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true,
      autoCloseBrackets: true
    });
  };

  _settings.prototype.bind = function(type, fn) {
    return this.event[type] = fn;
  };

  _settings.prototype.getCaptureFrame = function() {
    return this.captureFrameVal;
  };

  _settings.prototype.getGifSpeed = function() {
    return this.gifSpeedVal;
  };

  _settings.prototype.getGifSize = function(size) {
    if (parseInt(this.$gifSize.val(), 10) === -1) {
      return size;
    } else {
      return this.$gifSize.val();
    }
  };

  _settings.prototype.getEffectScript = function() {
    return this.effectScript;
  };

  _settings.prototype.isCrop = function() {
    return this.crop;
  };

  _settings.prototype.getCropCoord = function() {
    return this.cropCoords;
  };

  _settings.prototype.disable = function(bool) {
    if (bool) {
      return $("#config").addClass("disabled");
    } else {
      return $("#config").removeClass("disabled");
    }
  };

  return _settings;

})();

Giraf.App = (function(_super) {
  __extends(App, _super);

  function App() {
    this.run = __bind(this.run, this);
    this.self = this;
  }

  App.prototype.run = function() {
    return $(function() {
      var settings, view;
      view = new Giraf.View(this.self);
      return settings = new Giraf.Settings(this.self);
    });
  };

  App.prototype._run = function() {
    var $backVideo, $video, gifjsWorkerDist, preset;
    $video = $("#video");
    $backVideo = $("<video>");
    gifjsWorkerDist = "js/lib/gif.js/dist/gif.worker.js";
    preset = ["var imageData = context.getImageData(0, 0, resultWidth, resultHeight);\nvar data = imageData.data;\n\nfor (i=0; i < data.length; i+=4) {\n    var black = 0.34*data[i] + 0.5*data[i+1] + 0.16*data[i+2];\n    data[i] = black;\n    data[i+1] = black;\n    data[i+2] = black;\n}\ncontext.putImageData(imageData, 0, 0);", "var imageData = context.getImageData(0, 0, resultWidth, resultHeight);\nvar data = imageData.data;\nvar gain = 5; //数字が大きくなるとコントラストが強くなる\n\nfor (i=0; i < data.length; i++) {\n    data[i] = 255 / (1 + Math.exp((128 - data[i]) / 128.0 * gain));\n}\ncontext.putImageData(imageData, 0, 0);", "var imageData = context.getImageData(0, 0, resultWidth, resultHeight);\nvar data = imageData.data;\nvar diff = 30; //数字が大きくなるとより明るくなる\n\nfor (i=0; i < data.length; i++) {\n    data[i] += diff;\n}\ncontext.putImageData(imageData, 0, 0);", "var imageData = context.getImageData(0, 0, resultWidth, resultHeight);\nvar data = imageData.data;\nvar temp = 1.3; //1より大きくなると赤っぽく、小さくなると青っぽくなる\n\nfor (i=0; i < data.length; i+=4) {\n    data[i] *= temp;    // red\n    data[i+2] /= temp;  // blue\n}\ncontext.putImageData(imageData, 0, 0);", "var text = \"ちくわ大明神\";\nvar x = 0;\nvar y = resultHeight / 2;\n\ncontext.font = \"bold 48px sans-serif\";\ncontext.fillStyle = \"rgba(255, 131, 0, 0.7)\";\ncontext.fillText(text, x, y);"];
    return $(function() {
      var fileHandler, loadVideo, rendering, settings, timelines;
      rendering = false;
      fileHandler = new Giraf.FileHandler({
        $container: $("#drop_here"),
        $file_input: $("#form_video")
      });
      settings = new Giraf.Settings($video);
      $(fileHandler).on('enter', function() {
        return $('#drop_here').addClass('active');
      }).on('leave', function() {
        return $('#drop_here').removeClass('active');
      }).on('data_url_prepared', function() {
        $('#drop_here').removeClass('active');
        return $('#drop_here').remove();
      });
      loadVideo = function(url) {
        var deferred;
        deferred = $.Deferred();
        $video.attr("src", url);
        $backVideo.attr("src", url);
        $video.one('canplay', function() {
          $video.removeClass("hidden");
          return deferred.resolve($video);
        });
        $video.one('error', function(error) {
          return deferred.fail(error);
        });
        return deferred.promise();
      };
      timelines = new Giraf.Timelines($video);
      $("#timeline_holder").sortable({
        axis: "x",
        update: function() {
          return timelines.updateOrder();
        }
      });
      return $(fileHandler).bind("data_url_prepared", function(event, urls) {
        return (loadVideo(urls[0])).done(function(image_url) {
          var finalize, renderThumbnail, thumbnails, toggleVideoPlay;
          thumbnails = new Giraf.Thumbnails(this, $video, $backVideo);
          settings.disable(false);
          $("#capture").removeClass("disabled");
          renderThumbnail = function() {
            if (!rendering) {
              return thumbnails.update(settings);
            }
          };
          toggleVideoPlay = function() {
            var video;
            video = $video.get(0);
            if (video.paused) {
              return video.play();
            } else {
              return video.pause();
            }
          };
          renderThumbnail();
          $video.bind("pause", (function(_this) {
            return function() {
              return renderThumbnail();
            };
          })(this));
          $video.bind("seeked", (function(_this) {
            return function() {
              return renderThumbnail();
            };
          })(this));
          settings.bind("change", (function(_this) {
            return function() {
              return renderThumbnail();
            };
          })(this));
          $video.bind("click", function() {});
          $("#start").click(function() {
            var time;
            time = $video.get(0).currentTime;
            timelines.setStartTime(time);
            return timelines.updateMakeButton();
          });
          $("#stop").click(function() {
            var time;
            time = $video.get(0).currentTime;
            timelines.setStopTime(time);
            return timelines.updateMakeButton();
          });
          $("#refresh").click(function() {
            return renderThumbnail();
          });
          finalize = (function(_this) {
            return function() {
              $video.get(0).controls = true;
              rendering = false;
              settings.disable(false);
              timelines.updateMakeButton();
              return $("#capture").removeClass("disabled");
            };
          })(this);
          $("#make").click(function() {
            var arr, canvas, context, cropCoord, deferred, firstTime, frameNumber, gif, ratio, resultHeight, resultWidth, sourceHeight, sourceWidth, video;
            video = $video.get(0);
            cropCoord = settings.getCropCoord();
            sourceWidth = settings.isCrop() ? cropCoord.w : video.videoWidth;
            sourceHeight = settings.isCrop() ? cropCoord.h : video.videoHeight;
            ratio = (settings.getGifSize(sourceWidth)) / sourceWidth;
            resultWidth = settings.getGifSize(sourceWidth);
            resultHeight = sourceHeight * ratio;
            gif = new GIF({
              workers: 4,
              workerScript: gifjsWorkerDist,
              quality: 10,
              width: resultWidth,
              height: resultHeight,
              dither: false,
              pattern: true,
              globalPalette: true
            });
            gif.on("progress", function(p) {
              $("#progress_2").css("width", p * 100 + "%");
              return $("#progress_1").css("width", (1 - p) * 100 + "%");
            });
            gif.on("finished", function(blob) {
              var img;
              img = $("#result_image").get(0);
              img.src = URL.createObjectURL(blob);
              $("#result_status").text("Rendering finished : Filesize " + (blob.size >= 1000000 ? "" + ((blob.size / 1000000).toFixed(2)) + "MB" : "" + ((blob.size / 1000).toFixed(2)) + "KB"));
              return finalize();
            });
            video.controls = false;
            video.pause();
            $("#make").addClass("disabled");
            $("#capture").addClass("disabled");
            canvas = $("<canvas>").get(0);
            context = canvas.getContext("2d");
            canvas.width = resultWidth;
            canvas.height = resultHeight;
            rendering = true;
            settings.disable(true);
            arr = timelines.getFrameList(settings);
            frameNumber = arr.length;
            firstTime = arr[0];
            $("#progress_1").css("width", "0");
            $("#progress_2").css("width", "0");
            if (frameNumber < 2) {
              finalize();
              return;
            }
            deferred = $.Deferred();
            deferred.then(function() {
              var _deferred;
              if (video.currentTime === arr[0]) {
                _deferred = $.Deferred();
                $video.on("timeupdate", (function(_this) {
                  return function() {
                    $video.off("timeupdate");
                    return _deferred.resolve();
                  };
                })(this));
                video.currentTime = arr[1];
                return _deferred;
              }
            }).then(function() {
              $video.on("timeupdate", (function(_this) {
                return function() {
                  var drawDeferred;
                  drawDeferred = $.Deferred();
                  if (arr.length === 0) {
                    $video.off("timeupdate");
                    gif.render();
                    return;
                  }
                  $("#progress_1").css("width", (frameNumber - arr.length) / frameNumber * 100 + "%");
                  if (settings.isCrop()) {
                    context.drawImage(video, cropCoord.x, cropCoord.y, cropCoord.w, cropCoord.h, 0, 0, resultWidth, resultHeight);
                  } else {
                    context.drawImage(video, 0, 0, resultWidth, resultHeight);
                  }
                  if (settings.getEffectScript() !== "") {
                    eval(settings.getEffectScript());
                  }
                  gif.addFrame(canvas, {
                    copy: true,
                    delay: 1000.0 / settings.getCaptureFrame() / settings.getGifSpeed()
                  });
                  if (arr.length === 1) {
                    arr.shift();
                    return video.currentTime = firstTime;
                  } else {
                    arr.shift();
                    return video.currentTime = arr[0];
                  }
                };
              })(this));
              return video.currentTime = arr[0];
            });
            return deferred.resolve();
          });
          return $("#capture").click(function() {
            var canvas, context, cropCoord, ratio, resultHeight, resultWidth, sourceHeight, sourceWidth, video;
            video = $video.get(0);
            cropCoord = settings.getCropCoord();
            sourceWidth = settings.isCrop() ? cropCoord.w : video.videoWidth;
            sourceHeight = settings.isCrop() ? cropCoord.h : video.videoHeight;
            ratio = (settings.getGifSize(sourceWidth)) / sourceWidth;
            resultWidth = settings.getGifSize(sourceWidth);
            resultHeight = sourceHeight * ratio;
            canvas = $("<canvas>").get(0);
            context = canvas.getContext("2d");
            canvas.width = resultWidth;
            canvas.height = resultHeight;
            if (settings.isCrop()) {
              context.drawImage(video, cropCoord.x, cropCoord.y, cropCoord.w, cropCoord.h, 0, 0, resultWidth, resultHeight);
            } else {
              context.drawImage(video, 0, 0, resultWidth, resultHeight);
            }
            if (settings.getEffectScript() !== "") {
              eval(settings.getEffectScript());
            }
            return $("#result_image").attr("src", canvas.toDataURL());
          });
        });
      });
    });
  };

  return App;

})(Giraf._base);

Giraf.FileHandler = (function() {
  function FileHandler(args) {
    this.$container = args.$container;
    if (!this.$container) {
      throw "$container required";
    }
    this.$file_input = args.$file_input;
    this.bindEvents();
  }

  FileHandler.prototype.bindEvents = function() {
    this.$container.on('dragstart', (function(_this) {
      return function() {
        return true;
      };
    })(this)).on('dragover', (function(_this) {
      return function() {
        return false;
      };
    })(this)).on('dragenter', (function(_this) {
      return function(event) {
        if (_this.$container.is(event.target)) {
          ($(_this)).trigger('enter');
        }
        return false;
      };
    })(this)).on('dragleave', (function(_this) {
      return function(event) {
        if (_this.$container.is(event.target)) {
          return ($(_this)).trigger('leave');
        }
      };
    })(this)).on('drop', (function(_this) {
      return function(jquery_event) {
        var event, files;
        event = jquery_event.originalEvent;
        files = event.dataTransfer.files;
        if (files.length > 0) {
          ($(_this)).trigger('drop', [files]);
          (_this.readFiles(files)).done(function(contents) {
            return ($(_this)).trigger('data_url_prepared', [contents]);
          });
        }
        return false;
      };
    })(this));
    return this.$file_input.on('change', (function(_this) {
      return function(jquery_event) {
        return (_this.readFiles((_this.$file_input.get(0)).files)).done(function(contents) {
          return ($(_this)).trigger('data_url_prepared', [contents]);
        });
      };
    })(this));
  };

  FileHandler.prototype.readFiles = function(files) {
    var contents, i, read_all, role;
    read_all = $.Deferred();
    contents = [];
    i = 0;
    role = (function(_this) {
      return function() {
        var file;
        if (files.length <= i) {
          return read_all.resolve(contents);
        } else {
          file = files[i++];
          return (_this.readFile(file)).done(function(content) {
            return contents.push(content);
          }).always(function() {
            return role();
          });
        }
      };
    })(this);
    role();
    return read_all.promise();
  };

  FileHandler.prototype.readFile = function(file) {
    var read, reader;
    read = $.Deferred();
    reader = new FileReader;
    reader.onload = function() {
      return read.resolve(reader.result);
    };
    reader.onerror = function(error) {
      return read.reject(error);
    };
    reader.readAsDataURL(file);
    return read.promise();
  };

  return FileHandler;

})();

Giraf.History = (function(_super) {
  __extends(History, _super);

  function History() {
    return History.__super__.constructor.apply(this, arguments);
  }

  return History;

})(Giraf._base);

Giraf.Settings = (function(_super) {
  __extends(Settings, _super);

  function Settings(app) {
    var cookieBinder;
    this.app = app;
    cookieBinder = new Giraf.Settings.CookieBinder();
  }

  return Settings;

})(Giraf._base);

Giraf.Settings._base = (function(_super) {
  __extends(_base, _super);

  function _base() {
    return _base.__super__.constructor.apply(this, arguments);
  }

  return _base;

})(Giraf._base);

Giraf.Settings.CookieBinder = (function(_super) {
  __extends(CookieBinder, _super);

  function CookieBinder() {
    $.cookie.json = true;
  }

  CookieBinder.prototype.set = function(data) {
    return $.cookie('giraf', {
      version: 100,
      data: data
    });
  };

  CookieBinder.prototype.get = function() {
    return $.cookie('giraf');
  };

  CookieBinder.prototype.clear = function() {
    return $.removeCookie('giraf');
  };

  return CookieBinder;

})(Giraf.Settings._base);

Giraf.Task._base = (function(_super) {
  __extends(_base, _super);

  function _base() {
    return _base.__super__.constructor.apply(this, arguments);
  }

  return _base;

})(Giraf._base);

Giraf.Thumbnail = (function() {
  function Thumbnail(app, id, $canvas, $video, $backVideo) {
    this.app = app;
    this.id = id;
    this.$canvas = $canvas;
    this.$video = $video;
    this.$backVideo = $backVideo;
    this.canvas = $canvas.get(0);
    this.context = this.canvas.getContext("2d");
    this.canvas.addEventListener("click", (function(_this) {
      return function() {
        return _this.$video.get(0).currentTime = _this.time;
      };
    })(this));
  }

  Thumbnail.prototype.update = function(time) {
    this.time = time;
    if (time >= 0 || time <= this.$video.duration) {
      return $("#thumbnail_" + this.id).addClass("loading");
    }
  };

  Thumbnail.prototype.draw = function() {
    $("#thumbnail_" + this.id).removeClass("loading");
    return this.context.drawImage(this.$backVideo.get(0), 0, 0, 320, 160);
  };

  return Thumbnail;

})();

Giraf.Thumbnails = (function() {
  function Thumbnails(app, $video, $backVideo) {
    var i, _i;
    this.app = app;
    this.$video = $video;
    this.$backVideo = $backVideo;
    this.thumbs = [];
    for (i = _i = 1; _i <= 5; i = ++_i) {
      this.thumbs.push(new Giraf.Thumbnail(this.app, i, $("#thumbnail_" + i), this.$video, this.$backVideo));
    }
  }

  Thumbnails.prototype.update = function(settings) {
    var i, time, _i;
    for (i = _i = 0; _i < 5; i = ++_i) {
      time = this.$video.get(0).currentTime + (i - 2) * (1.0 / settings.getCaptureFrame());
      this.thumbs[i].update(time);
    }
    i = 0;
    this.$backVideo.on("timeupdate", (function(_this) {
      return function() {
        if (i >= 5) {
          return _this.$backVideo.off("timeupdate");
        } else {
          _this.thumbs[i].draw();
          i++;
          return _this.$backVideo.get(0).currentTime = _this.$video.get(0).currentTime + (i - 2) * (1.0 / settings.getCaptureFrame());
        }
      };
    })(this));
    return this.$backVideo.get(0).currentTime = this.$video.get(0).currentTime - 2 * (1.0 / settings.getCaptureFrame());
  };

  return Thumbnails;

})();

Giraf.Timeline = (function() {
  function Timeline(timelines, number, $video) {
    this.timelines = timelines;
    this.number = number;
    this.$video = $video;
    this.start = null;
    this.stop = null;
    this.selected = false;
    this.$timeline = $("#timeline_skeleton").clone();
    this.$timeline.attr("id", number);
    this.$timeline.appendTo($("#timeline_holder"));
    this.startCanvas = this.$timeline.find(".timeline-start").get(0);
    this.stopCanvas = this.$timeline.find(".timeline-stop").get(0);
    this.$timeline.bind("click", (function(_this) {
      return function() {
        return timelines.setSelected(_this);
      };
    })(this));
    this.$timeline.find(".close").bind("click", (function(_this) {
      return function() {
        return _this.remove();
      };
    })(this));
  }

  Timeline.prototype.setStartTime = function(time) {
    var ctx;
    this.start = time;
    ctx = this.startCanvas.getContext("2d");
    return ctx.drawImage(this.$video.get(0), 0, 0, 320, 160);
  };

  Timeline.prototype.setStopTime = function(time) {
    var ctx;
    this.stop = time;
    ctx = this.stopCanvas.getContext("2d");
    return ctx.drawImage(this.$video.get(0), 0, 0, 320, 160);
  };

  Timeline.prototype.isValidTime = function() {
    if ((this.start != null) && (this.stop != null)) {
      return true;
    } else {
      return false;
    }
  };

  Timeline.prototype.setSelected = function(bool) {
    this.selected = bool;
    if (bool) {
      return this.$timeline.css("border-color", "red");
    } else {
      return this.$timeline.css("border-color", "");
    }
  };

  Timeline.prototype.getNumber = function() {
    return this.$timeline.attr("id");
  };

  Timeline.prototype.getSelected = function() {
    return this.selected;
  };

  Timeline.prototype.getFrameList = function(settings) {
    var arr, diff, i, time;
    if (!this.isValidTime()) {
      throw "start and stop time must fill";
    }
    arr = [];
    i = 0;
    time = this.start;
    while ((this.start <= this.stop && time <= this.stop) || (this.start > this.stop && time >= this.stop)) {
      arr.push(time);
      i++;
      diff = i / settings.getCaptureFrame();
      if (this.start <= this.stop) {
        time = this.start + diff;
      } else {
        time = this.start - diff;
      }
    }
    return arr;
  };

  Timeline.prototype.remove = function() {
    this.timelines.removeTimeline(this);
    return this.$timeline.remove();
  };

  return Timeline;

})();

Giraf.Timelines = (function() {
  function Timelines($video) {
    this.$video = $video;
    this.tls = [];
    this.number = 1;
    $("#add_timeline").bind("click", (function(_this) {
      return function() {
        _this.tls.push(new Giraf.Timeline(_this, _this.number, _this.$video));
        _this.number++;
        return _this.updateMakeButton();
      };
    })(this)).trigger("click");
    this.tls[0].setSelected(true);
  }

  Timelines.prototype.setStartTime = function(time) {
    var tl;
    tl = this.getSelected();
    if (tl != null) {
      return tl.setStartTime(time);
    }
  };

  Timelines.prototype.setStopTime = function(time) {
    var tl;
    tl = this.getSelected();
    if (tl != null) {
      return tl.setStopTime(time);
    }
  };

  Timelines.prototype.setSelected = function(tl) {
    var i, _i, _len, _ref;
    _ref = this.tls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      i.setSelected(false);
    }
    return tl.setSelected(true);
  };

  Timelines.prototype.getSelected = function() {
    var i, _i, _len, _ref;
    _ref = this.tls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      if (i.getSelected()) {
        return i;
      }
    }
  };

  Timelines.prototype.getFrameList = function(settings) {
    var arr, i, tl, _i, _j, _len, _len1, _ref, _ref1;
    arr = [];
    _ref = this.tls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tl = _ref[_i];
      _ref1 = tl.getFrameList(settings);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        i = _ref1[_j];
        arr.push(i);
      }
    }
    return arr;
  };

  Timelines.prototype.removeTimeline = function(tl) {
    var k, v, _ref;
    _ref = this.tls;
    for (k in _ref) {
      v = _ref[k];
      if (v === tl) {
        this.tls.splice(k, 1);
      }
    }
    return this.updateMakeButton();
  };

  Timelines.prototype.updateOrder = function() {
    var arr, i, num, tl, _i, _j, _len, _len1, _ref;
    arr = [];
    num = $("#timeline_holder").sortable("toArray");
    for (_i = 0, _len = num.length; _i < _len; _i++) {
      i = num[_i];
      _ref = this.tls;
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        tl = _ref[_j];
        if (tl.getNumber() === i) {
          arr.push(tl);
        }
      }
    }
    return this.tls = arr;
  };

  Timelines.prototype.updateMakeButton = function() {
    var a, tl, _i, _len, _ref;
    a = true;
    _ref = this.tls;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      tl = _ref[_i];
      a = a && tl.isValidTime();
    }
    if (a && this.tls.length > 0) {
      return $("#make").removeClass("disabled");
    } else {
      return $("#make").addClass("disabled");
    }
  };

  return Timelines;

})();

Giraf.View = (function(_super) {
  var _selector_expert, _selector_nav, _selector_quick;

  __extends(View, _super);

  _selector_nav = "nav";

  _selector_quick = "#quick";

  _selector_expert = "#expert";

  function View(app) {
    this.app = app;
    this.nav = new Giraf.View.Nav($(_selector_nav));
    this.quick = new Giraf.View.Quick($(_selector_quick));
    this.expert = new Giraf.View.Expert($(_selector_expert));
    $(document).on("click", (function(_this) {
      return function(event) {
        var modal;
        if ($(event.target).attr("data-action") != null) {
          if ($(event.target).attr("data-action") === "nav_hoge") {
            _this.nav.inactive();
            modal = new Giraf.View.Modal;
            return modal.show({
              title: "たいとる",
              content: "<b>ああああ</b>いいいい",
              action: {
                yes: {
                  text: "はい",
                  primary: true
                },
                no: {
                  text: "いいえ"
                }
              }
            });
          }
        }
      };
    })(this));
  }

  return View;

})(Giraf._base);

Giraf.View._base = (function(_super) {
  __extends(_base, _super);

  function _base() {
    return _base.__super__.constructor.apply(this, arguments);
  }

  return _base;

})(Giraf._base);

Giraf.View.Expert = (function(_super) {
  var _selector_composition, _selector_container, _selector_effect, _selector_node, _selector_project, _selector_tool;

  __extends(Expert, _super);

  _selector_container = "#expert_container";

  _selector_project = "#expert_project > .panel-container";

  _selector_composition = "#expert_composition > .panel-container";

  _selector_effect = "#expert_effect > .panel-container";

  _selector_tool = "#expert_tool > .panel-container";

  _selector_node = "#expert_node > .panel-container";

  function Expert($expert) {
    this.$expert = $expert;
  }

  return Expert;

})(Giraf.View._base);

Giraf.View.Expert._base = (function(_super) {
  __extends(_base, _super);

  function _base() {
    return _base.__super__.constructor.apply(this, arguments);
  }

  return _base;

})(Giraf.View._base);

Giraf.View.Modal = (function(_super) {
  var createButtonDOM;

  __extends(Modal, _super);

  function Modal() {}

  Modal.prototype.show = function(args) {
    var action, template;
    template = _.template("<div class=\"modal\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-title\"><h3><%- title %></h3></div>\n    <div class=\"modal-content\"><%= content %></div>\n    <div class=\"modal-action\"><%= action %></div>\n  </div>\n</div>");
    if (args.title == null) {
      args.title = "";
    }
    if (args.content == null) {
      args.content = "";
    }
    action = createButtonDOM.call(this, args.action);
    $("body").append(template({
      title: args.title,
      content: args.content,
      action: action
    }));
    $(".modal").on({
      click: function(event) {
        var onEnd;
        if ($(event.target).hasClass("modal")) {
          onEnd = function() {
            return $(".modal").remove();
          };
          $(".modal-dialog").bind("transitionend", onEnd);
          return $(".modal").removeClass("show");
        }
      }
    });
    return setTimeout(function() {
      return $(".modal").addClass("show");
    }, 0);
  };

  createButtonDOM = function(data) {
    var arr, button, key, value;
    arr = [];
    for (key in data) {
      value = data[key];
      button = _.template("<button\n  <% if (primary === true) { print('class=\"button-primary\"'); } %>\n>\n  <%- text %>\n</button>");
      arr.push(button({
        primary: value.primary === true,
        text: value.text
      }));
    }
    return arr.join("");
  };

  return Modal;

})(Giraf.View._base);

Giraf.View.Nav = (function(_super) {
  var $dropdowns, isActive, _selector_dropdown;

  __extends(Nav, _super);

  _selector_dropdown = "li.dropdown";

  $dropdowns = null;

  isActive = false;

  function Nav($nav) {
    var self;
    this.$nav = $nav;
    $dropdowns = this.$nav.find(_selector_dropdown);
    self = this;
    $dropdowns.on({
      mouseenter: function() {
        if (isActive) {
          return self.active(this);
        }
      },
      click: function() {
        if (!$(this).hasClass("open")) {
          return self.active(this);
        }
      }
    });
    $(document).on("click", function(event) {
      if (!$.contains($nav.get(0), event.target)) {
        return self.inactive();
      }
    });
  }

  Nav.prototype.active = function(target) {
    isActive = true;
    $dropdowns.each(function(index, element) {
      return $(element).removeClass("open");
    });
    return $(target).addClass("open");
  };

  Nav.prototype.inactive = function() {
    isActive = false;
    return $dropdowns.each(function(index, element) {
      return $(element).removeClass("open");
    });
  };

  Nav.prototype.isActive = function() {
    return isActive;
  };

  return Nav;

})(Giraf.View._base);

Giraf.View.Quick = (function(_super) {
  var selector_preview, selector_result, selector_thumbnail, selector_timeline;

  __extends(Quick, _super);

  selector_preview = "#quick_preview";

  selector_thumbnail = "#quick_thumbnail";

  selector_timeline = "#quick_timeline";

  selector_result = "#quick_result";

  function Quick($quick) {
    this.$quick = $quick;
  }

  return Quick;

})(Giraf.View._base);

Giraf.View.Quick._base = (function(_super) {
  __extends(_base, _super);

  function _base() {
    return _base.__super__.constructor.apply(this, arguments);
  }

  return _base;

})(Giraf.View._base);

app = new Giraf.App;

app.run();
