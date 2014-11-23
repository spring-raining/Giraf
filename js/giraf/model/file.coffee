# ### Giraf.Model.Files
class Giraf.Model.Files extends Giraf.Model._base

  @append: (app, file, content) ->
    d = new $.Deferred
    uuid = do Giraf.Tools.uuid
    app.model.set uuid,
      new Giraf.Model.File app, uuid, file, content
    d.resolve uuid
    do d.promise


# ## Giraf.Model.File
# ```
# data:
#   uuid: 一意のUUID
#   name: ファイル名
#   size: ファイルサイズ
#   type: ファイルのタイプ
#   tumnbnail: ファイルサムネイルのblob
#   effect:
#     property:
#       in_time: 切り取り開始地点の時間
#       in_tumnbnail: 切り取り開始始点のサムネイルのblob
#       out_time: 切り取り終了地点の時間
#       out_thumbnail: 切り取り終了地点のサムネイルのblob
#       select_framerate: 切り取り選択を行う時のフレームレート
# ```
#
#  `status`が変更されるときに`statusChanged`が発火される
#  - `null`
#  - `loading`  ロード中（@contentがセットされていない）
#  - `normal`   ロード完了・通常状態（@contentがセットされている）
#  - `dying`    削除されるときに発火
class Giraf.Model.File extends Giraf.Model._base

  constructor: (@app, @uuid, @file, @content) ->
    @data =
      uuid: ""
      name: ""
      size: 0
      type: ""
      tumnbnail: ""
      file: null
      effect:
        property:
          in_time: -1
          in_tumnbnail: ""
          out_time: -1
          out_thumbnail: ""
          select_framerate: 12

    @status = if @content? then "normal" else "loading"
    @data.uuid = uuid
    @data.file = file
    @data.name = file.name
    @data.size = file.size
    @data.type = file.type

  setContent: (content) ->
    @content = content
    @status = "normal"
    $(@).triggerHandler "statusChanged", @status

  getContent: ->
    return @content