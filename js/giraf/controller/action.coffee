# ### Giraf.Controller.Action
class Giraf.Controller.Action extends Giraf.Controller._base
  constructor: (app, action, args) ->
    switch action
      # #### 命名規則
      # `[アクション実行が呼び出された場所]__[実行内容]`
      # 例1：`nav__import_file`
      # 例2：`expert__project__refresh_composition`
      when "drop__import_file"
          fileList = args.fileList
          task = new Giraf.Task.FileLoader
          task.run app, fileList
          .fail ->
            console.log "failed : #{action}"
      when "expert__project__refresh_composition"
          piece = app.view.expert.project.pieces[$(args.element).attr "data-uuid"]
          task = new Giraf.Task.RefreshComposition
          task.run app, piece.referer_uuid
          .fail ->
            console.log "failed : #{action}"
      when "nav__append_point"
          app.view.nav.inactive()
          .then ->
            app.view.expert.node.appendPoint()
          .fail ->
            console.log "failed : #{action}"
      when "expert__change_target"
          task = new Giraf.Task.ChangeSelected
          task.run app, ($(args.element).attr "data-uuid")
          .fail ->
            console.log "failed : #{action}"
      when "nav__import_file"
          app.view.nav.inactive()
          .then ->
            task = new Giraf.Task.SelectFile
            task.run app
          .then (fileList) ->
            task = new Giraf.Task.FileLoader
            task.run app, fileList
          .fail ->
            console.log "failed : #{action}"
      when "nav__new_composition"
          app.view.nav.inactive()
          .then ->
            task = new Giraf.Task.CreateNewComposition
            task.run app
          .fail ->
            console.log "failed : #{action}"
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
      when "nav__render_composition"
          app.view.nav.inactive()
          .then ->
            app.view.expert.getSelected()
          .then (selected) ->
            task = new Giraf.Task.RenderComposition
            task.run selected.referer_uuid
          .fail ->
            console.log "failed : #{action}"

      else
          console.log "Action '#{action}' is not defined."