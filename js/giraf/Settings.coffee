class Giraf.Settings extends Giraf._base

  constructor: (@app) ->
    cookieBinder = new Giraf.Settings.CookieBinder()