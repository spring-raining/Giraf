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
      v.select (k == uuid)
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

