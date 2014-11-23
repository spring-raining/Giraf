Giraf = {} unless Giraf?
Giraf._base = {} unless Giraf._base?
Giraf.App = {} unless Giraf.App?
Giraf.Controller = {} unless Giraf.Controller?
Giraf.Controller._base = {} unless Giraf.Controller._base?
Giraf.Controller.Action = {} unless Giraf.Controller.Action?
Giraf.History = {} unless Giraf.History?
Giraf.Model = {} unless Giraf.Model?
Giraf.Model._base = {} unless Giraf.Model._base?
Giraf.Model.Composition = {} unless Giraf.Model.Composition?
Giraf.Model.File = {} unless Giraf.Model.File?
Giraf.Settings = {} unless Giraf.Settings?
Giraf.Settings._base = {} unless Giraf.Settings._base?
Giraf.Settings.CookieBinder = {} unless Giraf.Settings.CookieBinder?
Giraf.Task = {} unless Giraf.Task?
Giraf.Task._base = {} unless Giraf.Task._base?
Giraf.Task.ChangeSelected = {} unless Giraf.Task.ChangeSelected?
Giraf.Task.CreateNewComposition = {} unless Giraf.Task.CreateNewComposition?
Giraf.Task.FileLoader = {} unless Giraf.Task.FileLoader?
Giraf.Task.RefreshComposition = {} unless Giraf.Task.RefreshComposition?
Giraf.Task.SelectFile = {} unless Giraf.Task.SelectFile?
Giraf.Tools = {} unless Giraf.Tools?
Giraf.View = {} unless Giraf.View?
Giraf.View._base = {} unless Giraf.View._base?
Giraf.View.Expert = {} unless Giraf.View.Expert?
Giraf.View.Expert._base = {} unless Giraf.View.Expert._base?
Giraf.View.Expert.Composition = {} unless Giraf.View.Expert.Composition?
Giraf.View.Expert.Composition.Controller = {} unless Giraf.View.Expert.Composition.Controller?
Giraf.View.Expert.Droparea = {} unless Giraf.View.Expert.Droparea?
Giraf.View.Expert.Effect = {} unless Giraf.View.Expert.Effect?
Giraf.View.Expert.Node = {} unless Giraf.View.Expert.Node?
Giraf.View.Expert.Project = {} unless Giraf.View.Expert.Project?
Giraf.View.Modal = {} unless Giraf.View.Modal?
Giraf.View.Nav = {} unless Giraf.View.Nav?
Giraf.View.Quick = {} unless Giraf.View.Quick?
Giraf.View.Quick._base = {} unless Giraf.View.Quick._base?


# Giraf._base
class Giraf._base


# ### Giraf.App
# ```
# model: Modelオブジェクト
# view: Viewオブジェクト
# settings: Settingsオブジェクト
# ```
class Giraf.App extends Giraf._base

  run: =>
    $ =>
      @model = new Giraf.Model
      #@model.files = new Giraf.Model.Files @
      @view = new Giraf.View @
      @settings = new Giraf.Settings @


# ### Giraf.Controller._base
class Giraf.Controller._base extends Giraf._base


# ### Giraf.Controller.Action
class Giraf.Controller.Action extends Giraf.Controller._base
  constructor: (app, action, args) ->
    switch action
      when "drop__import_file"
          fileList = args.fileList
          task = new Giraf.Task.FileLoader
          task.run app, fileList
          .fail ->
            console.log "failed"
      when "expert__project__refresh_composition"
          piece = app.view.expert.project.pieces[$(args.element).attr "data-uuid"]
          task = new Giraf.Task.RefreshComposition
          task.run app, piece.referer_uuid
          .fail ->
            console.log "failed"
      when "nav__append_point"
          app.view.nav.inactive()
          .then ->
            app.view.expert.node.appendPoint()
          .fail ->
            console.log "failed"
      when "expert__change_target"
          task = new Giraf.Task.ChangeSelected
          task.run app, ($(args.element).attr "data-uuid")
          .fail ->
            console.log "failed"
      when "nav__import_file"
          app.view.nav.inactive()
          .then ->
            task = new Giraf.Task.SelectFile
            task.run app
          .then (fileList) ->
            task = new Giraf.Task.FileLoader
            task.run app, fileList
          .fail ->
            console.log "failed"
      when "nav__new_composition"
          app.view.nav.inactive()
          .then ->
            task = new Giraf.Task.CreateNewComposition
            task.run app
          .fail ->
            console.log "failed"
      when "nav__hoge"
          app.view.nav.inactive()
          .then ->
            modal = new Giraf.View.Modal
            modal.show
              title: "たいとる"
              content: """
                       <b>ああああ</b>いいいい
                       """
              action:
                yes:
                  text: "はい"
                  primary: true
                no:
                  text: "いいえ"

      else
          console.log "Action '#{action}' is not defined."

