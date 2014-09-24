class Giraf.Controller.Action extends Giraf.Controller._base
  constructor: (action, app) ->
    switch action
      when "nav_hoge"
          do app.view.nav.inactive
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

      else
          console.log "Action '#{action}' is not defined."