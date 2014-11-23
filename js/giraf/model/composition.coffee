# ### Giraf.Model.Compositions
class Giraf.Model.Compositions extends Giraf.Model._base

  @append: (app, name) ->
    d = new $.Deferred
    uuid = do Giraf.Tools.uuid
    app.model.set uuid,
      new Giraf.Model.Composition app, uuid, (name ? "New Composition")
    d.resolve uuid
    do d.promise

# ## Giraf.Model.Composition
# ```
# data:
#   uuid: 一意のUUID
#   name: コンポジション名
#   tumnbnail: コンポジションサムネイルのblob
#   effect:
#     property:
#       out_framerate: 出力するフレームレート
#       out_speed: 出力するスピード
#       out_size: 出力する大きさ
#     script:
#       script: 効果スクリプトの文字列
#     crop:
#     keying:
#     color:
#     text:
# ```
class Giraf.Model.Composition extends Giraf.Model._base

  constructor: (@app, @uuid, @name) ->
    @data =
      uuid: ""
      name: ""
      tumnbnail: ""
      effect:
        property:
          out_framerate: 12
          out_speed: 1
          out_size: 320
          sample_check: true
          sample_radio: "soso"
        script:
          script: ""
        crop: null
        keying: null
        color: null
        text: null
    @data.uuid = uuid
    @data.name = name