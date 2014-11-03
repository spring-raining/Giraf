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
                    <select name="out_framerate" id="select_out_framerate" class="half">
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
                    <input type="number" id="input_out_speed" class="half"/>
                    <input type="range" min="0.1" max="4.0" step="0.1" value="1.0"/>
                  </fieldset>
                  <fieldset class="effect-parameter-group">
                    <label for="input_out_size" class="half">出力する大きさ</label>
                    <input type="number" id="input_out_size" class="half"/>
                    <input type="range"/>
                  </fieldset>
                </form>
                """
      script:   """
                <form id="form_effect_script" name="effect_script">
                  <fieldset class="effect-parameter-group">
                    <legend>効果を追加</legend>
                    <label for="textarea_script" class="half">プリセット</label>
                    <button class="half"><span class="girafont">lightning</span>プリセットを選択</button>
                    <textarea name="script" id="textarea_script" cols="30" rows="10"></textarea>
                  </fieldset>
                </form>
                """
      crop:     """
                <form id="form_effect_crop" name="effect_crop">
                  <div class="effect-parameter-group">
                  </div>
                </form>
                """
      keying:   """
                <form id="form_effect_keying" name="effect_keying">
                  <div class="effect-parameter-group">
                  </div>
                </form>
                """
      color:    """
                <form id="form_effect_color" name="effect_color">
                  <div class="effect-parameter-group">
                  </div>
                </form>
                """
      text:     """
                <form id="form_effect_text" name="effect_text">
                  <div class="effect-parameter-group">
                  </div>
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