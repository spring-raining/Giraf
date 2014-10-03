class Giraf.Task.CreateNewComposition
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