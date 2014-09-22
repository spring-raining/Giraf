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