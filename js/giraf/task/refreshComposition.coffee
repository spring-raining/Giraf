class Giraf.Task.RefreshComposition
  run: (app, uuid) ->
    d = do $.Deferred
    console.log app.view.expert.composition
    content = app.model.files.getContentByUUID uuid
    app.view.expert.composition.refresh "video", content
    .then ->
      do d.resolve
    , ->
      do d.reject

    do d.promise