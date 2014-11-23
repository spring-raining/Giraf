# ### Giraf.View.Expert.Effect
# ```
# app: appオブジェクト
# $effect: 自身の表示場所のjQueryオブジェクト
# ```
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
                    <label for="select__out_framerate" class="half">出力するフレームレート</label>
                    <select name="out_framerate"
                            id="select__out_framerate"
                            class="half"
                            data-load="effect.property.out_framerate">
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
                    <label for="number__out_speed">出力するスピード</label>
                    <div class="slider-group">
                      <input type="range"
                             min="0.1" max="4.0" step="0.1"
                             data-load="effect.property.out_speed"/>
                      <input type="number"
                             min="0.1" max="4.0" step="0.1"
                             id="number__out_speed"
                             data-load="effect.property.out_speed"/>
                    </div>
                    <label for="number__out_size">出力する大きさ</label>
                    <div class="slider-group">
                      <input type="range"
                             min="40" max="720" step="10"
                             data-load="effect.property.out_size"/>
                      <input type="number"
                             min="40" max="720" step="10"
                             id="number__out_size"
                             data-load="effect.property.out_size"/>
                    </div>
                  </fieldset>
                """ +
                """
                  <fieldset class="effect-parameter-group">
                    <legend>切り取り位置を選択</legend>
                    <label for="" class="half">始点</label>
                    <label for="" class="half">終点</label>
                    <img src="" class="half"/>
                    <img src="" class="half"/>
                    <input type="hidden"
                           data-load="effect.property.in_time"/>
                    <input type="hidden"
                           data-load="effect.property.out_time"/>
                    <label for="select_select_framerate" class="half">切り取りフレームレート</label>
                    <select name="select_framerate"
                            id="select_select_framerate"
                            class="half"
                            data-load="effect.property.select_framerate">
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
                """ +
                """
                  <fieldset class="effect-parameter-group">
                    <legend>ほげほげ</legend>
                    <label class="half" for="checkbox__sample_check">チェック</label>
                    <input type="checkbox"
                           name="sample_check"
                           id="checkbox__sample_check"
                           value="sample_check"
                           class="half"
                           data-load="effect.property.sample_check"/>
                    <label class="half">ラジオ</label>
                    <div class="half">
                      <input type="radio"
                             name="sample_radio"
                             value="yes"
                             id="radio__sample_radio__yes"
                             class="half"
                             data-load="effect.property.sample_radio"/>
                      <label for="radio__sample_radio__yes">Yes</label>
                    </div>
                    <div class="half"></div>
                    <div class="half">
                      <input type="radio"
                             name="sample_radio"
                             value="no"
                             id="radio__sample_radio__no"
                             class="half"
                             data-load="effect.property.sample_radio"/>
                      <label for="radio__sample_radio__no">No</label>
                    </div>
                    <div class="half"></div>
                    <div class="half">
                      <input type="radio"
                             name="sample_radio"
                             value="soso"
                             id="radio__sample_radio__soso"
                             class="half"
                             data-load="effect.property.sample_radio"/>
                      <label for="radio__sample_radio__soso">So-so</label>
                    </div>
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
    changeVal = ($input, val) ->
      if $input.get(0).tagName is "INPUT"
        if ($input.attr "type") is "checkbox"
          $input.prop "checked", (val is true)
        else if ($input.attr "type") is "radio"
          $input.prop "checked", ($input.val() is val)
        else
          $input.val val
      else if $input.get(0).tagName is "SELECT"
        $input.val val
      else if $input.get(0).tagName is "TEXTAREA"
        $input.val val

    update = (model, $input) ->
      data_load = $input.attr "data-load"
      if ($input.attr "type") is "checkbox"
        val = $input.prop "checked"
      else
        val = $input.val()

      model.update data_load, val
      $("[data-load=\"#{data_load}\"]").each ->
        changeVal $(@), val

    self = @
    $("[data-load]").each ->
      model = self.app.model.get(target_uuid)
      data = model.data
      _.each $(@).attr("data-load").split("."), (t) =>
        data = data?[t]
      if data?
        changeVal $(@), data
        $(@).parents ".effect-parameter-group"
            .removeClass "hidden"
        $(@).off "change"
            .on "change", =>
              update model, $(@)
      else
        $(@).parents ".effect-parameter-group"
            .addClass "hidden"
        $(@).off "change"