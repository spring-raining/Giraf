class Giraf.View.Expert.Composition extends Giraf.View.Expert._base
  constructor: (@app, @$composition) ->
    template = _.template """
                          <div class="composition-window">
                            <div class="composition-window-placeholder">
                              <span>Composition</span>
                              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores corporis delectus, doloremque eligendi explicabo fugit harum iusto magnam minus natus non odit officia perspiciatis possimus provident quo similique, suscipit tempora!</p><p>Aut ea eveniet facere officia placeat qui quod soluta! A autem commodi culpa cum, dignissimos dolorum eveniet, explicabo minima nesciunt nisi, officia omnis optio quae quas quia reiciendis rem unde?</p><p>Assumenda consectetur corporis et magnam voluptate. Ab aut beatae corporis cum dolorem dolores eius est expedita fuga hic, ipsum nobis quasi quibusdam quo recusandae soluta temporibus ut veniam vitae voluptatem?</p><p>Cupiditate dignissimos dolore dolorum ducimus enim, et explicabo fugit illo ipsa ipsam itaque laborum maiores nemo obcaecati quas quia quis similique! Autem consectetur dignissimos laudantium magni odit tenetur veniam vero.</p><p>Ab amet debitis dolorem est eveniet explicabo illum incidunt libero, magni minima, natus numquam omnis placeat porro quisquam saepe tempora voluptate! Aliquam eius error facere, maiores numquam vel veniam voluptatum.</p><p>Aliquid, assumenda consectetur cum cumque deserunt distinctio expedita fugit harum impedit magnam nemo nihil nobis perspiciatis ratione repellat sed, suscipit. At atque eos in molestias, nesciunt quas reiciendis. Consequuntur, ipsum.</p>
                            </div>
                            <img class="composition-img hidden"/>
                            <video class="composition-video hidden"></video>
                          </div>
                          <div class="composition-progress"></div>
                          """
    @$composition.append template {}

  refresh: (type, content_url) ->
    d = do $.Deferred
    switch type
      when "video"
        $video = $ "video.composition-video"
        do d.reject unless $video.get(0)?
        $(".composition-window").children().each ->
          $(@).addClass "hidden"
        $video.removeClass "hidden"
          .attr "src", content_url
          .one "canplay", ->
            do d.resolve
      when "img"
        $img = $ "img.composition-img"
        do d.reject unless $img.get(0)?
        $(".composition-window").children().each ->
          $(@).addClass "hidden"
        $img.removeClass "hidden"
          .attr "src", content_url
        do d.resolve
      else
        console.log "Type '#{type}' is not defined."
        do d.resolve

    do d.promise