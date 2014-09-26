class Giraf.View extends Giraf._base
  _selector_nav = "nav"
  _selector_quick = "#quick"
  _selector_expert = "#expert"

  constructor: (@app) ->
    @nav = new Giraf.View.Nav app, $(_selector_nav)
    @expert = new Giraf.View.Expert app, $(_selector_expert)

    $(document).on "click", (event) =>
      if $(event.target).attr("data-action")?
        Giraf.Controller.Action app, $(event.target).attr("data-action")