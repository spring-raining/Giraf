class Giraf.View.Expert.Droparea extends Giraf.View.Expert._base
  isActive = false
  innerAcitve = 0

  constructor: (@app, @$droparea) ->
    $droparea
      .on "dragstart", =>
        true
      .on "dragover", =>
        false
      .on "dragenter", =>
        if isActive
          innerAcitve++
        else
          do @show
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