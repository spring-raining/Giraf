Giraf = {} unless Giraf?
Giraf._base = {} unless Giraf._base?
Giraf._settings = {} unless Giraf._settings?
Giraf.App = {} unless Giraf.App?
Giraf.Controller = {} unless Giraf.Controller?
Giraf.Controller._base = {} unless Giraf.Controller._base?
Giraf.Controller.Action = {} unless Giraf.Controller.Action?
Giraf.FileHandler = {} unless Giraf.FileHandler?
Giraf.History = {} unless Giraf.History?
Giraf.Model = {} unless Giraf.Model?
Giraf.Model._base = {} unless Giraf.Model._base?
Giraf.Model.Composition = {} unless Giraf.Model.Composition?
Giraf.Model.File = {} unless Giraf.Model.File?
Giraf.Settings = {} unless Giraf.Settings?
Giraf.Settings._base = {} unless Giraf.Settings._base?
Giraf.Settings.CookieBinder = {} unless Giraf.Settings.CookieBinder?
Giraf.Task = {} unless Giraf.Task?
Giraf.Task._base = {} unless Giraf.Task._base?
Giraf.Task.ChangeSelected = {} unless Giraf.Task.ChangeSelected?
Giraf.Task.CreateNewComposition = {} unless Giraf.Task.CreateNewComposition?
Giraf.Task.FileLoader = {} unless Giraf.Task.FileLoader?
Giraf.Task.RefreshComposition = {} unless Giraf.Task.RefreshComposition?
Giraf.Task.SelectFile = {} unless Giraf.Task.SelectFile?
Giraf.Thumbnail = {} unless Giraf.Thumbnail?
Giraf.Thumbnails = {} unless Giraf.Thumbnails?
Giraf.Timeline = {} unless Giraf.Timeline?
Giraf.Timelines = {} unless Giraf.Timelines?
Giraf.Tools = {} unless Giraf.Tools?
Giraf.View = {} unless Giraf.View?
Giraf.View._base = {} unless Giraf.View._base?
Giraf.View.Expert = {} unless Giraf.View.Expert?
Giraf.View.Expert._base = {} unless Giraf.View.Expert._base?
Giraf.View.Expert.Composition = {} unless Giraf.View.Expert.Composition?
Giraf.View.Expert.Droparea = {} unless Giraf.View.Expert.Droparea?
Giraf.View.Expert.Effect = {} unless Giraf.View.Expert.Effect?
Giraf.View.Expert.Node = {} unless Giraf.View.Expert.Node?
Giraf.View.Expert.Project = {} unless Giraf.View.Expert.Project?
Giraf.View.Modal = {} unless Giraf.View.Modal?
Giraf.View.Nav = {} unless Giraf.View.Nav?
Giraf.View.Quick = {} unless Giraf.View.Quick?
Giraf.View.Quick._base = {} unless Giraf.View.Quick._base?


# js/giraf/_base.coffee

class Giraf._base
  # Giraf._base

# js/giraf/_settings.coffee

class Giraf._settings
  captureFrameValues = [1, 2, 3, 4, 6, 8, 12, 15, 24, 30]
  gifSpeedValues = [0.5, 0.8, 1, 1.2, 1.5, 2, 3, 5]
  gifSizeValues = [40, 80, 120, 240, 320, 480, 640, 720]

  constructor: (@$video) ->
    @$captureFrame = $("#form_capture_frame")
    @$gifSpeed = $("#form_gif_speed")
    @$gifSize = $("#form_gif_size")
    @event = {}

    @$captureFrame.append "<option value=#{i}>#{i}fps</option>" for i in captureFrameValues
    @$gifSpeed.append "<option value=#{i}>x#{i}</option>" for i in gifSpeedValues
    @$gifSize.append "<option value=-1>元サイズに合わせる</option>"
    @$gifSize.append "<option value=#{i}>#{i}px</option>" for i in gifSizeValues

    @captureFrameVal = 12
    @gifSpeedVal = 1
    @gifSizeVal = -1
    @effectScript = ""
    @crop = false

    @$captureFrame.val @captureFrameVal
    @$gifSpeed.val @gifSpeedVal
    @$gifSize.val @gifSizeVal

    @initJcrop()
    @initCodeMirror()

    ###@$captureFrame.bind "change", =>
      if "change" in @event then @event["change"]()
    @$gifSpeed.bind "change", =>
      if "change" in @event then @event["change"]()
    @$gifSize.bind "change", =>
      if "change" in @event then @event["change"]()###

    # modal_capture_frame
    $("#modal_capture_frame").on "hidden.bs.modal", =>
      @$captureFrame.val @captureFrameVal

    $("#modal_capture_frame_save").bind "click", =>
      @captureFrameVal = @$captureFrame.val()
      $("#modal_capture_frame").modal "hide"
      for type, fn of @event
        if type is "change" then do fn

    # modal_gif_size
    $("#modal_gif_size").on "hidden.bs.modal", =>
      @$gifSize.val @gifSizeVal

    $("#modal_gif_size_save").bind "click", =>
      @gifSizeVal = @$gifSize.val()
      $("#modal_gif_size").modal "hide"

    # modal_gif_speed
    $("#modal_gif_speed").on "hidden.bs.modal", =>
      @$gifSpeed.val @gifSpeedVal

    $("#modal_gif_speed_save").bind "click", =>
      @gifSpeedVal = @$gifSpeed.val()
      $("#modal_gif_speed").modal "hide"

    # modal_effect
    $("#modal_effect").on "hide.bs.modal", =>
      @codeMirrorApi.setValue @effectScript

    $("#modal_effect_save").bind "click", =>
      @effectScript = @codeMirrorApi.getValue()
      $("#modal_effect").modal "hide"

    $(".modal-effect-preset").bind "click", self:@, (event) ->
      event.data.self.codeMirrorApi.setValue preset[parseInt ($(@).attr "data-value"), 10]

    # modal_crop
    $("#modal_crop").on "shown.bs.modal", =>
      canvas = $("<canvas>").get(0)
      ctx = canvas.getContext("2d")
      video = @$video.get(0)
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage video, 0, 0, video.videoWidth, video.videoHeight
      $("#modal_crop_img").get(0).onload = =>
        @initJcrop()
      $("#modal_crop_img").attr "src", canvas.toDataURL()

    $("#modal_crop").on "hidden.bs.modal", =>
      $("#form_crop").prop "checked", @crop
      @jcropApi.destroy()
      $("#modal_crop_img").attr "src", ""

    $("#modal_crop_save").bind "click", =>
      @crop = $("#form_crop").prop "checked"
      $("#modal_crop").modal "hide"

    $("#form_crop").bind "change", =>
      if $("#form_crop").prop "checked"
        @jcropApi.enable()
        @jcropApi.setSelect [0, 0, 50, 50]
      else
        @jcropApi.release()
        @jcropApi.disable()

    _ = @
    $(".modal-crop-aspect").bind "click", ->
      aspect = [0, 1, 4/3, 8/5, 3/4, 5/8]
      _.jcropApi.setOptions
        aspectRatio: aspect[parseInt ($(@).attr "data-value"), 10]

  initJcrop: ->
    @jcropApi = $.Jcrop "#modal_crop_img"
    $("#modal_crop_img").Jcrop
      onChange: (c) =>
        @cropCoords = c
      onSelect: (c) =>
        @cropCoords = c
    if @crop
      @jcropApi.setSelect [@cropCoords.x, @cropCoords.y, @cropCoords.x2, @cropCoords.y2]
    else
      @jcropApi.release()
      @jcropApi.disable()

  initCodeMirror: ->
    @codeMirrorApi = CodeMirror $("#form_effect_holder").get(0),
      mode: "javascript"
      indentUnit: 4
      lineNumbers: true
      styleActiveLine: true
      matchBrackets: true
      autoCloseBrackets: true

  bind: (type, fn) ->
    @event[type] = fn

  getCaptureFrame: ->
    @captureFrameVal

  getGifSpeed: ->
    @gifSpeedVal

  getGifSize: (size) ->
    if parseInt(@$gifSize.val(), 10) is -1 then size else @$gifSize.val()

  getEffectScript: ->
    @effectScript

  isCrop: ->
    @crop

  getCropCoord: ->
    @cropCoords

  disable: (bool) ->
    if bool then $("#config").addClass "disabled" else $("#config").removeClass "disabled"