# ### Giraf.History
class Giraf.History extends Giraf._base


# ### Giraf.Model
class Giraf.Model extends Giraf._base
  constructor: ->
    @models = {}

  set: (uuid, model) ->
    @models[uuid] = model

  get: (uuid) ->
    return @models[uuid]

# ### Giraf.Model._base
class Giraf.Model._base extends Giraf._base

  @data = {}

  update: (key, value) ->
    data = @data
    key_array = key.split(".")
    last_key = key_array.pop()
    _.each key_array, (t) =>
      data = data?[t]
    if data[last_key]?
      if typeof data[last_key] is "number"
        data[last_key] = Number(value)
      else
        data[last_key] = value

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

# ### Giraf.Settings
class Giraf.Settings extends Giraf._base

  constructor: (@app) ->
    @cookieBinder = new Giraf.Settings.CookieBinder()

# ### Giraf.Settings._base
class Giraf.Settings._base extends Giraf._base


# ### Giraf.Settings.CookieBinder
class Giraf.Settings.CookieBinder extends Giraf.Settings._base

  constructor: (@app) ->
    $.cookie.json = true

  set: (data) ->
    $.cookie 'giraf',
      version: 100
      data: data

  get: ->
    return $.cookie 'giraf'

  clear: ->
    $.removeCookie 'giraf'

# ### Giraf.Task._base
class Giraf.Task._base extends Giraf._base


# ## Giraf.Task.ChangeSelected
class Giraf.Task.ChangeSelected

  # view上の項目を選択する
  run: (app, uuid) ->
    d = do $.Deferred

    $.when (app.view.expert.project.select uuid),
           (app.view.expert.node.select uuid)
    .done =>
      do d.resolve

    do d.promise

# ### Giraf.Task.CreateNewComposition
class Giraf.Task.CreateNewComposition

  # 新しいコンポジションを作成する
  run: (app) ->
    d = do $.Deferred
    uuid = null
    Giraf.Model.Compositions.append app
    .then (uuid_) ->
      uuid = uuid_
      app.view.expert.project.append app.model.get uuid
      do d.resolve
    , ->
      do d.reject

    do d.promise

# ### Giraf.Task.FileLoader
class Giraf.Task.FileLoader extends Giraf.Task._base

  # 新しいファイルを読み込む
  run: (app, files) ->
    d = do $.Deferred
    tasks = []

    for file in files
      continue unless file.type in [
        "video/mp4",
        "image/gif",
        "image/png",
        "image/jpeg",
      ]
      tasks.push do ->
        d_ = do $.Deferred
        uuid = null
        Giraf.Model.Files.append app, file
        .then (uuid_) ->
          d__= do $.Deferred
          uuid = uuid_
          app.view.expert.project.append app.model.get uuid
          readFile.call @, file
          .then (file, content) ->
            d__.resolve file, content
          do d__.promise
        .then (file, content) ->
          app.model.get(uuid).setContent content
        .then ->
          do d_.resolve
        , ->
          do d_.reject
        do d_.promise

    $.when.apply $, tasks
      .then ->
        do d.resolve
      , ->
        do d.reject

    do d.promise

  readFile = (file) ->
    d = do $.Deferred
    reader = new FileReader
    reader.onload = ->
      d.resolve file, reader.result
    reader.onerror = (error) ->
      d.reject error
    reader.readAsDataURL file

    do d.promise

# ### Giraf.Task.RefreshComposition
class Giraf.Task.RefreshComposition

  # 指定したファイルorコンポジションをView.Expert.Compositionに表示する
  run: (app, uuid) ->
    d = do $.Deferred
    model = app.model.get uuid
    if model instanceof Giraf.Model.File
      type = null
      switch model.file.type
        when "video/mp4"
          type = "video"
        when "image/gif", "image/png", "image/jpeg"
          type = "img"
        else

      do d.reject unless type?
      app.view.expert.composition.refresh type, model.content
      .then ->
        do d.resolve
      , ->
        do d.reject

    if model instanceof Giraf.Model.Composition
      app.view.expert.composition.refresh "img", null
      .then ->
        do d.resolve
      , ->
        do d.reject

    do d.promise

