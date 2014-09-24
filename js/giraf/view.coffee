class Giraf.View extends Giraf._base
  _selector_nav = "nav"
  _selector_quick = "#quick"
  _selector_expert = "#expert"

  constructor: (@app) ->
    @nav = new Giraf.View.Nav $(_selector_nav)
    @quick = new Giraf.View.Quick $(_selector_quick)
    @expert = new Giraf.View.Expert $(_selector_expert)
    #@modal = new Giraf.View.Modal

    $(document).on "click", (event) =>
      if $(event.target).attr("data-action")?
        if $(event.target).attr("data-action") is "nav_hoge"
          do @nav.inactive
          modal = new Giraf.View.Modal
          modal.show
            title: "たいとる"
            content: """
                     <b>ああああ</b>いいいい
                     """
            action:
              yes:
                text: "はい"
                primary: true
              no:
                text: "いいえ"