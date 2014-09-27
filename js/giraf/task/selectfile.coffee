class Giraf.Task.SelectFile extends Giraf.Task._base
  run: (app) ->
    d = new $.Deferred
    inputId = "SelectFile"
    $input = $("##{inputId}")
    unless $input.get(0)?
      $("body").append """
                       <input type="file" name="file" id="#{inputId}" class="hidden" value="" multiple="multiple"/>
                       """
      $input = $("##{inputId}")

    $input.on "change", ->
      fileList = $input.get(0).files
      d.resolve fileList

    $input.trigger "click"
    do d.promise