# ### Giraf.Task.SelectFile
class Giraf.Task.SelectFile extends Giraf.Task._base

  # ファイル選択ウィンドウを開く
  run: (app) ->
    d = new $.Deferred
    inputId = "SelectFile"
    $input = $("##{inputId}")
    unless $input.get(0)?
      $("body").append """
                       <input type="file" name="file" id="#{inputId}" class="hidden" value="" multiple="multiple"/>
                       """
      $input = $("##{inputId}")

    $input.on "change", ->
      fileList = $input.get(0).files
      d.resolve fileList

    $input.trigger "click"
    do d.promise

# ### Giraf.Tools
class Giraf.Tools extends Giraf._base

  # UUIDを生成する(staticメソッド)
  @uuid: ->
    # http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    s4 = ->
      return `(((1+Math.random())*0x10000)|0).toString(16).substring(1)`
    return `s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+ s4()+s4()+s4()`

# ### Giraf.View
# ```
# nav: View.Navオブジェクト
# expert.View.Expertオブジェクト
# ```
class Giraf.View extends Giraf._base
  _selector_nav = "nav"
  _selector_quick = "#quick"
  _selector_expert = "#expert"

  constructor: (@app) ->
    @nav = new Giraf.View.Nav app, $(_selector_nav)
    @expert = new Giraf.View.Expert app, $(_selector_expert)

    # HTML属性に次の属性があった場合、イベントに応じてActionが実行される
    # - `data-action`,`data-action-click`: クリックされた際に実行
    # - `data-action-weak`, `data-action-click-weak`: クリックされた際に実行(子要素は対象外)
    # - `data-action-dblclick`: ダブルクリックされた際に実行
    # - `data-action-dblclick-weak`: ダブルクリックされた際に実行(子要素は対象外)
    $(document).on "click", (event) =>
      $t = $ event.target
      if $t.attr("data-action")?
        _.each $t.attr("data-action").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target
      if $t.attr("data-action-weak")?
        _.each $t.attr("data-action-weak").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target
      if $t.attr("data-action-click")?
        _.each $t.attr("data-action-click").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target
      if $t.attr("data-action-click-weak")?
        _.each $t.attr("data-action-click-weak").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target

      $t.parents("[data-action]").each ->
        _.each $(@).attr("data-action").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: @
      $t.parents("[data-action-click]").each ->
        _.each $(@).attr("data-action-click").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: @

    .on "dblclick", (event) =>
      $t = $ event.target
      if $t.attr("data-action-dblclick")?
        _.each $t.attr("data-action-dblclick").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target
      if $t.attr("data-action-dblclick-weak")?
        _.each $t.attr("data-aciton-dblclick-weak").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target

      $t.parents("[data-action-dblclick]").each ->
        _.each $(@).attr("data-action-dblclick").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: @

# ### Giraf.View._base
class Giraf.View._base extends Giraf._base


# ### Giraf.View.Expert
# ```
# app: appオブジェクト
# $expert: 自身の表示場所のjQueryオブジェクト
# ```
class Giraf.View.Expert extends Giraf.View._base
  _selector_container = "#expert_container"
  _selector_project = "#expert_project > .panel-container"
  _selector_composition = "#expert_composition > .panel-container"
  _selector_effect = "#expert_effect > .panel-container"
  _selector_node = "#expert_node > .panel-container"

  constructor: (@app, @$expert) ->
    @project = new Giraf.View.Expert.Project app, $expert.find _selector_project
    @composition = new Giraf.View.Expert.Composition app, $expert.find _selector_composition
    @effect = new Giraf.View.Expert.Effect app, $expert.find _selector_effect
    @node = new Giraf.View.Expert.Node app, $expert.find _selector_node
    @droparea = new Giraf.View.Expert.Droparea app, $expert



# ### Giraf.View.Expert._base
class Giraf.View.Expert._base extends Giraf.View._base


# ### Giraf.View.Expert.Composition
# ```
# app: appオブジェクト
# $composition: 自身の表示場所のjQueryオブジェクト
# controller: Controllerオブジェクト
# ```

