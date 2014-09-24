class Giraf.View.Nav extends Giraf.View._base
  _selector_dropdown = "li.dropdown"

  $dropdowns = null
  isActive = false


  constructor: (@$nav) ->
    $dropdowns = @$nav.find _selector_dropdown

    self = @
    $dropdowns.on
      mouseenter: ->
        self.active @ if isActive

      click: ->
        if not $(@).hasClass "open"
          self.active @

    $(document).on "click", (event) ->
      if not $.contains $nav.get(0), event.target
        do self.inactive


  active: (target) ->
    isActive = true
    $dropdowns.each (index, element) ->
      $(element).removeClass "open"
    $(target).addClass "open"


  inactive: ->
    isActive = false
    $dropdowns.each (index, element) ->
      $(element).removeClass "open"

  isActive: ->
    return isActive