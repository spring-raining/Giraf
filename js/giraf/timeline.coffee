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