class Giraf.View.Expert.Composition extends Giraf.View.Expert._base

  constructor: (@app, @$composition) ->
    template = _.template """
                          <div class="composition-window">
                            <div class="composition-window-placeholder">
                              <span>Composition</span>
                              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores corporis delectus, doloremque eligendi explicabo fugit harum iusto magnam minus natus non odit officia perspiciatis possimus provident quo similique, suscipit tempora!</p><p>Aut ea eveniet facere officia placeat qui quod soluta! A autem commodi culpa cum, dignissimos dolorum eveniet, explicabo minima nesciunt nisi, officia omnis optio quae quas quia reiciendis rem unde?</p><p>Assumenda consectetur corporis et magnam voluptate. Ab aut beatae corporis cum dolorem dolores eius est expedita fuga hic, ipsum nobis quasi quibusdam quo recusandae soluta temporibus ut veniam vitae voluptatem?</p><p>Cupiditate dignissimos dolore dolorum ducimus enim, et explicabo fugit illo ipsa ipsam itaque laborum maiores nemo obcaecati quas quia quis similique! Autem consectetur dignissimos laudantium magni odit tenetur veniam vero.</p><p>Ab amet debitis dolorem est eveniet explicabo illum incidunt libero, magni minima, natus numquam omnis placeat porro quisquam saepe tempora voluptate! Aliquam eius error facere, maiores numquam vel veniam voluptatum.</p><p>Aliquid, assumenda consectetur cum cumque deserunt distinctio expedita fugit harum impedit magnam nemo nihil nobis perspiciatis ratione repellat sed, suscipit. At atque eos in molestias, nesciunt quas reiciendis. Consequuntur, ipsum.</p>
                            </div>
                            <img class="composition-img hidden"/>
                            <video class="composition-video hidden"></video>
                          </div>
                          <div class="composition-controller"></div>
                          <div class="composition-progress">
                            <progress value="0" max="100"></progress>
                          </div>
                          """
    @$composition.append template {}
    @controller = new Giraf.View.Expert.Composition.Controller
      app: app
      $controller: $ ".composition-controller"
      $img: $ "img.composition-img"
      $video: $ "video.composition-video"

  refresh: (type, content_url) ->
    d = do $.Deferred
    switch type
      when "video"
        $video = $ "video.composition-video"
        do d.reject unless $video.get(0)?
        $(".composition-window").children().each ->
          $(@).addClass "hidden"
        @controller.changeMode "none"
        $video.removeClass "hidden"
          .attr "src", content_url
          .one "canplay", ->
            do d.resolve
        @controller.changeMode "video"
      when "img"
        $img = $ "img.composition-img"
        do d.reject unless $img.get(0)?
        $(".composition-window").children().each ->
          $(@).addClass "hidden"
        @controller.changeMode "none"
        $img.removeClass "hidden"
          .attr "src", content_url
        do d.resolve
      else
        console.log "Type '#{type}' is not defined."
        @controller.changeMode "none"
        do d.resolve

    do d.promise

# ### Giraf.View.Expert.Composition.Controller
# ```
# app: appオブジェクト
# $controller: 自身の表示場所のjQueryオブジェクト
# $img: ?
# $video: ?
# type: 現在プレビュー中のタイプを表す
#   [composition, video, image, none]
# frame: ?
# ```
class Giraf.View.Expert.Composition.Controller extends Giraf.View._base
  constructor: (args) ->
    @app = args.app
    @$controller = args.$controller
    @$img = args.$img
    @$video = args.$video

    @type = "none"
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

    @$play.on "click", =>
      do @play


  play: (bool) ->
    if @type is "video"
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

  changeType: (type) ->
    @type = type if type is "composition" \
                 or type is "video" \
                 or type is "image" \
                 or type is "none"

