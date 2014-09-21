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