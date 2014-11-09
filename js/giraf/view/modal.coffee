class Giraf.View.Modal extends Giraf.View._base

  constructor: ->

  show: (args) ->
    template =  _.template """
                <div class="modal">
                  <div class="modal-dialog">
                    <div class="modal-scroll-area">
                      <div class="modal-title"><h3><%- title %></h3></div>
                      <div class="modal-content"><%= content %></div>
                    </div>
                    <div class="modal-footer">
                      <div class="modal-action"><%= action %></div>
                    </div>
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

    $(".modal-dialog").height ($(".modal-title").height() + $(".modal-content").height() + 120)

    $(".modal").on
      click: (event) ->
        if $(event.target).hasClass("modal")
          onEnd = ->
            do $(".modal").remove

          $(".modal-dialog").bind "transitionend", onEnd
          $(".modal").removeClass "show"

    setTimeout ->
      $(".modal").addClass "show"
    , 10


  createButtonDOM = (data) ->
    arr = []
    for key, value of data
      button = _.template """
                          <button class="flat<% if (primary === true) { print(' button-primary'); } %>">
                            <%- text %>
                          </button>
                          """
      arr.push button
        primary: value.primary is true
        text: value.text
    return arr.join ""
