class Giraf.View.Nav extends Giraf.View._base
  _selector_dropdown = "li.dropdown"

  $dropdowns = null
  isActive = false


  constructor: (@app, @$nav) ->
    $dropdowns = @$nav.find _selector_dropdown

    self = @
    $dropdowns
      .on "mouseenter", ->
        self.active @ if isActive

    $(document).on "click", (event) ->
      if not $.contains $nav.get(0), event.target
        do self.inactive
      else if $(event.target).hasClass "dropdown-toggle"
        if not isActive
          self.active $(event.target).parent(".dropdown")
        else
          do self.inactive


  active: (target) ->
    d = new $.Deferred
    isActive = true
    $dropdowns.each (index, element) ->
      $(element).removeClass "open"
    $(target).addClass "open"
    setTimeout ->
      do d.resolve
    , 30
    do d.promise

  inactive: ->
    d = new $.Deferred
    isActive = false
    $dropdowns.each (index, element) ->
      $(element).removeClass "open"
    setTimeout ->
      do d.resolve
    , 30
    do d.promise

  isActive: ->
    return isActive