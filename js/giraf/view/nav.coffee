class Giraf.View.Nav extends Giraf.View._base
  _selector_dropdown = "li.dropdown"

  $dropdowns = null
  active = false

  constructor: (@$nav) ->
    $dropdowns = @$nav.find(_selector_dropdown)

    $dropdowns.on
      mouseenter: ->
        $(@).trigger "click" if active

      click: ->
        active = true
        $dropdowns.each (index, element) ->
          $(element).removeClass "open"
        $(@).addClass "open"

    $(document).on
      click: (event) ->
        if not $.contains $nav.get(0), event.target
          active = false
          $dropdowns.each (index, element) ->
            $(element).removeClass "open"