# ### Giraf.View.Expert.Droparea
# ```
# app: appオブジェクト
# $droparea: 自身の表示場所のjQueryオブジェクト
# ```
class Giraf.View.Expert.Droparea extends Giraf.View.Expert._base
  isActive = false
  innerAcitve = 0

  constructor: (@app, @$droparea) ->
    $droparea
      .on "dragstart", =>
        true
      .on "dragover", =>
        false
      .on "dragenter", (event) =>
        if isActive
          innerAcitve++
        else
          for item in event.originalEvent.dataTransfer.items
            if item.type in [
              "video/mp4",
              "image/gif",
              "image/png",
              "image/jpeg",
            ]
              do @show
              break
        false
      .on "dragleave", =>
        if innerAcitve > 0
          innerAcitve--
        else
          do @hide
      .on "drop", (event) =>
        innerAcitve = false
        do @hide
        files = event
          .originalEvent
          .dataTransfer
          .files
        if files.length > 0
          Giraf.Controller.Action app, "drop__import_file",
            fileList: files
        false

  show: ->
    isActive = true
    template = _.template """
                          <div class="droparea">
                            <div class="droparea-label">
                              <h3>ドロップでファイル読み込み</h3>
                            </div>
                          </div>
                          """
    @$droparea.append template()

  hide: ->
    isActive = false
    do $(".droparea").remove

