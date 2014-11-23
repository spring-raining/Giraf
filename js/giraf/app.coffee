# ### Giraf.App
# ```
# model: Modelオブジェクト
# view: Viewオブジェクト
# settings: Settingsオブジェクト
# ```
class Giraf.App extends Giraf._base

  run: =>
    $ =>
      @model = new Giraf.Model
      #@model.files = new Giraf.Model.Files @
      @view = new Giraf.View @
      @settings = new Giraf.Settings @
