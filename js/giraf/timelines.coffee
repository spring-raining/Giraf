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