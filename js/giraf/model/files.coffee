class Giraf.Model.Files extends Giraf.Model._base
  constructor: (@app) ->
    @files = {}

  append: (file, content)->
    uuid = do Giraf.Tools.uuid
    @files[uuid] = new Giraf.Model.Files.File @app, uuid, file, (content ? undefined)
    return uuid

  setContent: (uuid, content) ->
    @files[uuid]?.setContent content

  getContentByUUID: (uuid) ->
    return do @files[uuid]?.getContent


class Giraf.Model.Files.File extends Giraf.Model._base
  ###
    statusが変更されるときにstatusChangedが発火される
    null
    loading   ロード中（@contentがセットされていない）
    normal    ロード完了・通常状態（@contentがセットされている）
    dying     削除されるときに発火
  ###

  constructor: (@app, @uuid, @file, @content) ->
    @status = if @content? then "normal" else "loading"
    @project = @app.view.expert.project.append @

  setContent: (content) ->
    @content = content
    @status = "normal"
    $(@).triggerHandler "statusChanged", @status

  getContent: ->
    return @content