# ### Giraf.View.Expert.Effect
# ```
# app: appオブジェクト
# $effect: 自身の表示場所のjQueryオブジェクト
# ```
class Giraf.View.Expert.Effect extends Giraf.View.Expert._base
  constructor: (@app, @$effect) ->
    template = _.template """
                          <div class="effect-content hidden" data-effect-content="property"><%= property %></div>
                          <div class="effect-content hidden" data-effect-content="script"><%= script %></div>
                          <div class="effect-content hidden" data-effect-content="crop"><%= crop %></div>
                          <div class="effect-content hidden" data-effect-content="keying"><%= keying %></div>
                          <div class="effect-content hidden" data-effect-content="color"><%= color %></div>
                          <div class="effect-content hidden" data-effect-content="text"><%= text %></div>
                          <div class="effect-tab layer"></div>
                          <ul class="effect-tab">
                            <li class="effect-tab-menu girafont" data-change-effect-tab="property">parameter</li>
                            <li class="effect-tab-menu girafont" data-change-effect-tab="script">magic</li>
                            <li class="effect-tab-menu girafont" data-change-effect-tab="crop">crop</li>
                            <li class="effect-tab-menu girafont" data-change-effect-tab="keying">keying</li>
                            <li class="effect-tab-menu girafont" data-change-effect-tab="color">palette</li>
                            <li class="effect-tab-menu girafont" data-change-effect-tab="text">text</li>
                          </ul>
                          """
    @$effect.append template
      property: """
                <form id="form_effect_property" name="effect_property">
                  <fieldset class="effect-parameter-group">
                    <label for="select__out_framerate" class="half">出力するフレームレート</label>
                    <select name="out_framerate"
                            id="select__out_framerate"
                            class="half"
                            data-load="effect.property.out_framerate">
                      <option value="1">1fps</option>
                      <option value="2">2fps</option>
                      <option value="3">3fps</option>
                      <option value="4">4fps</option>
                      <option value="6">6fps</option>
                      <option value="8">8fps</option>
                      <option value="12">12fps</option>
                      <option value="15">15fps</option>
                      <option value="24">24fps</option>
                      <option value="30">30fps</option>
                    </select>
                    <label for="number__out_speed">出力するスピード</label>
                    <div class="slider-group">
                      <input type="range"
                             min="0.1" max="4.0" step="0.1"
                             data-load="effect.property.out_speed"/>
                      <input type="number"
                             min="0.1" max="4.0" step="0.1"
                             id="number__out_speed"
                             data-load="effect.property.out_speed"/>
                    </div>
                    <label for="number__out_size">出力する大きさ</label>
                    <div class="slider-group">
                      <input type="range"
                             min="40" max="720" step="10"
                             data-load="effect.property.out_size"/>
                      <input type="number"
                             min="40" max="720" step="10"
                             id="number__out_size"
                             data-load="effect.property.out_size"/>
                    </div>
                  </fieldset>
                """ +
                """
                  <fieldset class="effect-parameter-group">
                    <legend>切り取り位置を選択</legend>
                    <label for="" class="half">始点</label>
                    <label for="" class="half">終点</label>
                    <img src="" class="half"/>
                    <img src="" class="half"/>
                    <input type="hidden"
                           data-load="effect.property.in_time"/>
                    <input type="hidden"
                           data-load="effect.property.out_time"/>
                    <label for="select_select_framerate" class="half">切り取りフレームレート</label>
                    <select name="select_framerate"
                            id="select_select_framerate"
                            class="half"
                            data-load="effect.property.select_framerate">
                      <option value="1">1fps</option>
                      <option value="2">2fps</option>
                      <option value="3">3fps</option>
                      <option value="4">4fps</option>
                      <option value="6">6fps</option>
                      <option value="8">8fps</option>
                      <option value="12">12fps</option>
                      <option value="15">15fps</option>
                      <option value="24">24fps</option>
                      <option value="30">30fps</option>
                    </select>
                    <div class="half"></div>
                    <button class="half">動画からコンポジションを作成</button>
                  </fieldset>
                """ +
                """
                  <fieldset class="effect-parameter-group">
                    <legend>ほげほげ</legend>
                    <label class="half" for="checkbox__sample_check">チェック</label>
                    <input type="checkbox"
                           name="sample_check"
                           id="checkbox__sample_check"
                           value="sample_check"
                           class="half"
                           data-load="effect.property.sample_check"/>
                    <label class="half">ラジオ</label>
                    <div class="half">
                      <input type="radio"
                             name="sample_radio"
                             value="yes"
                             id="radio__sample_radio__yes"
                             class="half"
                             data-load="effect.property.sample_radio"/>
                      <label for="radio__sample_radio__yes">Yes</label>
                    </div>
                    <div class="half"></div>
                    <div class="half">
                      <input type="radio"
                             name="sample_radio"
                             value="no"
                             id="radio__sample_radio__no"
                             class="half"
                             data-load="effect.property.sample_radio"/>
                      <label for="radio__sample_radio__no">No</label>
                    </div>
                    <div class="half"></div>
                    <div class="half">
                      <input type="radio"
                             name="sample_radio"
                             value="soso"
                             id="radio__sample_radio__soso"
                             class="half"
                             data-load="effect.property.sample_radio"/>
                      <label for="radio__sample_radio__soso">So-so</label>
                    </div>
                  </fieldset>
                </form>
                """
      script:   """
                <form id="form_effect_script" name="effect_script">
                  <fieldset class="effect-parameter-group">
                    <legend>効果を追加</legend>
                    <label for="textarea_script" class="half">プリセット</label>
                    <button class="half"><span class="girafont">lightning</span>プリセットを選択</button>
                    <textarea name="script" id="textarea_script" cols="30" rows="10" data-load="effect.script.script"></textarea>
                  </fieldset>
                </form>
                """
      crop:     """
                <form id="form_effect_crop" name="effect_crop">
                </form>
                """
      keying:   """
                <form id="form_effect_keying" name="effect_keying">
                </form>
                """
      color:    """
                <form id="form_effect_color" name="effect_color">
                </form>
                """
      text:     """
                <form id="form_effect_text" name="effect_text">
                </form>
                """
    self = @
    $("li.effect-tab-menu").on "click", ->
      self.changeTab ($(@).attr "data-change-effect-tab")
    @changeTab "property"

  changeTab: (name) ->
    $("li.effect-tab-menu").each ->
      $(@).removeClass "selected"
    $("li.effect-tab-menu[data-change-effect-tab=#{name}]")
      .addClass "selected"

    $(".effect-content").each ->
      $(@).addClass "hidden"
    $(".effect-content[data-effect-content=#{name}]")
      .removeClass "hidden"

  changeTarget: (@target_uuid) ->
    changeVal = ($input, val) ->
      if $input.get(0).tagName is "INPUT"
        if ($input.attr "type") is "checkbox"
          $input.prop "checked", (val is true)
        else if ($input.attr "type") is "radio"
          $input.prop "checked", ($input.val() is val)
        else
          $input.val val
      else if $input.get(0).tagName is "SELECT"
        $input.val val
      else if $input.get(0).tagName is "TEXTAREA"
        $input.val val

    update = (model, $input) ->
      data_load = $input.attr "data-load"
      if ($input.attr "type") is "checkbox"
        val = $input.prop "checked"
      else
        val = $input.val()

      model.update data_load, val
      $("[data-load=\"#{data_load}\"]").each ->
        changeVal $(@), val

    self = @
    $("[data-load]").each ->
      model = self.app.model.get(target_uuid)
      data = model.data
      _.each $(@).attr("data-load").split("."), (t) =>
        data = data?[t]
      if data?
        changeVal $(@), data
        $(@).parents ".effect-parameter-group"
            .removeClass "hidden"
        $(@).off "change"
            .on "change", =>
              update model, $(@)
      else
        $(@).parents ".effect-parameter-group"
            .addClass "hidden"
        $(@).off "change"

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


