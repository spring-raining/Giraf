# ### Giraf.View.Expert
# ```
# app: appオブジェクト
# $expert: 自身の表示場所のjQueryオブジェクト
# ```
class Giraf.View.Expert extends Giraf.View._base
  _selector_container = "#expert_container"
  _selector_project = "#expert_project > .panel-container"
  _selector_composition = "#expert_composition > .panel-container"
  _selector_effect = "#expert_effect > .panel-container"
  _selector_node = "#expert_node > .panel-container"

  constructor: (@app, @$expert) ->
    @project = new Giraf.View.Expert.Project app, $expert.find _selector_project
    @composition = new Giraf.View.Expert.Composition app, $expert.find _selector_composition
    @effect = new Giraf.View.Expert.Effect app, $expert.find _selector_effect
    @node = new Giraf.View.Expert.Node app, $expert.find _selector_node
    @droparea = new Giraf.View.Expert.Droparea app, $expert

