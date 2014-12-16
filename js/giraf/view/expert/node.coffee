# ### Giraf.View.Expert.Node
# ```
# app: appオブジェクト
# $node: 自身の表示場所のjQueryオブジェクト
# corkboardWidth: SVG領域の幅
# corkboardHeight: SVG領域の高さ
# svg: Node.SVGオブジェクト
# ```
class Giraf.View.Expert.Node extends Giraf.View.Expert._base

  constructor: (@app, @$node) ->
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


# ### Giraf.View.Expert.Node.SVG
# ```
# app: appオブジェクト
# width: SVG領域の幅
# height: SVG領域の高さ
# D3:
#   svg:
#     defs: SVG定義部分のD3オブジェクト
#     nodeLayer: SVGノード表示グループのD3オブジェクト
#     contentLayer: SVGコンテント表示グループのD3オブジェクト
#     overLayer: SVGオーバーレイ表示グループのD3オブジェクト
# piece: Node.Pieceオブジェクトのハッシュ（キーはUUID）
# hoveredContent: マウスの下にあるコンテントのUUID
# ```
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

  getShadowFilterId: ->
    idName = "shadow"
    return idName if @d3shadow?

    @d3shadow = @D3.svg.defs.append "filter"
    .attr
      id: idName
      width: "200%"
      height: "200%"
    @d3shadow.append "feOffset"
    .attr
      "in": "SourceAlpha"
      dx: 0
      dy: 5
      result: "offset"
    @d3shadow.append "feGaussianBlur"
    .attr
      "in": "offset"
      result: "blur"
      stdDeviation: 4
    @d3shadow.append "feBlend"
    .attr
      "in": "SourceGraphic"
      in2: "blur"
      mode: "normal"
    return idName


# ### Giraf.View.Expert.Node.Piece
class Giraf.View.Expert.Node.Piece extends Giraf.View.Expert._base
  @x = 0
  @y = 0

  @color =
    body: "#ebebeb"
    line: "#ebebeb"
    composition_bg: "#577354"
    point_bg: "#ab6e49"


# ### Giraf.View.Expert.Node.Piece.Content
class Giraf.View.Expert.Node.Piece.Content extends Giraf.View.Expert.Node.Piece
  constructor: (@svg) ->
    @controllable = true

  controll: (bool) ->
    @controllable = bool
    return @

  select: (bool) ->

  target: (bool) ->


# ### Giraf.View.Expert.Node.Piece.Over
class Giraf.View.Expert.Node.Piece.Over extends Giraf.View.Expert.Node.Piece
  constructor: (@svg) ->


# ### Giraf.View.Expert.Node.Piece.Composition
# ```
# x: x位置
# y: y位置
# destination: 映像出力先のPieceオブジェクトのUUID
# svg: Node.SVGオブジェクト
# uuid: 一意のUUID
# app: appオブジェクト
# referer_uuid: 参照しているModel.CompositionオブジェクトのUUID
# d3svg: SVGのD3オブジェクト
# ```
class Giraf.View.Expert.Node.Piece.Composition extends Giraf.View.Expert.Node.Piece.Content
  @destination = null

  style =
    width: 120
    height: 25 + 70 + 4
    rect:
      radius: 4
      color: @color.composition_bg
    text:
      x: 60
      y: 13
      fontSize: 11
      fontWeight: 20
      color: @color.body
    image:
      x: 0
      y: 25
      width: 120
      height: 70
    hook:
      x: 120
      y: 13
      r: 5
      color: @color.line
    target:
      width: 2
      color: @color.line

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

  # draw後は以下の要素が追加される
  # ```
  # d3shadow: D3オブジェクト (nodeLayer)
  # d3composition: D3オブジェクト (contentLayer)
  # d3rect: D3オブジェクト (d3composition)
  # d3text: D3オブジェクト (d3composition)
  # deimage: D3オブジェクト (d3composition)
  # d3circleHook: D3オブジェクト (d3composition)
  # ```
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
              .move  @x + (-style.width / 2) + style.hook.x, @y + (-style.height / 2) + style.hook.y,
                     @x + (-style.width / 2) + style.hook.x, @y + (-style.height / 2) + style.hook.y
          .on "drag", =>
            _.each @svg.pieces, (v, k) =>
              if @svg.hoveredContent is k and k isnt @uuid
                v.target true
              else
                v.target false
            @arrow.move @x + (-style.width / 2) + style.hook.x, @y + (-style.height / 2) + style.hook.y,
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
        .style "filter", "url(##{@svg.getShadowFilterId()})"
        .call d3compositionEventHandler
      @d3rect = @d3composition.append "rect"
        .attr
          x: (-style.width / 2)
          y: (-style.height / 2)
          width: style.width
          height: style.height
          rx: style.rect.radius
          ry: style.rect.radius
          fill: style.rect.color
      @d3text = @d3composition.append "text"
        .text (@app.model.get @referer_uuid)?.name
        .attr
          x: (-style.width / 2)  + style.text.x
          y: (-style.height / 2) + style.text.y
          "font-size": style.text.fontSize
          "font-weight": style.text.fontWeight
          "text-anchor": "middle"
          "dominant-baseline": "middle"
          "fill": style.text.color
      @d3image = @d3composition.append "image"
        .attr
          x: (-style.width / 2)  + style.image.x
          y: (-style.height / 2) + style.image.y
          width: style.image.width
          height: style.image.height
          #"xlink:href": "url()"
      @d3circleHook = @d3composition.append "circle"
        .attr
          cx: (-style.width / 2)  + style.hook.x
          cy: (-style.height / 2) + style.hook.y
          r: style.hook.r
          fill: style.hook.color
        .call d3hookEventHandler

    return @

  target: (bool) ->
    super bool
    if bool
      @d3hover ?= @d3composition.append "rect"
        .attr
          x: (-style.width / 2)
          y: (-style.height / 2)
          width: style.width
          height: style.height
          rx: style.rect.radius
          ry: style.rect.radius
          fill: "transparent"
          stroke: style.target.color
          "stroke-width": style.target.width
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


