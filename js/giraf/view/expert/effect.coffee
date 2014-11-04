class Giraf.View.Expert.Effect extends Giraf.View.Expert._base
  constructor: (@app, @$effect) ->
    template = _.template """
                          <div class="effect-content hidden" data-effect-content="property"><%= property %></div>
                          <div class="effect-content hidden" data-effect-content="script"><%= script %></div>
                          <div class="effect-content hidden" data-effect-content="crop"><%= crop %></div>
                          <div class="effect-content hidden" data-effect-content="keying"><%= keying %></div>
                          <div class="effect-content hidden" data-effect-content="color"><%= color %></div>
                          <div class="effect-content hidden" data-effect-content="text"><%= text %></div>
                          <div class="effect-tab layer"></div>
                          <ul class="effect-tab">
                            <li class="effect-tab-menu girafont" data-change-effect-tab="property">parameter</li>
                            <li class="effect-tab-menu girafont" data-change-effect-tab="script">magic</li>
                            <li class="effect-tab-menu girafont" data-change-effect-tab="crop">crop</li>
                            <li class="effect-tab-menu girafont" data-change-effect-tab="keying">keying</li>
                            <li class="effect-tab-menu girafont" data-change-effect-tab="color">palette</li>
                            <li class="effect-tab-menu girafont" data-change-effect-tab="text">text</li>
                          </ul>
                          """
    @$effect.append template
      property: """
                <form id="form_effect_property" name="effect_property">
                  <fieldset class="effect-parameter-group">
                    <label for="select_out_framerate" class="half">出力するフレームレート</label>
                    <select name="out_framerate" id="select_out_framerate" class="half" data-load="effect.property.out_framerate">
                      <option value="1">1fps</option>
                      <option value="2">2fps</option>
                      <option value="3">3fps</option>
                      <option value="4">4fps</option>
                      <option value="6">6fps</option>
                      <option value="8">8fps</option>
                      <option value="12">12fps</option>
                      <option value="15">15fps</option>
                      <option value="24">24fps</option>
                      <option value="30">30fps</option>
                    </select>
                  </fieldset>
                  <fieldset class="effect-parameter-group">
                    <label for="input_out_speed" class="half">出力するスピード</label>
                    <input type="number" id="input_out_speed" class="half" data-load="effect.property.out_speed"/>
                    <input type="range" min="0.1" max="4.0" step="0.1" data-load="effect.property.out_speed"/>
                  </fieldset>
                  <fieldset class="effect-parameter-group">
                    <label for="input_out_size" class="half">出力する大きさ</label>
                    <input type="number" id="input_out_size" class="half" data-load="effect.property.out_speed"/>
                    <input type="range" min="40" max="720" data-load="effect.property.out_size"/>
                  </fieldset>
                  <fieldset class="effect-parameter-group">
                    <legend>切り取り位置を選択</legend>
                    <label for="" class="half">始点</label>
                    <label for="" class="half">終点</label>
                    <img src="" class="half"/>
                    <img src="" class="half"/>
                    <input type="hidden" data-load="effect.property.in_time"/>
                    <input type="hidden" data-load="effect.property.out_time"/>
                  </fieldset>
                  <fieldset class="effect-parameter-group">
                    <label for="select_select_framerate" class="half">切り取りフレームレート</label>
                    <select name="select_framerate" id="select_select_framerate" class="half" data-load="effect.property.select_framerate">
                      <option value="1">1fps</option>
                      <option value="2">2fps</option>
                      <option value="3">3fps</option>
                      <option value="4">4fps</option>
                      <option value="6">6fps</option>
                      <option value="8">8fps</option>
                      <option value="12">12fps</option>
                      <option value="15">15fps</option>
                      <option value="24">24fps</option>
                      <option value="30">30fps</option>
                    </select>
                    <div class="half"></div>
                    <button class="half">動画からコンポジションを作成</button>
                  </fieldset>
                </form>
                """
      script:   """
                <form id="form_effect_script" name="effect_script">
                  <fieldset class="effect-parameter-group">
                    <legend>効果を追加</legend>
                    <label for="textarea_script" class="half">プリセット</label>
                    <button class="half"><span class="girafont">lightning</span>プリセットを選択</button>
                    <textarea name="script" id="textarea_script" cols="30" rows="10" data-load="effect.script.script"></textarea>
                  </fieldset>
                </form>
                """
      crop:     """
                <form id="form_effect_crop" name="effect_crop">
                </form>
                """
      keying:   """
                <form id="form_effect_keying" name="effect_keying">
                </form>
                """
      color:    """
                <form id="form_effect_color" name="effect_color">
                </form>
                """
      text:     """
                <form id="form_effect_text" name="effect_text">
                </form>
                """
    self = @
    $("li.effect-tab-menu").on "click", ->
      self.changeTab ($(@).attr "data-change-effect-tab")
    @changeTab "property"

  changeTab: (name) ->
    $("li.effect-tab-menu").each ->
      $(@).removeClass "selected"
    $("li.effect-tab-menu[data-change-effect-tab=#{name}]")
      .addClass "selected"

    $(".effect-content").each ->
      $(@).addClass "hidden"
    $(".effect-content[data-effect-content=#{name}]")
      .removeClass "hidden"

  changeTarget: (@target_uuid) ->
    self = @
    $("[data-load").each ->
      data = self.app.model.get(target_uuid).data
      _.each $(@).attr("data-load").split("."), (t) =>
        data = data?[t]
      if data
        $(@).parents ".effect-parameter-group"
            .removeClass "hidden"
        $(@).val data
      else
        $(@).parents ".effect-parameter-group"
            .addClass "hidden"