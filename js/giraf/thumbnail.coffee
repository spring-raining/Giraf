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