# js/giraf/app.coffee

class Giraf.App extends Giraf._base

  run: =>
    $ =>
      @model = new Giraf.Model
      #@model.files = new Giraf.Model.Files @
      @view = new Giraf.View @
      @settings = new Giraf.Settings @

  _run: ->
    $video = $("#video")
    $backVideo = $("<video>")
    gifjsWorkerDist = "js/lib/gif.js/dist/gif.worker.js"

    preset = ["""
    var imageData = context.getImageData(0, 0, resultWidth, resultHeight);
    var data = imageData.data;

    for (i=0; i < data.length; i+=4) {
        var black = 0.34*data[i] + 0.5*data[i+1] + 0.16*data[i+2];
        data[i] = black;
        data[i+1] = black;
        data[i+2] = black;
    }
    context.putImageData(imageData, 0, 0);
    ""","""
    var imageData = context.getImageData(0, 0, resultWidth, resultHeight);
    var data = imageData.data;
    var gain = 5; //数字が大きくなるとコントラストが強くなる

    for (i=0; i < data.length; i++) {
        data[i] = 255 / (1 + Math.exp((128 - data[i]) / 128.0 * gain));
    }
    context.putImageData(imageData, 0, 0);
    ""","""
    var imageData = context.getImageData(0, 0, resultWidth, resultHeight);
    var data = imageData.data;
    var diff = 30; //数字が大きくなるとより明るくなる

    for (i=0; i < data.length; i++) {
        data[i] += diff;
    }
    context.putImageData(imageData, 0, 0);
    ""","""
    var imageData = context.getImageData(0, 0, resultWidth, resultHeight);
    var data = imageData.data;
    var temp = 1.3; //1より大きくなると赤っぽく、小さくなると青っぽくなる

    for (i=0; i < data.length; i+=4) {
        data[i] *= temp;    // red
        data[i+2] /= temp;  // blue
    }
    context.putImageData(imageData, 0, 0);
    ""","""
    var text = "ちくわ大明神";
    var x = 0;
    var y = resultHeight / 2;

    context.font = "bold 48px sans-serif";
    context.fillStyle = "rgba(255, 131, 0, 0.7)";
    context.fillText(text, x, y);
    """]

    $ ->
      rendering = false
      fileHandler = new Giraf.FileHandler
        $container: $("#drop_here")
        $file_input: $("#form_video")
      settings = new Giraf.Settings $video

      $(fileHandler)
      .on 'enter', ->
        $('#drop_here').addClass 'active'
      .on 'leave', ->
        $('#drop_here').removeClass 'active'
      .on 'data_url_prepared', ->
        $('#drop_here').removeClass 'active'
        $('#drop_here').remove()

      loadVideo = (url) ->
        deferred = $.Deferred()
        $video.attr "src", url
        $backVideo.attr "src", url
        $video.one 'canplay', ->
          $video.removeClass "hidden"
          deferred.resolve $video
        $video.one 'error', (error) ->
          deferred.fail error

        deferred.promise()

      timelines = new Giraf.Timelines $video

      $("#timeline_holder").sortable
        axis: "x"
        update: ->
          timelines.updateOrder()

      $(fileHandler).bind "data_url_prepared", (event, urls) ->
        (loadVideo urls[0]).done (image_url) ->
          # --- video loaded ---
          thumbnails = new Giraf.Thumbnails @, $video, $backVideo
          settings.disable false
          $("#capture").removeClass "disabled"

          #$(".thumbnail").each ->
            #c = $(this).get(0)
            #c.width = video.videoWidth
            #c.height = video.videoHeight

          #thumbnails.push(new Thumbnail urls[0], i) for i in [1..5]

          renderThumbnail = ->
            if not rendering
              thumbnails.update settings
            #for i in [0...5]
            #time = video.currentTime + (i - 2) * (1.0 / settings.getCaptureFrame())
            #thumbnails[i].update(time)
            #video.pause()

          toggleVideoPlay = ->
            video = $video.get(0)
            if video.paused
              video.play()
            else
              video.pause()
          renderThumbnail()

          $video.bind "pause", =>
            renderThumbnail()

          $video.bind "seeked", =>
            renderThumbnail()

          settings.bind "change", =>
            renderThumbnail()

          $video.bind "click", ->
            #toggleVideoPlay()

          $("#start").click ->
            time = $video.get(0).currentTime
            timelines.setStartTime time
            timelines.updateMakeButton()

          $("#stop").click ->
            time = $video.get(0).currentTime
            timelines.setStopTime time
            timelines.updateMakeButton()

          $("#refresh").click ->
            renderThumbnail()

          finalize = =>
            $video.get(0).controls = true
            rendering = false
            settings.disable false
            timelines.updateMakeButton()
            $("#capture").removeClass "disabled"

          $("#make").click ->
            video = $video.get(0)
            cropCoord = settings.getCropCoord()
            sourceWidth = if settings.isCrop() then cropCoord.w else video.videoWidth
            sourceHeight = if settings.isCrop() then cropCoord.h else video.videoHeight
            ratio = (settings.getGifSize sourceWidth) / sourceWidth
            resultWidth = settings.getGifSize sourceWidth
            resultHeight = sourceHeight * ratio

            gif = new GIF
              workers: 4
              workerScript: gifjsWorkerDist
              quality: 10
              width: resultWidth
              height: resultHeight
              dither: false
              pattern: true
              globalPalette: true

            gif.on "progress", (p) ->
              $("#progress_2").css "width", p*100 + "%"
              $("#progress_1").css "width", (1-p)*100 + "%"

            gif.on "finished", (blob) ->
              img = $("#result_image").get(0)
              img.src = URL.createObjectURL blob
              $("#result_status").text "Rendering finished : Filesize " +
              if (blob.size >= 1000000) then "#{ (blob.size / 1000000).toFixed 2 }MB"
              else "#{ (blob.size / 1000).toFixed 2 }KB"
              finalize()

            video.controls = false
            video.pause()
            $("#make").addClass "disabled"
            $("#capture").addClass "disabled"

            canvas = $("<canvas>").get(0)
            context = canvas.getContext("2d")

            canvas.width = resultWidth
            canvas.height = resultHeight

            rendering = true
            settings.disable true

            arr = timelines.getFrameList settings
            frameNumber = arr.length
            firstTime = arr[0]
            $("#progress_1").css "width", "0"
            $("#progress_2").css "width", "0"

            if frameNumber < 2
              finalize()
              return

            deferred = $.Deferred()
            deferred
            .then ->
              # timeupdate trigger
              if video.currentTime is arr[0]
                _deferred = $.Deferred()
                $video.on "timeupdate", =>
                  $video.off "timeupdate"
                  _deferred.resolve()
                video.currentTime = arr[1]
                _deferred
            .then ->
              $video.on "timeupdate", =>
                drawDeferred = $.Deferred()
                if arr.length is 0
                  $video.off "timeupdate"
                  gif.render()
                  return
                $("#progress_1").css "width", (frameNumber - arr.length)/frameNumber*100 + "%"
                if settings.isCrop() then context.drawImage video,
                  cropCoord.x, cropCoord.y, cropCoord.w, cropCoord.h, # source
                  0, 0, resultWidth, resultHeight                     # dest
                else context.drawImage video,
                  0, 0, resultWidth, resultHeight
                if settings.getEffectScript() isnt ""
                  eval settings.getEffectScript()
                gif.addFrame canvas,
                    copy: true
                    delay: 1000.0 / settings.getCaptureFrame() / settings.getGifSpeed()
                if arr.length is 1
                  arr.shift()
                  video.currentTime = firstTime
                else
                  arr.shift()
                  video.currentTime = arr[0]
              video.currentTime = arr[0]

            deferred.resolve()

          $("#capture").click ->
            video = $video.get(0)
            cropCoord = settings.getCropCoord()
            sourceWidth = if settings.isCrop() then cropCoord.w else video.videoWidth
            sourceHeight = if settings.isCrop() then cropCoord.h else video.videoHeight
            ratio = (settings.getGifSize sourceWidth) / sourceWidth
            resultWidth = settings.getGifSize sourceWidth
            resultHeight = sourceHeight * ratio

            canvas = $("<canvas>").get(0)
            context = canvas.getContext("2d")
            canvas.width = resultWidth
            canvas.height = resultHeight

            if settings.isCrop() then context.drawImage video,
              cropCoord.x, cropCoord.y, cropCoord.w, cropCoord.h, # source
              0, 0, resultWidth, resultHeight                     # dest
            else context.drawImage video,
              0, 0, resultWidth, resultHeight
            if settings.getEffectScript() isnt ""
              eval settings.getEffectScript()
            $("#result_image").attr "src", canvas.toDataURL()


