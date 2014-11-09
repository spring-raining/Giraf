class Giraf.Model._base extends Giraf._base

  @data = {}

  update: (key, value) ->
    data = @data
    key_array = key.split(".")
    last_key = key_array.pop()
    _.each key_array, (t) =>
      data = data?[t]
    if data[last_key]?
      if typeof data[last_key] is "number"
        data[last_key] = Number(value)
      else
        data[last_key] = value