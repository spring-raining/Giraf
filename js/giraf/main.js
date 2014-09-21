// Generated by CoffeeScript 1.8.0
(function() {
  var $backVideo, $video, FileHandler, Settings, Thumbnail, Thumbnails, Timeline, Timelines, gifjsWorkerDist, preset;

  $video = $("#video");

  $backVideo = $("<video>");

  gifjsWorkerDist = "js/gifjs/dist/gif.worker.js";

  preset = ["var imageData = context.getImageData(0, 0, resultWidth, resultHeight);\nvar data = imageData.data;\n\nfor (i=0; i < data.length; i+=4) {\n    var black = 0.34*data[i] + 0.5*data[i+1] + 0.16*data[i+2];\n    data[i] = black;\n    data[i+1] = black;\n    data[i+2] = black;\n}\ncontext.putImageData(imageData, 0, 0);", "var imageData = context.getImageData(0, 0, resultWidth, resultHeight);\nvar data = imageData.data;\nvar gain = 5; //数字が大きくなるとコントラストが強くなる\n\nfor (i=0; i < data.length; i++) {\n    data[i] = 255 / (1 + Math.exp((128 - data[i]) / 128.0 * gain));\n}\ncontext.putImageData(imageData, 0, 0);", "var imageData = context.getImageData(0, 0, resultWidth, resultHeight);\nvar data = imageData.data;\nvar diff = 30; //数字が大きくなるとより明るくなる\n\nfor (i=0; i < data.length; i++) {\n    data[i] += diff;\n}\ncontext.putImageData(imageData, 0, 0);", "var imageData = context.getImageData(0, 0, resultWidth, resultHeight);\nvar data = imageData.data;\nvar temp = 1.3; //1より大きくなると赤っぽく、小さくなると青っぽくなる\n\nfor (i=0; i < data.length; i+=4) {\n    data[i] *= temp;    // red\n    data[i+2] /= temp;  // blue\n}\ncontext.putImageData(imageData, 0, 0);", "var text = \"ちくわ大明神\";\nvar x = 0;\nvar y = resultHeight / 2;\n\ncontext.font = \"bold 48px sans-serif\";\ncontext.fillStyle = \"rgba(255, 131, 0, 0.7)\";\ncontext.fillText(text, x, y);"];

  $(function() {
    var fileHandler, loadVideo, rendering, settings, timelines;
    rendering = false;
    fileHandler = new FileHandler({
      $container: $("#drop_here"),
      $file_input: $("#form_video")
    });
    settings = new Settings;
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
    timelines = new Timelines;
    $("#timeline_holder").sortable({
      axis: "x",
      update: function() {
        return timelines.updateOrder();
      }
    });
    return $(fileHandler).bind("data_url_prepared", function(event, urls) {
      return (loadVideo(urls[0])).done(function(image_url) {
        var finalize, renderThumbnail, thumbnails, toggleVideoPlay;
        thumbnails = new Thumbnails;
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

  Thumbnails = (function() {
    function Thumbnails() {
      var i, _i;
      this.thumbs = [];
      for (i = _i = 1; _i <= 5; i = ++_i) {
        this.thumbs.push(new Thumbnail(i, $("#thumbnail_" + i)));
      }
    }

    Thumbnails.prototype.update = function(settings) {
      var i, time, _i;
      for (i = _i = 0; _i < 5; i = ++_i) {
        time = $video.get(0).currentTime + (i - 2) * (1.0 / settings.getCaptureFrame());
        this.thumbs[i].update(time);
      }
      i = 0;
      $backVideo.on("timeupdate", (function(_this) {
        return function() {
          if (i >= 5) {
            return $backVideo.off("timeupdate");
          } else {
            _this.thumbs[i].draw();
            i++;
            return $backVideo.get(0).currentTime = $video.get(0).currentTime + (i - 2) * (1.0 / settings.getCaptureFrame());
          }
        };
      })(this));
      return $backVideo.get(0).currentTime = $video.get(0).currentTime - 2 * (1.0 / settings.getCaptureFrame());
    };

    return Thumbnails;

  })();

  Thumbnail = (function() {
    function Thumbnail(id, $canvas) {
      this.id = id;
      this.$canvas = $canvas;
      this.canvas = $canvas.get(0);
      this.context = this.canvas.getContext("2d");
      this.canvas.addEventListener("click", (function(_this) {
        return function() {
          return $video.get(0).currentTime = _this.time;
        };
      })(this));
    }

    Thumbnail.prototype.update = function(time) {
      this.time = time;
      if (time >= 0 || time <= video.duration) {
        return $("#thumbnail_" + this.id).addClass("loading");
      }
    };

    Thumbnail.prototype.draw = function() {
      $("#thumbnail_" + this.id).removeClass("loading");
      return this.context.drawImage($backVideo.get(0), 0, 0, 320, 160);
    };

    return Thumbnail;

  })();

  Timelines = (function() {
    function Timelines() {
      this.tls = [];
      this.number = 1;
      $("#add_timeline").bind("click", (function(_this) {
        return function() {
          _this.tls.push(new Timeline(_this, _this.number));
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

  Timeline = (function() {
    function Timeline(timelines, number) {
      this.timelines = timelines;
      this.number = number;
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
      return ctx.drawImage($video.get(0), 0, 0, 320, 160);
    };

    Timeline.prototype.setStopTime = function(time) {
      var ctx;
      this.stop = time;
      ctx = this.stopCanvas.getContext("2d");
      return ctx.drawImage($video.get(0), 0, 0, 320, 160);
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

  Settings = (function() {
    var captureFrameValues, gifSizeValues, gifSpeedValues;

    captureFrameValues = [1, 2, 3, 4, 6, 8, 12, 15, 24, 30];

    gifSpeedValues = [0.5, 0.8, 1, 1.2, 1.5, 2, 3, 5];

    gifSizeValues = [40, 80, 120, 240, 320, 480, 640, 720];

    function Settings() {
      var i, _, _i, _j, _k, _len, _len1, _len2;
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
          video = $video.get(0);
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

    Settings.prototype.initJcrop = function() {
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

    Settings.prototype.initCodeMirror = function() {
      return this.codeMirrorApi = CodeMirror($("#form_effect_holder").get(0), {
        mode: "javascript",
        indentUnit: 4,
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        autoCloseBrackets: true
      });
    };

    Settings.prototype.bind = function(type, fn) {
      return this.event[type] = fn;
    };

    Settings.prototype.getCaptureFrame = function() {
      return this.captureFrameVal;
    };

    Settings.prototype.getGifSpeed = function() {
      return this.gifSpeedVal;
    };

    Settings.prototype.getGifSize = function(size) {
      if (parseInt(this.$gifSize.val(), 10) === -1) {
        return size;
      } else {
        return this.$gifSize.val();
      }
    };

    Settings.prototype.getEffectScript = function() {
      return this.effectScript;
    };

    Settings.prototype.isCrop = function() {
      return this.crop;
    };

    Settings.prototype.getCropCoord = function() {
      return this.cropCoords;
    };

    Settings.prototype.disable = function(bool) {
      if (bool) {
        return $("#config").addClass("disabled");
      } else {
        return $("#config").removeClass("disabled");
      }
    };

    return Settings;

  })();

  FileHandler = (function() {
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

}).call(this);