# js/giraf/controller/_base.coffee

class Giraf.Controller._base extends Giraf._base
  # Giraf.Controller._base 

# js/giraf/controller/action.coffee

class Giraf.Controller.Action extends Giraf.Controller._base
  constructor: (app, action, args) ->
    switch action
      when "drop__import_file"
          fileList = args.fileList
          task = new Giraf.Task.FileLoader
          task.run app, fileList
          .fail ->
            console.log "failed"
      when "expert__project__refresh_composition"
          piece = app.view.expert.project.pieces[$(args.element).attr "data-uuid"]
          task = new Giraf.Task.RefreshComposition
          task.run app, piece.referer_uuid
          .fail ->
            console.log "failed"
      when "nav__append_point"
          app.view.nav.inactive()
          .then ->
            app.view.expert.node.appendPoint()
          .fail ->
            console.log "failed"
      when "expert__change_target"
          task = new Giraf.Task.ChangeSelected
          task.run app, ($(args.element).attr "data-uuid")
          .fail ->
            console.log "failed"
      when "nav__import_file"
          app.view.nav.inactive()
          .then ->
            task = new Giraf.Task.SelectFile
            task.run app
          .then (fileList) ->
            task = new Giraf.Task.FileLoader
            task.run app, fileList
          .fail ->
            console.log "failed"
      when "nav__new_composition"
          app.view.nav.inactive()
          .then ->
            task = new Giraf.Task.CreateNewComposition
            task.run app
          .fail ->
            console.log "failed"
      when "nav__hoge"
          app.view.nav.inactive()
          .then ->
            modal = new Giraf.View.Modal
            modal.show
              title: "たいとる"
              content: """
                       <b>ああああ</b>いいいい
                       """
              action:
                yes:
                  text: "はい"
                  primary: true
                no:
                  text: "いいえ"

      else
          console.log "Action '#{action}' is not defined."

# js/giraf/fileHandler.coffee

# hitode909/rokuga
# https://github.com/hitode909/rokuga
class Giraf.FileHandler
  constructor: (args) ->
    @$container = args.$container
    throw "$container required" unless @$container
    @$file_input = args.$file_input
    @bindEvents()

  bindEvents: ->
    @$container
    .on 'dragstart', =>
        true
    .on 'dragover', =>
        false
    .on 'dragenter', (event) =>
        if @$container.is event.target
          ($ this).trigger 'enter'
        false
    .on 'dragleave', (event) =>
        if @$container.is event.target
          ($ this).trigger 'leave'
    .on 'drop', (jquery_event) =>
        event = jquery_event.originalEvent
        files = event.dataTransfer.files
        if files.length > 0
          ($ this).trigger 'drop', [files]

          (@readFiles files).done (contents) =>
            ($ this).trigger 'data_url_prepared', [contents]

        false

    @$file_input.on 'change', (jquery_event) =>
      (@readFiles (@$file_input.get 0 ).files).done (contents) =>
        ($ this).trigger 'data_url_prepared', [contents]

  readFiles: (files) ->
    read_all = do $.Deferred
    contents = []
    i = 0

    role = =>
      if files.length <= i
        read_all.resolve contents
      else
        file = files[i++]
        (@readFile file).done (content) ->
          contents.push content
        .always ->
            do role

    do role

    do read_all.promise

  readFile: (file) ->
    read = do $.Deferred
    reader = new FileReader
    reader.onload = ->
      read.resolve reader.result
    reader.onerror = (error) ->
      read.reject error
    reader.readAsDataURL file

    do read.promise

# js/giraf/history.coffee

class Giraf.History extends Giraf._base


# js/giraf/model.coffee

class Giraf.Model extends Giraf._base
  constructor: ->
    @models = {}

  set: (uuid, model) ->
    @models[uuid] = model

  get: (uuid) ->
    return @models[uuid]

# js/giraf/model/_base.coffee

class Giraf.Model._base extends Giraf._base
  # Giraf.Model._base

# js/giraf/model/composition.coffee

class Giraf.Model.Compositions extends Giraf.Model._base

  @append: (app, name) ->
    d = new $.Deferred
    uuid = do Giraf.Tools.uuid
    app.model.set uuid,
      new Giraf.Model.Composition app, uuid, (name ? "New Composition")
    d.resolve uuid
    do d.promise

class Giraf.Model.Composition extends Giraf.Model._base

  constructor: (@app, @uuid, @name) ->
    @data =
      uuid: ""
      name: ""
      tumnbnail: ""
      effect:
        property:
          out_framerate: 12
          out_speed: 1
          out_size: 320
        script:
          script: ""
        crop: null
        keying: null
        color: null
        text: null
    @data.uuid = uuid
    @data.name = name

# js/giraf/model/file.coffee

class Giraf.Model.Files extends Giraf.Model._base
#
  @append: (app, file, content) ->
    d = new $.Deferred
    uuid = do Giraf.Tools.uuid
    app.model.set uuid,
      new Giraf.Model.File app, uuid, file, content
    d.resolve uuid
    do d.promise


class Giraf.Model.File extends Giraf.Model._base
  ###
    statusが変更されるときにstatusChangedが発火される
    null
    loading   ロード中（@contentがセットされていない）
    normal    ロード完了・通常状態（@contentがセットされている）
    dying     削除されるときに発火
  ###

  constructor: (@app, @uuid, @file, @content) ->
    @data =
      uuid: ""
      name: ""
      size: 0
      type: ""
      tumnbnail: ""
      file: null
      effect:
        property:
          in_time: -1
          in_tumnbnail: ""
          out_time: -1
          out_thumbnail: ""
          select_framerate: 12

    @status = if @content? then "normal" else "loading"
    @data.uuid = uuid
    @data.file = file
    @data.name = file.name
    @data.size = file.size
    @data.type = file.type

  setContent: (content) ->
    @content = content
    @status = "normal"
    $(@).triggerHandler "statusChanged", @status

  getContent: ->
    return @content

# js/giraf/settings.coffee

class Giraf.Settings extends Giraf._base

  constructor: (@app) ->
    cookieBinder = new Giraf.Settings.CookieBinder()

# js/giraf/settings/_base.coffee

class Giraf.Settings._base extends Giraf._base
  # Giraf.Settings._base

# js/giraf/settings/cookieBinder.coffee

class Giraf.Settings.CookieBinder extends Giraf.Settings._base

  constructor: (@app) ->
    $.cookie.json = true

  set: (data) ->
    $.cookie 'giraf',
      version: 100
      data: data

  get: ->
    return $.cookie 'giraf'

  clear: ->
    $.removeCookie 'giraf'

# js/giraf/task/_base.coffee

class Giraf.Task._base extends Giraf._base
  # Giraf.Task._base

# js/giraf/task/changeSelected.coffee

class Giraf.Task.ChangeSelected
  run: (app, uuid) ->
    d = do $.Deferred

    $.when (app.view.expert.project.select uuid),
           (app.view.expert.node.select uuid)
    .done =>
      do d.resolve

    do d.promise

# js/giraf/task/createNewComposition.coffee

