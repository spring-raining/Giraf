class Giraf.View.Expert.Node extends Giraf.View.Expert._base

  constructor: (@app, @$node) ->
    @pieces = {}

    $node.on "drop", (event) =>
      referer_uuid = event.originalEvent.dataTransfer.getData "referer_uuid"
      return unless referer_uuid
      referer = app.model.get referer_uuid
      piece = null
      uuid = do Giraf.Tools.uuid
      if referer instanceof Giraf.Model.Composition
        piece = new Giraf.View.Expert.Node.Piece.Composition app, uuid, referer
      if piece?
        @pieces[uuid] = piece
        $node.append piece.html()

class Giraf.View.Expert.Node.Piece extends Giraf.View.Expert._base
  constructor: (@app, @uuid) ->

  html: ->
    return "<div>Override me!</div>"

class Giraf.View.Expert.Node.Piece.Composition extends Giraf.View.Expert.Node.Piece
  constructor: (@app, @uuid, referer) ->
    super app, uuid
    @referer_uuid = referer.uuid