class Giraf.Settings.CookieBinder extends Giraf.Settings._base

  constructor: ->
    $.cookie.json = true

  set: (data) ->
    $.cookie 'giraf',
      version: 100
      data: data

  get: ->
    return $.cookie 'giraf'

  clear: ->
    $.removeCookie 'giraf'