class Giraf.Task.CreateNewComposition
  run: (app) ->
    d = do $.Deferred
    uuid = null
    Giraf.Model.Compositions.append app
    .then (uuid_) ->
      uuid = uuid_
      app.view.expert.project.append app.model.get uuid
      do d.resolve
    , ->
      do d.reject

    do d.promise

# js/giraf/task/fileLoader.coffee

class Giraf.Task.FileLoader extends Giraf.Task._base
  run: (app, files) ->
    d = do $.Deferred
    tasks = []

    for file in files
      continue unless file.type in [
        "video/mp4",
        "image/gif",
        "image/png",
        "image/jpeg",
      ]
      tasks.push do ->
        d_ = do $.Deferred
        uuid = null
        Giraf.Model.Files.append app, file
        .then (uuid_) ->
          d__= do $.Deferred
          uuid = uuid_
          app.view.expert.project.append app.model.get uuid
          readFile.call @, file
          .then (file, content) ->
            d__.resolve file, content
          do d__.promise
        .then (file, content) ->
          app.model.get(uuid).setContent content
        .then ->
          do d_.resolve
        , ->
          do d_.reject
        do d_.promise

    $.when.apply $, tasks
      .then ->
        do d.resolve
      , ->
        do d.reject

    do d.promise

  readFile = (file) ->
    d = do $.Deferred
    reader = new FileReader
    reader.onload = ->
      d.resolve file, reader.result
    reader.onerror = (error) ->
      d.reject error
    reader.readAsDataURL file

    do d.promise

# js/giraf/task/refreshComposition.coffee

class Giraf.Task.RefreshComposition
  run: (app, uuid) ->
    d = do $.Deferred
    model = app.model.get uuid
    if model instanceof Giraf.Model.File
      type = null
      switch model.file.type
        when "video/mp4"
          type = "video"
        when "image/gif", "image/png", "image/jpeg"
          type = "img"
        else

      do d.reject unless type?
      app.view.expert.composition.refresh type, model.content
      .then ->
        do d.resolve
      , ->
        do d.reject

    if model instanceof Giraf.Model.Composition
      app.view.expert.composition.refresh "img", null
      .then ->
        do d.resolve
      , ->
        do d.reject

    do d.promise

# js/giraf/task/selectFile.coffee

class Giraf.Task.SelectFile extends Giraf.Task._base
  run: (app) ->
    d = new $.Deferred
    inputId = "SelectFile"
    $input = $("##{inputId}")
    unless $input.get(0)?
      $("body").append """
                       <input type="file" name="file" id="#{inputId}" class="hidden" value="" multiple="multiple"/>
                       """
      $input = $("##{inputId}")

    $input.on "change", ->
      fileList = $input.get(0).files
      d.resolve fileList

    $input.trigger "click"
    do d.promise

# js/giraf/thumbnail.coffee

class Giraf.Thumbnail
  constructor: (@app, @id, @$canvas, @$video, @$backVideo) ->
    # @$video = $backVideo #$("<video>")
    @canvas = $canvas.get(0)
    @context = @canvas.getContext("2d")

    #@$video.attr "src", url
    #@canvas.width = 100
    #@canvas.height = 100

    #$backVideo.bind "timeupdate", =>
    #  $("#thumbnail_" + @id).removeClass "loading"
    #  @context.drawImage $backVideo.get(0), 0, 0, 320, 160

    @canvas.addEventListener "click", =>
      #$video.get(0).pause()
      @$video.get(0).currentTime = @time

  update: (@time) ->
    if time >= 0 or time <= @$video.duration
      $("#thumbnail_" + @id).addClass "loading"
      #$backVideo.get(0).currentTime = time

  draw: ->
    $("#thumbnail_" + @id).removeClass "loading"
    @context.drawImage @$backVideo.get(0), 0, 0, 320, 160

# js/giraf/thumbnails.coffee

class Giraf.Thumbnails
  constructor: (@app, @$video, @$backVideo) ->
    @thumbs = []
    @thumbs.push new Giraf.Thumbnail(@app, i, $("#thumbnail_#{i}"), @$video, @$backVideo) for i in [1..5]

  update: (settings) ->
    for i in [0...5]
      time = @$video.get(0).currentTime + (i - 2) * (1.0 / settings.getCaptureFrame())
      @thumbs[i].update(time)

    i = 0
    @$backVideo.on "timeupdate", =>
      if i >= 5
        @$backVideo.off "timeupdate"
      else
        @thumbs[i].draw()
        i++
        @$backVideo.get(0).currentTime = @$video.get(0).currentTime + (i - 2) * (1.0 / settings.getCaptureFrame())
    @$backVideo.get(0).currentTime = @$video.get(0).currentTime - 2 * (1.0 / settings.getCaptureFrame())

# js/giraf/timeline.coffee

class Giraf.Timeline
  constructor: (@timelines, @number, @$video) ->
    @start = null
    @stop = null
    @selected = false

    @$timeline = $("#timeline_skeleton").clone()
    @$timeline.attr "id", number
    @$timeline.appendTo $("#timeline_holder")

    @startCanvas = @$timeline.find(".timeline-start").get(0)
    @stopCanvas = @$timeline.find(".timeline-stop").get(0)

    @$timeline.bind "click", =>
      timelines.setSelected @

    @$timeline.find(".close").bind "click", =>
      @.remove()

  setStartTime: (time) ->
    @start = time
    ctx = @startCanvas.getContext("2d")
    ctx.drawImage @$video.get(0), 0, 0, 320, 160

  setStopTime: (time) ->
    @stop = time
    ctx = @stopCanvas.getContext("2d")
    ctx.drawImage @$video.get(0), 0, 0, 320, 160

  isValidTime: ->
    if @start? and @stop? then true else false

  setSelected: (bool) ->
    @selected = bool
    if bool
      @$timeline.css "border-color", "red"
    else
      @$timeline.css "border-color", ""

  getNumber: ->
    return @$timeline.attr "id"

  getSelected: ->
    return @selected

  getFrameList: (settings) ->
    if not @.isValidTime()
      throw "start and stop time must fill"
    arr = []
    i = 0
    time = @start

    while (@start <= @stop and time <= @stop)or(@start > @stop and time >= @stop)
      arr.push(time)
      i++
      diff = i / settings.getCaptureFrame()
      if @start <= @stop then time = @start + diff
      else time = @start - diff

    return arr

  remove: ->
    @timelines.removeTimeline @
    @$timeline.remove()

# js/giraf/timelines.coffee

class Giraf.Timelines
  constructor: (@$video) ->
    @tls = []
    @number = 1

    $("#add_timeline").bind "click", =>
      @tls.push new Giraf.Timeline @, @number, @$video
      @number++
      @.updateMakeButton()
    .trigger "click"
    @tls[0].setSelected true

  setStartTime: (time) ->
    tl = @.getSelected()
    if tl? then tl.setStartTime time

  setStopTime: (time) ->
    tl = @.getSelected()
    if tl? then tl.setStopTime time

  setSelected: (tl) ->
    for i in @tls
      i.setSelected false
    tl.setSelected true

  getSelected: ->
    for i in @tls
      if i.getSelected()
        return i

  getFrameList: (settings) ->
    arr = []
    for tl in @tls
      arr.push(i) for i in tl.getFrameList settings
    return arr

  removeTimeline: (tl) ->
    for k, v of @tls
      if v is tl
        @tls.splice(k, 1)
    @updateMakeButton()

  updateOrder: ->
    arr = []
    num = $("#timeline_holder").sortable("toArray")
    for i in num
      for tl in @tls
        if tl.getNumber() is i then arr.push tl
    @tls = arr

  updateMakeButton: ->
    a = true
    for tl in @tls
      a = a and tl.isValidTime()
    if a and @tls.length > 0 then $("#make").removeClass "disabled" else $("#make").addClass "disabled"

# js/giraf/tools.coffee

class Giraf.Tools extends Giraf._base
  @uuid: ->
    # http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    s4 = ->
      return `(((1+Math.random())*0x10000)|0).toString(16).substring(1)`
    return `s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+ s4()+s4()+s4()`