# ### Giraf.View.Expert.Node.Piece
class Giraf.View.Expert.Node.Piece extends Giraf.View.Expert._base
  @x = 0
  @y = 0


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

  # draw後は以下の要素が追加される
  # ```
  # d3composition: D3オブジェクト (contentLayer)
  # d3rect: D3オブジェクト (d3composition)
  # d3text: D3オブジェクト (d3composition)
  # d3circleDot: D3オブジェクト (d3composition)
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



# ### Giraf.View.Expert.Project
# ```
# app: appオブジェクト
# $project: 自身の表示場所のjQueryオブジェクト
# pieces: Project.Pieceオブジェクトのハッシュ(キーはUUID)
# ```
class Giraf.View.Expert.Project extends Giraf.View.Expert._base

  constructor: (@app, @$project) ->
    @pieces = {}

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
                            <div class="project-piece-tag"></div>
                            <div class="project-piece-content">
                              <img class="project-piece-thumbnail"/>
                              <div class="project-piece-title"><%- title %></div>
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

# ### Giraf.View.Modal
class Giraf.View.Modal extends Giraf.View._base

  constructor: ->

  #
  # 引数`args`は以下の通りのハッシュにする
  # ```
  # args:
  #   title: Modalのタイトル(文字列)
  #   content: Modalの内容(HTML)
  #   action:
  #     (任意のキー名):
  #       text: ボタンに表示する文字列
  #       [primary: true] (プライマリ要素にするときに追加)
  #     (任意のキー名):
  #         :
  #         :
  # ```
  show: (args) ->
    template =  _.template """
                <div class="modal">
                  <div class="modal-dialog">
                    <div class="modal-scroll-area">
                      <div class="modal-title"><h3><%- title %></h3></div>
                      <div class="modal-content"><%= content %></div>
                    </div>
                    <div class="modal-footer">
                      <div class="modal-action"><%= action %></div>
                    </div>
                  </div>
                </div>
                """
    args.title ?= ""
    args.content ?= ""
    action = createButtonDOM.call @, args.action
    $("body").append template
      title: args.title
      content: args.content
      action: action

    $(".modal-dialog").height ($(".modal-title").height() + $(".modal-content").height() + 120)

    $(".modal").on
      click: (event) ->
        if $(event.target).hasClass("modal")
          onEnd = ->
            do $(".modal").remove

          $(".modal-dialog").bind "transitionend", onEnd
          $(".modal").removeClass "show"

    setTimeout ->
      $(".modal").addClass "show"
    , 10


  createButtonDOM = (data) ->
    arr = []
    for key, value of data
      button = _.template """
                          <button class="flat<% if (primary === true) { print(' button-primary'); } %>">
                            <%- text %>
                          </button>
                          """
      arr.push button
        primary: value.primary is true
        text: value.text
    return arr.join ""


# ### Giraf.View.Nav
class Giraf.View.Nav extends Giraf.View._base
  _selector_dropdown = "li.dropdown"

  $dropdowns = null
  isActive = false


  constructor: (@app, @$nav) ->
    $dropdowns = @$nav.find _selector_dropdown

    self = @
    $dropdowns
      .on "mouseenter", ->
        self.active @ if isActive

    $(document).on "click", (event) ->
      if not $.contains $nav.get(0), event.target
        do self.inactive
      else if $(event.target).hasClass "dropdown-toggle"
        if not isActive
          self.active $(event.target).parent(".dropdown")
        else
          do self.inactive


  active: (target) ->
    d = new $.Deferred
    isActive = true
    $dropdowns.each (index, element) ->
      $(element).removeClass "open"
    $(target).addClass "open"
    setTimeout ->
      do d.resolve
    , 30
    do d.promise

  inactive: ->
    d = new $.Deferred
    isActive = false
    $dropdowns.each (index, element) ->
      $(element).removeClass "open"
    setTimeout ->
      do d.resolve
    , 30
    do d.promise

  isActive: ->
    return isActive

# ### Giraf.View.Quick
class Giraf.View.Quick extends Giraf.View._base
  selector_preview = "#quick_preview"
  selector_thumbnail = "#quick_thumbnail"
  selector_timeline = "#quick_timeline"
  selector_result = "#quick_result"

  constructor: (@$quick) ->

# ### Giraf.View.Quick._base
class Giraf.View.Quick._base extends Giraf.View._base


app = new Giraf.App
app.run()