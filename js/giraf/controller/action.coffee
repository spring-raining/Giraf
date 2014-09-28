class Giraf.Controller.Action extends Giraf.Controller._base
  constructor: (app, action, args) ->
    switch action
      when "drop__import_file"
          fileList = args.fileList
          task = new Giraf.Task.FileLoader
          task.run app, fileList
          .then ->
            console.log "done"
          , ->
            console.log "failed"
      when "expert__project__change_target"
          console.log args
      when "expert__project__refresh_composition"
          task = new Giraf.Task.RefreshComposition
          task.run app, $(args.element).attr "data-referer-uuid"
          .then ->
            console.log "done"
          , ->
            console.log "failed"
      when "nav__import_file"
          app.view.nav.inactive()
          .then ->
            task = new Giraf.Task.SelectFile
            task.run app
          .then (fileList) ->
            task = new Giraf.Task.FileLoader
            task.run app, fileList
          .then ->
            console.log "done"
          , ->
            console.log "failed"
      when "nav__hoge"
          app.view.nav.inactive()
          .then ->
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