# js/giraf/view.coffee

class Giraf.View extends Giraf._base
  _selector_nav = "nav"
  _selector_quick = "#quick"
  _selector_expert = "#expert"

  constructor: (@app) ->
    @nav = new Giraf.View.Nav app, $(_selector_nav)
    @expert = new Giraf.View.Expert app, $(_selector_expert)

    $(document).on "click", (event) =>
      $t = $ event.target
      if $t.attr("data-action")?
        _.each $t.attr("data-action").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target
      if $t.attr("data-action-weak")?
        _.each $t.attr("data-action-weak").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target
      if $t.attr("data-action-click")?
        _.each $t.attr("data-action-click").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target
      if $t.attr("data-action-click-weak")?
        _.each $t.attr("data-action-click-weak").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target

      $t.parents("[data-action]").each ->
        _.each $(@).attr("data-action").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: @
      $t.parents("[data-action-click]").each ->
        _.each $(@).attr("data-action-click").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: @

    .on "dblclick", (event) =>
      $t = $ event.target
      if $t.attr("data-action-dblclick")?
        _.each $t.attr("data-action-dblclick").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target
      if $t.attr("data-action-dblclick-weak")?
        _.each $t.attr("data-aciton-dblclick-weak").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target

      $t.parents("[data-action-dblclick]").each ->
        _.each $(@).attr("data-action-dblclick").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: @

# js/giraf/view/_base.coffee

class Giraf.View._base extends Giraf._base
  # Giraf.View._base

# js/giraf/view/expert.coffee

class Giraf.View.Expert extends Giraf.View._base
  _selector_container = "#expert_container"
  _selector_project = "#expert_project > .panel-container"
  _selector_composition = "#expert_composition > .panel-container"
  _selector_effect = "#expert_effect > .panel-container"
  _selector_node = "#expert_node > .panel-container"

  constructor: (@app, @$expert) ->
    @project = new Giraf.View.Expert.Project app, $expert.find _selector_project
    @composition = new Giraf.View.Expert.Composition app, $expert.find _selector_composition
    @effect = new Giraf.View.Expert.Effect app, $expert.find _selector_effect
    @node = new Giraf.View.Expert.Node app, $expert.find _selector_node
    @droparea = new Giraf.View.Expert.Droparea app, $expert



# js/giraf/view/expert/_base.coffee

class Giraf.View.Expert._base extends Giraf.View._base
  # Giraf.View.Expert._base

# js/giraf/view/expert/composition.coffee

class Giraf.View.Expert.Composition extends Giraf.View.Expert._base
  constructor: (@app, @$composition) ->
    template = _.template """
                          <div class="composition-window">
                            <div class="composition-window-placeholder">
                              <span>Composition</span>
                              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores corporis delectus, doloremque eligendi explicabo fugit harum iusto magnam minus natus non odit officia perspiciatis possimus provident quo similique, suscipit tempora!</p><p>Aut ea eveniet facere officia placeat qui quod soluta! A autem commodi culpa cum, dignissimos dolorum eveniet, explicabo minima nesciunt nisi, officia omnis optio quae quas quia reiciendis rem unde?</p><p>Assumenda consectetur corporis et magnam voluptate. Ab aut beatae corporis cum dolorem dolores eius est expedita fuga hic, ipsum nobis quasi quibusdam quo recusandae soluta temporibus ut veniam vitae voluptatem?</p><p>Cupiditate dignissimos dolore dolorum ducimus enim, et explicabo fugit illo ipsa ipsam itaque laborum maiores nemo obcaecati quas quia quis similique! Autem consectetur dignissimos laudantium magni odit tenetur veniam vero.</p><p>Ab amet debitis dolorem est eveniet explicabo illum incidunt libero, magni minima, natus numquam omnis placeat porro quisquam saepe tempora voluptate! Aliquam eius error facere, maiores numquam vel veniam voluptatum.</p><p>Aliquid, assumenda consectetur cum cumque deserunt distinctio expedita fugit harum impedit magnam nemo nihil nobis perspiciatis ratione repellat sed, suscipit. At atque eos in molestias, nesciunt quas reiciendis. Consequuntur, ipsum.</p>
                            </div>
                            <img class="composition-img hidden"/>
                            <video class="composition-video hidden" controls></video>
                          </div>
                          <div class="composition-progress">
                            <progress value="0" max="100"></progress>
                          </div>
                          """
    @$composition.append template {}

  refresh: (type, content_url) ->
    d = do $.Deferred
    switch type
      when "video"
        $video = $ "video.composition-video"
        do d.reject unless $video.get(0)?
        $(".composition-window").children().each ->
          $(@).addClass "hidden"
        $video.removeClass "hidden"
          .attr "src", content_url
          .one "canplay", ->
            do d.resolve
      when "img"
        $img = $ "img.composition-img"
        do d.reject unless $img.get(0)?
        $(".composition-window").children().each ->
          $(@).addClass "hidden"
        $img.removeClass "hidden"
          .attr "src", content_url
        do d.resolve
      else
        console.log "Type '#{type}' is not defined."
        do d.resolve

    do d.promise

# js/giraf/view/expert/droparea.coffee

class Giraf.View.Expert.Droparea extends Giraf.View.Expert._base
  isActive = false
  innerAcitve = 0

  constructor: (@app, @$droparea) ->
    $droparea
      .on "dragstart", =>
        true
      .on "dragover", =>
        false
      .on "dragenter", (event) =>
        if isActive
          innerAcitve++
        else
          for item in event.originalEvent.dataTransfer.items
            if item.type in [
              "video/mp4",
              "image/gif",
              "image/png",
              "image/jpeg",
            ]
              do @show
              break
        false
      .on "dragleave", =>
        if innerAcitve > 0
          innerAcitve--
        else
          do @hide
      .on "drop", (event) =>
        innerAcitve = false
        do @hide
        files = event
          .originalEvent
          .dataTransfer
          .files
        if files.length > 0
          Giraf.Controller.Action app, "drop__import_file",
            fileList: files
        false

  show: ->
    isActive = true
    template = _.template """
                          <div class="droparea">
                            <div class="droparea-label">
                              <h3>ドロップでファイル読み込み</h3>
                            </div>
                          </div>
                          """
    @$droparea.append template()

  hide: ->
    isActive = false
    do $(".droparea").remove

# js/giraf/view/expert/effect.coffee

