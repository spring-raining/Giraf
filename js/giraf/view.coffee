class Giraf.View extends Giraf._base
  _selector_nav = "nav"
  _selector_quick = "#quick"
  _selector_expert = "#expert"

  constructor: (@app) ->
    @nav = new Giraf.View.Nav app, $(_selector_nav)
    @expert = new Giraf.View.Expert app, $(_selector_expert)

    $(document).on "click", (event) =>
      $t = $ event.target
      if $t.attr("data-action")?
        Giraf.Controller.Action app, $t.attr("data-action"),
          element: event.target
      if $t.attr("data-action-weak")?
        Giraf.Controller.Action app, $t.attr("data-action-weak"),
          element: event.target
      if $t.attr("data-action-click")?
        Giraf.Controller.Action app, $t.attr("data-action-click"),
          element: event.target
      if $t.attr("data-action-click-weak")?
        Giraf.Controller.Action app, $t.attr("data-action-click-weak"),
          element: event.target

      $t.parents("[data-action]").each ->
        Giraf.Controller.Action app, $(@).attr("data-action"),
          element: @
      $t.parents("[data-action-click]").each ->
        Giraf.Controller.Action app, $(@).attr("data-action-click"),
          element: @
    .on "dblclick", (event) =>
      $t = $ event.target
      if $t.attr("data-action-dblclick")?
        Giraf.Controller.Action app, $t.attr("data-action-dblclick"),
          element: event.target
      if $t.attr("data-action-dblclick-weak")?
        Giraf.Controller.Action app, $t.attr("data-action-dblclick-weak"),
          element: event.target

      $t.parents("[data-action-dblclick]").each ->
        Giraf.Controller.Action app, $(@).attr("data-action-dblclick"),
          element: @