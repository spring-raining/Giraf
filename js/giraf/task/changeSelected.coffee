# ## Giraf.Task.ChangeSelected
class Giraf.Task.ChangeSelected

  # view上の項目を選択する
  run: (app, uuid) ->
    d = do $.Deferred

    app.view.expert.select uuid
    .done =>
      do d.resolve

    do d.promise