class Giraf.View.Expert.Effect extends Giraf.View.Expert._base
  constructor: (@app, @$effect) ->
    template = _.template """
                          <div class="effect-content hidden" data-effect-content="property"><%= property %></div>
                          <div class="effect-content hidden" data-effect-content="script"><%= script %></div>
                          <div class="effect-content hidden" data-effect-content="crop"><%= crop %></div>
                          <div class="effect-content hidden" data-effect-content="keying"><%= keying %></div>
                          <div class="effect-content hidden" data-effect-content="color"><%= color %></div>
                          <div class="effect-content hidden" data-effect-content="text"><%= text %></div>
                          <div class="effect-tab layer"></div>
                          <ul class="effect-tab">
                            <li class="effect-tab-menu girafont" data-change-effect-tab="property">parameter</li>
                            <li class="effect-tab-menu girafont" data-change-effect-tab="script">magic</li>
                            <li class="effect-tab-menu girafont" data-change-effect-tab="crop">crop</li>
                            <li class="effect-tab-menu girafont" data-change-effect-tab="keying">keying</li>
                            <li class="effect-tab-menu girafont" data-change-effect-tab="color">palette</li>
                            <li class="effect-tab-menu girafont" data-change-effect-tab="text">text</li>
                          </ul>
                          """
    @$effect.append template
      property: """
                <form id="form_effect_property" name="effect_property">
                  <fieldset class="effect-parameter-group">
                    <label for="select_out_framerate" class="half">出力するフレームレート</label>
                    <select name="out_framerate" id="select_out_framerate" class="half" data-load="effect.property.out_framerate">
                      <option value="1">1fps</option>
                      <option value="2">2fps</option>
                      <option value="3">3fps</option>
                      <option value="4">4fps</option>
                      <option value="6">6fps</option>
                      <option value="8">8fps</option>
                      <option value="12">12fps</option>
                      <option value="15">15fps</option>
                      <option value="24">24fps</option>
                      <option value="30">30fps</option>
                    </select>
                  </fieldset>
                  <fieldset class="effect-parameter-group">
                    <label for="input_out_speed" class="half">出力するスピード</label>
                    <input type="number" id="input_out_speed" class="half" data-load="effect.property.out_speed"/>
                    <input type="range" min="0.1" max="4.0" step="0.1" data-load="effect.property.out_speed"/>
                  </fieldset>
                  <fieldset class="effect-parameter-group">
                    <label for="input_out_size" class="half">出力する大きさ</label>
                    <input type="number" id="input_out_size" class="half" data-load="effect.property.out_speed"/>
                    <input type="range" min="40" max="720" data-load="effect.property.out_size"/>
                  </fieldset>
                  <fieldset class="effect-parameter-group">
                    <legend>切り取り位置を選択</legend>
                    <label for="" class="half">始点</label>
                    <label for="" class="half">終点</label>
                    <img src="" class="half"/>
                    <img src="" class="half"/>
                    <input type="hidden" data-load="effect.property.in_time"/>
                    <input type="hidden" data-load="effect.property.out_time"/>
                  </fieldset>
                  <fieldset class="effect-parameter-group">
                    <label for="select_select_framerate" class="half">切り取りフレームレート</label>
                    <select name="select_framerate" id="select_select_framerate" class="half" data-load="effect.property.select_framerate">
                      <option value="1">1fps</option>
                      <option value="2">2fps</option>
                      <option value="3">3fps</option>
                      <option value="4">4fps</option>
                      <option value="6">6fps</option>
                      <option value="8">8fps</option>
                      <option value="12">12fps</option>
                      <option value="15">15fps</option>
                      <option value="24">24fps</option>
                      <option value="30">30fps</option>
                    </select>
                    <div class="half"></div>
                    <button class="half">動画からコンポジションを作成</button>
                  </fieldset>
                </form>
                """
      script:   """
                <form id="form_effect_script" name="effect_script">
                  <fieldset class="effect-parameter-group">
                    <legend>効果を追加</legend>
                    <label for="textarea_script" class="half">プリセット</label>
                    <button class="half"><span class="girafont">lightning</span>プリセットを選択</button>
                    <textarea name="script" id="textarea_script" cols="30" rows="10" data-load="effect.script.script"></textarea>
                  </fieldset>
                </form>
                """
      crop:     """
                <form id="form_effect_crop" name="effect_crop">
                </form>
                """
      keying:   """
                <form id="form_effect_keying" name="effect_keying">
                </form>
                """
      color:    """
                <form id="form_effect_color" name="effect_color">
                </form>
                """
      text:     """
                <form id="form_effect_text" name="effect_text">
                </form>
                """
    self = @
    $("li.effect-tab-menu").on "click", ->
      self.changeTab ($(@).attr "data-change-effect-tab")
    @changeTab "property"

  changeTab: (name) ->
    $("li.effect-tab-menu").each ->
      $(@).removeClass "selected"
    $("li.effect-tab-menu[data-change-effect-tab=#{name}]")
      .addClass "selected"

    $(".effect-content").each ->
      $(@).addClass "hidden"
    $(".effect-content[data-effect-content=#{name}]")
      .removeClass "hidden"

  changeTarget: (@target_uuid) ->
    self = @
    $("[data-load").each ->
      data = self.app.model.get(target_uuid).data
      _.each $(@).attr("data-load").split("."), (t) =>
        data = data?[t]
      if data
        $(@).parents ".effect-parameter-group"
            .removeClass "hidden"
        $(@).val data
      else
        $(@).parents ".effect-parameter-group"
            .addClass "hidden"

# js/giraf/view/expert/node.coffee

class Giraf.View.Expert.Node extends Giraf.View.Expert._base

  constructor: (@app, @$node) ->
    @pieces = {}
    @corkboardWidth = 3000
    @corkboardHeight = 3000

    @svg = new Giraf.View.Expert.Node.SVG app, @corkboardWidth, @corkboardHeight

    template = _.template """
                          <div class="node-corkboard-container">
                            <div class="node-corkboard">
                              <div id="node_corkboard_svg"></div>
                            </div>
                          </div>
                          """
    $node.append template()

    $node.find ".node-corkboard"
      .css "width", "#{@corkboardWidth}px"
      .css "height", "#{@corkboardHeight}px"

    $node.on "drop", (event) =>
      oe = event.originalEvent
      referer_uuid = oe.dataTransfer.getData "referer_uuid"
      if referer_uuid
        @appendComposition (app.model.get referer_uuid), oe.offsetX, oe.offsetY

  appendPoint: (x, y) ->
    d = do $.Deferred
    x ?= @$node.scrollLeft() + @$node.width() / 2
    y ?= @$node.scrollTop() + @$node.height() / 2
    @svg.addPoint x, y
    do d.resolve

    do d.promise

  appendComposition: (referer, x, y) ->
    d = do $.Deferred
    x ?= @$node.scrollLeft() + @$node.width() / 2
    y ?= @$node.scrollTop() + @$node.height() / 2
    @svg.addComposition referer, x, y
    do d.resolve

    do d.promise

  select: (uuid) ->
    d = do $.Deferred
    _.each @svg.pieces, (v, k) =>
      v.select (k is uuid)
    do d.resolve

    do d.promise


class Giraf.View.Expert.Node.SVG extends Giraf.View.Expert._base
  @D3 = {}
  @pieces = {}
  @hoveredContent = null

  constructor: (@app, @width, @height) ->
    @D3 = {}
    @pieces = {}
    $ =>
      @D3.svg = d3.select "#node_corkboard_svg"
        .append "svg"
        .attr "width", width
        .attr "height", height
      @D3.svg.defs = @D3.svg.append "defs"
      @D3.svg.nodeLayer = @D3.svg.append "g"
      @D3.svg.contentLayer = @D3.svg.append "g"
        .on "mousemove", =>
          $node = $ d3.event.target
          uuid = $node.parents("[data-uuid]")?.attr("data-uuid")
          @hoveredContent = uuid ? null
      @D3.svg.contentLayer.append "rect"
        .attr
          x: 0
          y: 0
          width: width
          height: height
          fill: "transparent"
      @D3.svg.overLayer = @D3.svg.append "g"

  addComposition: (referer, x, y) ->
    x = Math.min (Math.max x, 0), @width
    y = Math.min (Math.max y, 0), @height
    piece = null
    uuid = do Giraf.Tools.uuid
    if referer instanceof Giraf.Model.Composition
      piece = new Giraf.View.Expert.Node.Piece.Composition @, uuid, referer
    if piece?
      @pieces[uuid] = piece
      piece.draw()
        .move x, y

  addPoint: (x, y) ->
    x = Math.min (Math.max x, 0), @width
    y = Math.min (Math.max y, 0), @height
    uuid = do Giraf.Tools.uuid
    piece = new Giraf.View.Expert.Node.Piece.Point @, uuid
    @pieces[uuid] = piece
    piece.draw().move x, y

  addArrow: (from, to) ->
    return if (not from?) and (not to?)
    arrow = {}
    arrow.from = from if from?
    arrow.to = to if to?
    cdn = @getLineCoordinate from, to
    arrow.line = @svg.line cdn.x1, cdn.y1, cdn.x2, cdn.y2
      .stroke
        width: 2
    @arrows.push arrow

  updateArrow: (moveObject) ->
    @arrows.forEach (arrow) =>
      if not moveObject? \
      or (arrow.from?.uuid is moveObject.uuid or arrow.to?.uuid is moveObject.uuid)
        cdn = @getLineCoordinate arrow.from, arrow.to
        arrow.line.plot cdn.x1, cdn.y1, cdn.x2, cdn.y2

  getLineCoordinate: (from, to) ->
    return if (not from?) and (not to?)
    cdn = {}
    if from?
      cdn.x1 = from.x
      cdn.y1 = from.y
      if to?
        cdn.x2 = to.x
        cdn.y2 = to.y
      else
        cdn.x2 = from.x + 100
        cdn.y2 = from.y
    else
      cdn.x1 = to.x - 100
      cdn.y1 = to.y
      cdn.x2 = to.x
      cdn.y2 = to.y
    return cdn


