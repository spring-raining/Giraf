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