# ### Giraf.View.Expert.Node.Piece.Point
# ```
# x: x位置
# y: y位置
# source: 映像入力元のPieceオブジェクトのUUID
# svg: Node.SVGオブジェクト
# uuid: 一意のUUID
# d3svg: SVGのD3オブジェクト
# ```
class Giraf.View.Expert.Node.Piece.Point extends Giraf.View.Expert.Node.Piece.Content
  @source = null

  style =
    width: 32
    height: 32
    rect:
      radius: 4
      color: @color.point_bg
    hook:
      x: 32 / 2
      y: 32 / 2
      r: 5
      color: @color.line
    target:
      width: 2
      color: @color.line

  constructor: (@svg, @uuid) ->
    super svg
    @d3svg = svg.D3.svg

  move: (x, y) ->
    @x = Math.min (Math.max x, 0), @svg.width
    @y = Math.min (Math.max y, 0), @svg.height
    @d3point?.attr "transform", "translate(#{@x}, #{@y})"
    return @

  # draw後は以下の要素が追加される
  # ```
  # d3point: D3オブジェクト (contentLayer)
  # d3rect: D3オブジェクト (d3point)
  # d3circleDot: D3オブジェクト (d3point)
  # d3circleHook: D3オブジェクト (d3point)
  # ```
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
              .move  @x + (-style.width / 2) + style.hook.x, @y + (-style.height / 2) + style.hook.y,
                     @x + (-style.width / 2) + style.hook.y, @y + (-style.height / 2) + style.hook.y
          .on "drag", =>
            _.each @svg.pieces, (v, k) =>
              if @svg.hoveredContent is k and k isnt @uuid
                v.target true
              else
                v.target false
            @arrow.move @x + (-style.width / 2) + style.hook.x, @y + (-style.height / 2) + style.hook.y,
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
        .style "filter", "url(##{@svg.getShadowFilterId()})"
        .call d3pointEventHandler
      @d3rect = @d3point.append "rect"
        .attr
          x: (-style.width / 2)
          y: (-style.height / 2)
          width: style.width
          height: style.height
          rx: style.rect.radius
          ry: style.rect.radius
          fill: style.rect.color
      @d3circleHook = @d3point.append "circle"
        .attr
          cx: (-style.width / 2) + style.hook.x
          cy: (-style.height / 2) + style.hook.y
          r: style.hook.r
          fill: style.hook.color
        .call d3hookEventHandler

    return @

  target: (bool) ->
    super bool
    if bool
      @d3hover ?= @d3point?.append "rect"
        .attr
          x: (-style.width / 2)
          y: (-style.height / 2)
          width: style.width
          height: style.height
          rx: style.rect.radius
          ry: style.rect.radius
          fill: "transparent"
          stroke: style.target.color
          "stroke-width": style.target.width
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


# ### Giraf.View.Expert.Node.Piece.Arrow
# ```
# x1: 始点のx位置
# x2: 終点のx位置
# y1: 始点のy位置
# y2: 終点のy位置
# svg: Node.SVGオブジェクト
# uuid: 一意のUUID
# d3svg: SVGのD3オブジェクト
# ```
class Giraf.View.Expert.Node.Piece.Arrow extends Giraf.View.Expert.Node.Piece.Over
  @x1 = 0
  @y1 = 0
  @x2 = 0
  @y2 = 0

  style =
    tail:
      r: 5
      color: @color.line
    head:
      refX: 0
      refY: 3
      markerWidth: 6
      markerHeight: 6
      d: "M0,0 V6 L6,3 Z"
      color: @color.line
    stroke:
      width: 2
      dasharray: "7, 5"
      color: @color.line

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

  # draw後は以下の要素が追加される
  # ```
  # d3arrowTail: D3オブジェクト (defs)
  # d3arrowHead: D3オブジェクト (defs)
  # d3arrow: D3オブジェクト (overLayer)
  # ```
  draw: ->
    $ =>
      @d3arrowTail = @d3svg.defs.append "marker"
        .attr
          id: "#{@uuid}_arrow_tail"
          refX: style.tail.r / 2
          refY: style.tail.r / 2
          markerWidth: style.tail.r
          markerHeight: style.tail.r
          orient: "auto"
      @d3arrowTail.append "circle"
        .attr
          cx: style.tail.r / 2
          cy: style.tail.r / 2
          r: style.tail.r / 2
          fill: style.tail.color
      @d3arrowHead = @d3svg.defs.append "marker"
        .attr
          id: "#{@uuid}_arrow_head"
          refX: style.head.refX
          refY: style.head.refY
          markerWidth: style.head.markerWidth
          markerHeight: style.head.markerHeight
          orient: "auto"
      @d3arrowHead.append "path"
        .attr
          d: style.head.d
          fill: style.head.color
      @d3arrow = @d3svg.overLayer.append "line"
        .attr
          x1: @x1
          y1: @y1
          x2: @x2
          y2: @y2
          stroke: style.stroke.color
          "stroke-width": style.stroke.width
          "stroke-dasharray": style.stroke.dasharray
          "marker-start": "url(##{@uuid}_arrow_tail)"
          "marker-end": "url(##{@uuid}_arrow_head)"

    return @

  remove: ->
    do @d3arrowTail?.remove
    do @d3arrowHead?.remove
    do @d3arrow?.remove
    return @