class Giraf.View.Expert.Node.Piece extends Giraf.View.Expert._base
  @x = 0
  @y = 0


class Giraf.View.Expert.Node.Piece.Content extends Giraf.View.Expert.Node.Piece
  constructor: (@svg) ->
    @controllable = true

  controll: (bool) ->
    @controllable = bool
    return @

  select: (bool) ->

  target: (bool) ->


class Giraf.View.Expert.Node.Piece.Over extends Giraf.View.Expert.Node.Piece
  constructor: (@svg) ->


class Giraf.View.Expert.Node.Piece.Composition extends Giraf.View.Expert.Node.Piece.Content
  @destination = null

  data =
    width: 120
    height: 80
    rect:
      radius: 6
      color: "#3E90BA"
    text:
      x: 0
      y: -25
      fontSize: 11
      fontWeight: 20
      color: "white"
    hook:
      x: 45
      y: 0

  constructor: (@svg, @uuid, referer) ->
    super svg
    @app = svg.app
    @referer_uuid = referer.uuid
    @d3svg = svg.D3.svg

  move: (x, y) ->
    @x = Math.min (Math.max x, 0), @svg.width
    @y = Math.min (Math.max y, 0), @svg.height
    @d3composition?.attr "transform", "translate(#{@x}, #{@y})"
    return @

  draw: ->
    $ =>
      d3compositionEventHandler =
        d3.behavior.drag()
          .on "dragstart", =>
            d3.event.sourceEvent.stopPropagation()
            @controll false
            @d3svg.attr "cursor", "move"
          .on "drag", =>
            @move d3.event.x, d3.event.y
          .on "dragend", =>
            @controll true
            @d3svg.attr "cursor", null
      d3hookEventHandler =
        d3.behavior.drag()
          .on "dragstart", =>
            d3.event.sourceEvent.stopPropagation()
            _.each @svg.pieces, (v) => v.controll false
            @d3svg.attr "cursor", "none"
            @arrow = new Giraf.View.Expert.Node.Piece.Arrow @svg
            @arrow.draw()
              .move  @x + data.hook.x, @y + data.hook.y,
                     @x + data.hook.x, @y + data.hook.y
          .on "drag", =>
            _.each @svg.pieces, (v, k) =>
              if @svg.hoveredContent is k and k isnt @uuid
                v.target true
              else
                v.target false
            @arrow.move @x + data.hook.x, @y + data.hook.y,
                        @x + d3.event.x,  @y + d3.event.y
          .on "dragend", =>
            @d3svg.attr "cursor", null
            _.each @svg.pieces, (v) =>
              v.target false
               .controll true
            do @arrow.remove
            @arrow = null

      @d3composition = @d3svg.contentLayer.append "g"
        .attr
          "data-uuid": @uuid
          "data-action-dblclick": "expert__change_target"
        .call d3compositionEventHandler
      @d3rect = @d3composition.append "rect"
        .attr
          x: (-data.width / 2)
          y: (-data.height / 2)
          width: data.width
          height: data.height
          rx: data.rect.radius
          ry: data.rect.radius
          fill: data.rect.color
      @d3text = @d3composition.append "text"
        .text (@app.model.get @referer_uuid)?.name
        .attr
          x: data.text.x
          y: data.text.y
          "font-size": data.text.fontSize
          "font-weight": data.text.fontWeight
          "text-anchor": "middle"
          "fill": data.text.color
      @d3circleDot = @d3composition.append "circle"
        .attr
          cx: data.hook.x
          cy: data.hook.y
          r: 3.5
          fill: "white"
          opacity: 0
      @d3circleHook = @d3composition.append "circle"
        .attr
          cx: data.hook.x
          cy: data.hook.y
          r: 6
          stroke: "white"
          "stroke-width": 1.5
          fill: "transparent"
        .on "mouseover", => @d3circleDot.attr "opacity", 1 if @controllable
        .on "mouseout", => @d3circleDot.attr "opacity", 0
        .call d3hookEventHandler

    return @

  target: (bool) ->
    super bool
    if bool
      @d3hover ?= @d3composition.append "rect"
        .attr
          x: (-data.width / 2)
          y: (-data.height / 2)
          width: data.width
          height: data.height
          rx: data.rect.radius
          ry: data.rect.radius
          fill: "transparent"
          stroke: "white"
          "stroke-width": 2
    else
      do @d3hover?.remove
      @d3hover = null
    return @

  select: (bool) ->
    super bool
    if bool
      @d3rect?.attr
        stroke: "orange"
        "stroke-width": 1
      @app.view.expert.effect.changeTarget @referer_uuid
    else
      @d3rect?.attr
        "stroke-width": 0
    return @


class Giraf.View.Expert.Node.Piece.Point extends Giraf.View.Expert.Node.Piece.Content
  @source = null

  data =
    width: 40
    height: 40
    rect:
      radius: 6
      color: "#D59B0A"
    hook:
      x: 0
      y: 0

  constructor: (@svg, @uuid) ->
    super svg
    @d3svg = svg.D3.svg

  move: (x, y) ->
    @x = Math.min (Math.max x, 0), @svg.width
    @y = Math.min (Math.max y, 0), @svg.height
    @d3point?.attr "transform", "translate(#{@x}, #{@y})"
    return @

  draw: ->
    $ =>
      d3pointEventHandler =
        d3.behavior.drag()
          .on "dragstart", =>
            d3.event.sourceEvent.stopPropagation()
            @controll false
            @d3svg.attr "cursor", "move"
          .on "drag", =>
            @move d3.event.x, d3.event.y
          .on "dragend", =>
            @controll true
            @d3svg.attr "cursor", null
      d3hookEventHandler =
        d3.behavior.drag()
          .on "dragstart", =>
            d3.event.sourceEvent.stopPropagation()
            _.each @svg.pieces, (v) => v.controll false
            @d3svg.attr "cursor", "none"
            @arrow = new Giraf.View.Expert.Node.Piece.Arrow @svg
            @arrow.draw()
              .move  @x + data.hook.x, @y + data.hook.y,
                     @x + data.hook.y, @y + data.hook.y
          .on "drag", =>
            _.each @svg.pieces, (v, k) =>
              if @svg.hoveredContent is k and k isnt @uuid
                v.target true
              else
                v.target false
            @arrow.move @x + data.hook.x, @y + data.hook.y,
                        @x + d3.event.x,  @y + d3.event.y
          .on "dragend", =>
            @d3svg.attr "cursor", null
            _.each @svg.pieces, (v) =>
              v.target false
               .controll true
            do @arrow.remove
            @arrow = null
      @d3point = @d3svg.contentLayer.append "g"
        .attr
          "data-uuid": @uuid
        .call d3pointEventHandler
      @d3rect = @d3point.append "rect"
        .attr
          x: (-data.width / 2)
          y: (-data.height / 2)
          width: data.width
          height: data.height
          rx: data.rect.radius
          ry: data.rect.radius
          fill: data.rect.color
      @d3circleDot = @d3point.append "circle"
        .attr
          cx: data.hook.x
          cy: data.hook.y
          r: 3.5
          fill: "white"
          opacity: 0
      @d3circleHook = @d3point.append "circle"
        .attr
          cx: data.hook.x
          cy: data.hook.y
          r: 6
          stroke: "white"
          "stroke-width": 1.5
          fill: "transparent"
        .on "mouseover", => @d3circleDot.attr "opacity", 1 if @controllable
        .on "mouseout", => @d3circleDot.attr "opacity", 0
        .call d3hookEventHandler

    return @

  target: (bool) ->
    super bool
    if bool
      @d3hover ?= @d3point?.append "rect"
        .attr
          x: (-data.width / 2)
          y: (-data.height / 2)
          width: data.width
          height: data.height
          rx: data.rect.radius
          ry: data.rect.radius
          fill: "transparent"
          stroke: "white"
          "stroke-width": 2
    else
      do @d3hover?.remove
      @d3hover = null
    return @

  select: (bool) ->
    super bool
    if bool
      @d3rect?.attr
        stroke: "orange"
        "stroke-width": 1
    else
      @d3rect?.attr
        "stroke-width": 0
    return @


