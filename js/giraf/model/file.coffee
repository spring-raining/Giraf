class Giraf.Model.Files extends Giraf.Model._base
#
  @append: (app, file, content) ->
    d = new $.Deferred
    uuid = do Giraf.Tools.uuid
    app.model.set uuid,
      new Giraf.Model.File app, uuid, file, content
    d.resolve uuid
    do d.promise


class Giraf.Model.File extends Giraf.Model._base
  ###
    statusが変更されるときにstatusChangedが発火される
    null
    loading   ロード中（@contentがセットされていない）
    normal    ロード完了・通常状態（@contentがセットされている）
    dying     削除されるときに発火
  ###

  constructor: (@app, @uuid, @file, @content) ->
    @status = if @content? then "normal" else "loading"

  setContent: (content) ->
    @content = content
    @status = "normal"
    $(@).triggerHandler "statusChanged", @status

  getContent: ->
    return @content