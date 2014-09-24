class Giraf.App extends Giraf._base

  run: =>
    $ =>
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
