# hitode909/rokuga
# https://github.com/hitode909/rokuga
class Giraf.FileHandler
  constructor: (args) ->
    @$container = args.$container
    throw "$container required" unless @$container
    @$file_input = args.$file_input
    @bindEvents()

  bindEvents: ->
    @$container
    .on 'dragstart', =>
        true
    .on 'dragover', =>
        false
    .on 'dragenter', (event) =>
        if @$container.is event.target
          ($ this).trigger 'enter'
        false
    .on 'dragleave', (event) =>
        if @$container.is event.target
          ($ this).trigger 'leave'
    .on 'drop', (jquery_event) =>
        event = jquery_event.originalEvent
        files = event.dataTransfer.files
        if files.length > 0
          ($ this).trigger 'drop', [files]

          (@readFiles files).done (contents) =>
            ($ this).trigger 'data_url_prepared', [contents]

        false

    @$file_input.on 'change', (jquery_event) =>
      (@readFiles (@$file_input.get 0 ).files).done (contents) =>
        ($ this).trigger 'data_url_prepared', [contents]

  readFiles: (files) ->
    read_all = do $.Deferred
    contents = []
    i = 0

    role = =>
      if files.length <= i
        read_all.resolve contents
      else
        file = files[i++]
        (@readFile file).done (content) ->
          contents.push content
        .always ->
            do role

    do role

    do read_all.promise

  readFile: (file) ->
    read = do $.Deferred
    reader = new FileReader
    reader.onload = ->
      read.resolve reader.result
    reader.onerror = (error) ->
      read.reject error
    reader.readAsDataURL file

    do read.promise