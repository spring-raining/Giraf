class Giraf.Task.FileLoader extends Giraf.Task._base
  run: (app, files) ->
    d = do $.Deferred
    tasks = []

    for file in files
      tasks.push do ->
        d_ = do $.Deferred
        readFile.call @, file
          .then (file, content) ->
            app.model.files.append file, content
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