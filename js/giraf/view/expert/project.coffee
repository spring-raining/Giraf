class Giraf.View.Expert.Project extends Giraf.View.Expert._base

  constructor: (@app, @$project) ->
    @pieces = {}

  append: (referer) ->
    piece = null
    if referer instanceof Giraf.Model.Files.File
      piece = new Giraf.View.Expert.Project.Piece.File(referer)

    if piece?
      @pieces[piece.uuid] = piece
      @$project.append do piece.html

      return piece

###
  File    referer     Giraf.Model.Files.File
          type        "file"
          uuid        referer.uuid
          title       referer.file.name
###

class Giraf.View.Expert.Project.Piece
  constructor: (@referer, @type, @uuid, @title) ->
    $(referer).on "statusChanged", (event, status) ->
      $target = $ ".project-piece[data-referer-uuid=#{uuid}]"
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
                          <div class="project-piece" data-referer-type="<%- type %>" data-referer-uuid="<%- uuid %>"
                           data-action-click="expert__project__change_target" data-action-dblclick="expert__project__refresh_composition">
                            <div class="project-piece-tag"></div>
                            <div class="project-piece-content">
                              <img class="project-piece-thumbnail"/>
                              <div class="project-piece-title"><%- title %></div>
                            </div>
                          </div>
                          """
    return template
      type: @type ? ""
      uuid: @uuid ? ""
      title: @title ? ""

class Giraf.View.Expert.Project.Piece.File extends Giraf.View.Expert.Project.Piece
  constructor: (@referer) ->
    super referer, "file", referer.uuid, referer.file.name

  html: ->
    $rtn = $ super()
    if @referer.status is "loading"
      $rtn.addClass "loading"
    return $rtn.get(0)