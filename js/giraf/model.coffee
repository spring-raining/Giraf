# ### Giraf.Model
class Giraf.Model extends Giraf._base
  constructor: ->
    @models = {}

  set: (uuid, model) ->
    @models[uuid] = model

  get: (uuid) ->
    return @models[uuid]