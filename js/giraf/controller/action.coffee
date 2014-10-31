class Giraf.Controller.Action extends Giraf.Controller._base
  constructor: (app, action, args) ->
    switch action
      when "drop__import_file"
          fileList = args.fileList
          task = new Giraf.Task.FileLoader
          task.run app, fileList
          .fail ->
            console.log "failed"
      when "expert__project__refresh_composition"
          piece = app.view.expert.project.pieces[$(args.element).attr "data-uuid"]
          task = new Giraf.Task.RefreshComposition
          task.run app, piece.referer_uuid
          .fail ->
            console.log "failed"
      when "nav__append_point"
          app.view.nav.inactive()
          .then ->
            app.view.expert.node.appendPoint()
          .fail ->
            console.log "failed"
      when "expert__change_target"
          task = new Giraf.Task.ChangeSelected
          task.run app, ($(args.element).attr "data-uuid")
          .fail ->
            console.log "failed"
      when "nav__import_file"
          app.view.nav.inactive()
          .then ->
            task = new Giraf.Task.SelectFile
            task.run app
          .then (fileList) ->
            task = new Giraf.Task.FileLoader
            task.run app, fileList
          .fail ->
            console.log "failed"
      when "nav__new_composition"
          app.view.nav.inactive()
          .then ->
            task = new Giraf.Task.CreateNewComposition
            task.run app
          .fail ->
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