class Giraf.Task.ChangeSelected
  run: (app, uuid) ->
    d = do $.Deferred

    $.when (app.view.expert.project.select uuid),
           (app.view.expert.node.select uuid)
    .done =>
      do d.resolve

    do d.promise