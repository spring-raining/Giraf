class Giraf.Task.FileLoader extends Giraf.Task._base
  run: (app, files) ->
    d = do $.Deferred
    tasks = []

    for file in files
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