class Giraf.Model.Files extends Giraf.Model._base
  constructor: (@app) ->
    @files = []

  append: (file, content)->
    @files.push new Giraf.Model.Files.File file, content


class Giraf.Model.Files.File extends Giraf.Model._base
  constructor: (@file, @content) ->