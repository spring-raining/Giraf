class Giraf.View.Modal extends Giraf.View._base

  constructor: ->

  show: (args) ->
    template =  _.template """
                <div class="modal">
                  <div class="modal-dialog">
                    <div class="modal-title"><h3><%- title %></h3></div>
                    <div class="modal-content"><%= content %></div>
                    <div class="modal-action"><%= action %></div>
                  </div>
                </div>
                """
    args.title ?= ""
    args.content ?= ""
    action = createButtonDOM.call @, args.action
    $("body").append template
      title: args.title
      content: args.content
      action: action

    $(".modal").on
      click: (event) ->
        if $(event.target).hasClass("modal")
          onEnd = ->
            do $(".modal").remove

          $(".modal-dialog").bind "transitionend", onEnd
          $(".modal").removeClass "show"

    setTimeout ->
      $(".modal").addClass "show"
    , 0


  createButtonDOM = (data) ->
    arr = []
    for key, value of data
      button = _.template """
                          <button
                            <% if (primary === true) { print('class="button-primary"'); } %>
                          >
                            <%- text %>
                          </button>
                          """
      arr.push button
        primary: value.primary is true
        text: value.text
    return arr.join ""
