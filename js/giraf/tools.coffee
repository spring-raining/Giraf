# ### Giraf.Tools
class Giraf.Tools extends Giraf._base

  # UUIDを生成する(staticメソッド)
  @uuid: ->
    # http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    s4 = ->
      return `(((1+Math.random())*0x10000)|0).toString(16).substring(1)`
    return `s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+ s4()+s4()+s4()`