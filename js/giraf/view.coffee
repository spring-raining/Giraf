class Giraf.View extends Giraf._base
  _selector_nav = "nav"
  _selector_quick = "#quick"
  _selector_expert = "#expert"

  constructor: (@app) ->
    @nav = new Giraf.View.Nav $(_selector_nav)
    @quick = new Giraf.View.Quick $(_selector_quick)
    @expert = new Giraf.View.Expert $(_selector_expert)

    $(document).on "click", (event) =>
      if $(event.target).attr("data-action")?
        Giraf.Controller.Action $(event.target).attr("data-action"), app