# ### Giraf.Settings.CookieBinder
class Giraf.Settings.CookieBinder extends Giraf.Settings._base

  constructor: (@app) ->
    $.cookie.json = true

  set: (data) ->
    $.cookie 'giraf',
      version: 100
      data: data

  get: ->
    return $.cookie 'giraf'

  clear: ->
    $.removeCookie 'giraf'