class Giraf.View.Expert.Node.Piece.Arrow extends Giraf.View.Expert.Node.Piece.Over
  @x1 = 0
  @y1 = 0
  @x2 = 0
  @y2 = 0

  constructor: (@svg) ->
    super svg
    @uuid = do Giraf.Tools.uuid
    @d3svg = svg.D3.svg

  move: (@x1, @y1, @x2, @y2) ->
    @d3arrow?.attr
      x1: @x1
      y1: @y1
      x2: @x2
      y2: @y2
    return @

  draw: ->
    $ =>
      @d3arrowTail = @d3svg.defs.append "marker"
        .attr
          id: "#{@uuid}_arrow_tail"
          refX: 2
          refY: 2
          markerWidth: 4
          markerHeight: 4
          orient: "auto"
      @d3arrowTail.append "circle"
        .attr
          cx: 2
          cy: 2
          r: 1.75
          fill: "white"
      @d3arrowHead = @d3svg.defs.append "marker"
        .attr
          id: "#{@uuid}_arrow_head"
          refX: 0
          refY: 3
          markerWidth: 6
          markerHeight: 6
          orient: "auto"
      @d3arrowHead.append "path"
        .attr
          d: "M0,0 V6 L6,3 Z"
          fill: "white"
      @d3arrow = @d3svg.overLayer.append "line"
        .attr
          x1: @x1
          y1: @y1
          x2: @x2
          y2: @y2
          stroke: "white"
          "stroke-width": 2
          "stroke-dasharray": "7,5"
          "marker-start": "url(##{@uuid}_arrow_tail)"
          "marker-end": "url(##{@uuid}_arrow_head)"

    return @

  remove: ->
    do @d3arrowTail?.remove
    do @d3arrowHead?.remove
    do @d3arrow?.remove
    return @



# js/giraf/view/expert/project.coffee

class Giraf.View.Expert.Project extends Giraf.View.Expert._base

  constructor: (@app, @$project) ->
    @pieces = {}

  append: (referer) ->
    piece = null
    uuid = do Giraf.Tools.uuid
    if referer instanceof Giraf.Model.File
      piece = new Giraf.View.Expert.Project.Piece.File @app, uuid, referer
    if referer instanceof Giraf.Model.Composition
      piece = new Giraf.View.Expert.Project.Piece.Composition @app, uuid, referer
    if piece?
      @pieces[uuid] = piece
      @$project.append do piece.html

      return uuid

  select: (uuid) ->
    d = do $.Deferred
    _.each @pieces, (v, k) =>
      v.select (k is uuid)
    do d.resolve

    do d.promise


###
            File                  Composition
  referer   Model.File            Model.Composition
  type      "file"                "composition"
  title     referer.file.name     referer.name
###

class Giraf.View.Expert.Project.Piece
  constructor: (@app, @uuid, referer, @type, @title) ->
    @referer_uuid = referer.uuid
    $(referer).on "statusChanged", (event, status) =>
      $target = $ ".project-piece[data-uuid=#{uuid}]"
      switch status
        when "loading"
          $target.addClass "loading"
        when "normal"
          $target.removeClass "loading"
        when "dying"
          do $target.remove
        else

  html: ->
    template = _.template """
                          <div class="project-piece" draggable="true" data-referer-type="<%- type %>" data-uuid="<%- uuid %>"
                           data-action-click="expert__change_target" data-action-dblclick="expert__project__refresh_composition">
                            <div class="project-piece-tag"></div>
                            <div class="project-piece-content">
                              <img class="project-piece-thumbnail"/>
                              <div class="project-piece-title"><%- title %></div>
                            </div>
                          </div>
                          """
    $rtn = $ template
      type: @type ? ""
      uuid: @uuid ? ""
      title: @title ? ""
    $rtn.on "dragstart", (event) =>
      event.originalEvent.dataTransfer.setData "referer_uuid", @referer_uuid
    return $rtn.get(0)

  select: (bool) ->
    $target = $ ".project-piece[data-uuid=#{@uuid}]"
    if bool
      $target.addClass "selected"
      @app.view.expert.effect.changeTarget @referer_uuid
    else
      $target.removeClass "selected"


class Giraf.View.Expert.Project.Piece.File extends Giraf.View.Expert.Project.Piece
  constructor: (@app, @uuid, referer) ->
    super app, uuid, referer, "file", referer.file.name

  html: ->
    $rtn = $ super()
    if @app.model.get(@referer_uuid).status is "loading"
      $rtn.addClass "loading"
    return $rtn.get(0)

class Giraf.View.Expert.Project.Piece.Composition extends Giraf.View.Expert.Project.Piece
  constructor: (@app, @uuid, referer) ->
    super app, uuid, referer, "composition", referer.name

# js/giraf/view/modal.coffee

class Giraf.View.Modal extends Giraf.View._base

  constructor: ->

  show: (args) ->
    template =  _.template """
                <div class="modal">
                  <div class="modal-dialog">
                    <div class="modal-title"><h3><%- title %></h3></div>
                    <div class="modal-content"><%= content %></div>
                    <div class="modal-action"><%= action %></div>
                  </div>
                </div>
                """
    args.title ?= ""
    args.content ?= ""
    action = createButtonDOM.call @, args.action
    $("body").append template
      title: args.title
      content: args.content
      action: action

    $(".modal").on
      click: (event) ->
        if $(event.target).hasClass("modal")
          onEnd = ->
            do $(".modal").remove

          $(".modal-dialog").bind "transitionend", onEnd
          $(".modal").removeClass "show"

    setTimeout ->
      $(".modal").addClass "show"
    , 0


  createButtonDOM = (data) ->
    arr = []
    for key, value of data
      button = _.template """
                          <button
                            <% if (primary === true) { print('class="button-primary"'); } %>
                          >
                            <%- text %>
                          </button>
                          """
      arr.push button
        primary: value.primary is true
        text: value.text
    return arr.join ""


# js/giraf/view/nav.coffee

class Giraf.View.Nav extends Giraf.View._base
  _selector_dropdown = "li.dropdown"

  $dropdowns = null
  isActive = false


  constructor: (@app, @$nav) ->
    $dropdowns = @$nav.find _selector_dropdown

    self = @
    $dropdowns
      .on "mouseenter", ->
        self.active @ if isActive

    $(document).on "click", (event) ->
      if not $.contains $nav.get(0), event.target
        do self.inactive
      else if $(event.target).hasClass "dropdown-toggle"
        if not isActive
          self.active $(event.target).parent(".dropdown")
        else
          do self.inactive


  active: (target) ->
    d = new $.Deferred
    isActive = true
    $dropdowns.each (index, element) ->
      $(element).removeClass "open"
    $(target).addClass "open"
    setTimeout ->
      do d.resolve
    , 30
    do d.promise

  inactive: ->
    d = new $.Deferred
    isActive = false
    $dropdowns.each (index, element) ->
      $(element).removeClass "open"
    setTimeout ->
      do d.resolve
    , 30
    do d.promise

  isActive: ->
    return isActive

# js/giraf/view/quick.coffee

class Giraf.View.Quick extends Giraf.View._base
  selector_preview = "#quick_preview"
  selector_thumbnail = "#quick_thumbnail"
  selector_timeline = "#quick_timeline"
  selector_result = "#quick_result"

  constructor: (@$quick) ->

# js/giraf/view/quick/_base.coffee

class Giraf.View.Quick._base extends Giraf.View._base
  # Giraf.View.Quick._base

app = new Giraf.App
app.run()