class Giraf.Task.RefreshComposition
  run: (app, uuid) ->
    d = do $.Deferred
    piece = app.view.expert.project.pieces[uuid]
    file = app.model.get piece.referer_uuid
    type = null
    switch file.file.type
      when "video/mp4"
        type = "video"
      when "image/gif", "image/png", "image/jpeg"
        type = "img"
      else

    do d.reject unless type?
    app.view.expert.composition.refresh type, file.content
    .then ->
      do d.resolve
    , ->
      do d.reject

    do d.promise