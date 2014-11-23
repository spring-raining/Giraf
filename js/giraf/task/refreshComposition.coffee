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