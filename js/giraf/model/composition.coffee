class Giraf.Model.Compositions extends Giraf.Model._base

  @append: (app, name) ->
    d = new $.Deferred
    uuid = do Giraf.Tools.uuid
    app.model.set uuid,
      new Giraf.Model.Composition app, uuid, (name ? "New Composition")
    d.resolve uuid
    do d.promise

class Giraf.Model.Composition extends Giraf.Model._base
  constructor: (@app, @uuid, @name) ->
