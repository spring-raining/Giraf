# ### Giraf.View.Expert.Project
# ```
# app: appオブジェクト
# $project: 自身の表示場所のjQueryオブジェクト
# pieces: Project.Pieceオブジェクトのハッシュ(キーはUUID)
# ```
class Giraf.View.Expert.Project extends Giraf.View.Expert._base

  constructor: (@app, @$project) ->
    @pieces = {}

    template = _.template """
                          <div class="project-header">
                          </div>
                          """
    $project.append template()

  append: (referer) ->
    piece = null
    uuid = do Giraf.Tools.uuid
    if referer instanceof Giraf.Model.File
      piece = new Giraf.View.Expert.Project.Piece.File @app, uuid, referer
    if referer instanceof Giraf.Model.Composition
      piece = new Giraf.View.Expert.Project.Piece.Composition @app, uuid, referer
    if piece?
      @pieces[uuid] = piece
      @$project.append do piece.html

      return uuid

  select: (uuid) ->
    d = do $.Deferred
    _.each @pieces, (v, k) =>
      v.select (k is uuid)
    do d.resolve

    do d.promise


# ### Giraf.View.Expert.Project.Piece
# ```
# app: appオブジェクト
# uuid: 一意のUUID
# type: 参照しているオブジェクトのタイプ("file", "composition")
# title: 参照しているオブジェクトの名前
# referer_uuid: 参照しているオブジェクトのUUID
# ```
class Giraf.View.Expert.Project.Piece
  constructor: (@app, @uuid, referer, @type, @title) ->
    @referer_uuid = referer.uuid
    $(referer).on "statusChanged", (event, status) =>
      $target = $ ".project-piece[data-uuid=#{uuid}]"
      switch status
        when "loading"
          $target.addClass "loading"
        when "normal"
          $target.removeClass "loading"
        when "dying"
          do $target.remove
        else

  html: ->
    template = _.template """
                          <div class="project-piece" draggable="true" data-referer-type="<%- type %>" data-uuid="<%- uuid %>"
                           data-action-click="expert__change_target" data-action-dblclick="expert__project__refresh_composition">
                            <div class="project-piece-content">
                              <div class="project-piece-title"><%- title %></div>
                            </div>
                            <div class="project-piece-thumbnail-container">
                              <img class="project-piece-thumbnail"/>
                            </div>
                          </div>
                          """
    $rtn = $ template
      type: @type ? ""
      uuid: @uuid ? ""
      title: @title ? ""
    $rtn.on "dragstart", (event) =>
      event.originalEvent.dataTransfer.setData "referer_uuid", @referer_uuid
    return $rtn.get(0)

  select: (bool) ->
    $target = $ ".project-piece[data-uuid=#{@uuid}]"
    if bool
      $target.addClass "selected"
      @app.view.expert.effect.changeTarget @referer_uuid
    else
      $target.removeClass "selected"


# ### Giraf.View.Expert.Project.Piece.File
class Giraf.View.Expert.Project.Piece.File extends Giraf.View.Expert.Project.Piece
  constructor: (@app, @uuid, referer) ->
    super app, uuid, referer, "file", referer.file.name

  html: ->
    $rtn = $ super()
    if @app.model.get(@referer_uuid).status is "loading"
      $rtn.addClass "loading"
    return $rtn.get(0)

# ### Giraf.View.Expert.Project.Piece.Composition
class Giraf.View.Expert.Project.Piece.Composition extends Giraf.View.Expert.Project.Piece
  constructor: (@app, @uuid, referer) ->
    super app, uuid, referer, "composition", referer.name