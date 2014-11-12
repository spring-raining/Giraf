class Giraf.View.Expert.Composition.Controller extends Giraf.View._base
  constructor: (args) ->
    @app = args.app
    @$controller = args.$controller
    @$img = args.$img
    @$video = args.$video

    @mode = "none"
    @frame = 1.0 / 12

    @$controller.append """
         <div class="girafont composition-controller-previous">previous</div>
         <div class="girafont composition-controller-play">play</div>
         <div class="girafont composition-controller-next">next</div>
         <div class="composition-controller-seek">
           <div class="composition-controller-seek-handle"></div>
         </div>
         <div class="composition-controller-timer">00:00:00</div>
         <div class="compsitilon-controller-volume">
           <div class="composition-controller-volume-slider"></div>
           <div class="compsition-controller-volume-button"></div>
         </div>
         """

    @$play =   @$controller.find ".composition-controller-play"
    @$seek =   @$controller.find ".composition-controller-seek"
    @$timer =  @$controller.find ".composition-controller-timer"
    @$volume = @$controller.find ".composition-controller-volume"
    @$volumeSlider = @$controller.find ".composition-controller-volume-slider"
    @$volumeButton = @$controller.find ".composition-controller-volume-button"

    console.log @$play.get(0)
    @$play.on "click", =>
      do @play


  play: (bool) ->
    if @mode is "video"
      if @$video.get(0).paused or bool
        do @$video.get(0).play
        @$play.text "pause"
      else if not @$video.get(0).paused or not bool
        do @$video.get(0).pause
        @$play.text "play"

  pause: ->

  seek: (timeOrFrame) ->

  volume: (value) ->

  nextFrame: (@frame) ->

  previousFrame: (@frame) ->

  changeMode: (mode) ->
    @mode = mode if mode is "composition" \
                 or mode is "video" \
                 or mode is "image" \
                 or mode is "none"