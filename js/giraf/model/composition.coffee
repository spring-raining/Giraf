class Giraf.Model.Compositions extends Giraf.Model._base

  @append: (app) ->
    uuid = do Giraf.Tools.uuid
    app.model.set uuid,
      new Giraf.Model.Composition app, uuid
    return uuid

class Giraf.Model.Composition extends Giraf.Model._base
  constructor: (@app, @uuid) ->

class Giraf.Model.Composition.File extends Giraf.Model.Composition
  constructor: (@app, @uuid, @file_uuid) ->
    super app, uuid