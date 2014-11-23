# ### Giraf.View
# ```
# nav: View.Navオブジェクト
# expert.View.Expertオブジェクト
# ```
class Giraf.View extends Giraf._base
  _selector_nav = "nav"
  _selector_quick = "#quick"
  _selector_expert = "#expert"

  constructor: (@app) ->
    @nav = new Giraf.View.Nav app, $(_selector_nav)
    @expert = new Giraf.View.Expert app, $(_selector_expert)

    # HTML属性に次の属性があった場合、イベントに応じてActionが実行される
    # - `data-action`,`data-action-click`: クリックされた際に実行
    # - `data-action-weak`, `data-action-click-weak`: クリックされた際に実行(子要素は対象外)
    # - `data-action-dblclick`: ダブルクリックされた際に実行
    # - `data-action-dblclick-weak`: ダブルクリックされた際に実行(子要素は対象外)
    $(document).on "click", (event) =>
      $t = $ event.target
      if $t.attr("data-action")?
        _.each $t.attr("data-action").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target
      if $t.attr("data-action-weak")?
        _.each $t.attr("data-action-weak").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target
      if $t.attr("data-action-click")?
        _.each $t.attr("data-action-click").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target
      if $t.attr("data-action-click-weak")?
        _.each $t.attr("data-action-click-weak").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target

      $t.parents("[data-action]").each ->
        _.each $(@).attr("data-action").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: @
      $t.parents("[data-action-click]").each ->
        _.each $(@).attr("data-action-click").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: @

    .on "dblclick", (event) =>
      $t = $ event.target
      if $t.attr("data-action-dblclick")?
        _.each $t.attr("data-action-dblclick").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target
      if $t.attr("data-action-dblclick-weak")?
        _.each $t.attr("data-aciton-dblclick-weak").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: event.target

      $t.parents("[data-action-dblclick]").each ->
        _.each $(@).attr("data-action-dblclick").split(" "), (action) =>
          Giraf.Controller.Action app, action,
            element: @