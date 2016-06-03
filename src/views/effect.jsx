"use strict";

import React                              from "react";
import {FormattedMessage}                 from "react-intl";

import Actions                            from "src/actions/actions";
import Store                              from "src/stores/store";
import {Composition}                      from "src/stores/model/composition";
import {Layer}                            from "src/stores/model/layer";
import {round}                            from "src/utils/mathUtils";
import {Number, Checkbox, ScriptArea, Text} from "src/views/forms";


var Effect = React.createClass({
  getInitialState() {
    return {
      isFixingAspect: true,
      layerTransformDragging: false,
    };
  },

  render() {
    const activeItem = Store.get("activeItem");
    const selectingItem = Store.get("selectingItem");

    if (activeItem instanceof Composition) {
      const comp = activeItem;

      if (selectingItem instanceof Layer) {
        // Layer edit mode
        const layer = selectingItem;
        const transform = this.state.layerTransformDragging
          ? layer.transform
          : layer.tmpTransform || layer.transform;
        const source = (layer.entity)
          ? <div className="effect__input">
              <div className="effect__input__left">ソース名</div>
              <div className="effect__input__right">
                <div>
                  <div>{layer.entity.name}</div>
                  <a onClick={this._onChangeActiveItemClick(layer.entity)}>
                    ソースを編集
                  </a>
                </div>
              </div>
            </div>
          : null;

        return (
          <section className="effect panel">

            <fieldset>
              <div className="effect__legend">
                <Text value={layer.name}
                      onChange={this._onLayerNameChange(layer)} />
              </div>

              {source}
            </fieldset>

            <fieldset>
              <div className="effect__legend">
                <FormattedMessage id="views.effect.transform"
                                  defaultMessage="Transform" />
              </div>
              <div className="effect__input">
                <div className="effect__input__left">
                  <FormattedMessage id="views.effect.anchor_point"
                                    defaultMessage="Anchor Point" />
                </div>
                <div className="effect__input__right">
                  <Number value={transform.anchorPoint.x}
                          prefixString="X "
                          onChange={this._onLayerTransformChange(layer)("anchor-point-x")}
                          onDragStart={this._onLayerTransformDragStart(layer)("anchor-point-x")}
                          onDrag={this._onLayerTransformDrag(layer)("anchor-point-x")}
                          onDragEnd={this._onLayerTransformDragEnd(layer)("anchor-point-x")} />
                  <Number value={transform.anchorPoint.y}
                          prefixString="Y "
                          onChange={this._onLayerTransformChange(layer)("anchor-point-y")}
                          onDragStart={this._onLayerTransformDragStart(layer)("anchor-point-y")}
                          onDrag={this._onLayerTransformDrag(layer)("anchor-point-y")}
                          onDragEnd={this._onLayerTransformDragEnd(layer)("anchor-point-y")} />
                </div>
              </div>

              <div className="effect__input">
                <div className="effect__input__left">
                  <FormattedMessage id="views.effect.position"
                                    defaultMessage="Position" />
                </div>

                <div className="effect__input__right">
                  <Number value={transform.position.x}
                          prefixString="X "
                          onChange={this._onLayerTransformChange(layer)("position-x")}
                          onDragStart={this._onLayerTransformDragStart(layer)("position-x")}
                          onDrag={this._onLayerTransformDrag(layer)("position-x")}
                          onDragEnd={this._onLayerTransformDragEnd(layer)("position-x")} />
                  <Number value={transform.position.y}
                          prefixString="Y "
                          onChange={this._onLayerTransformChange(layer)("position-y")}
                          onDragStart={this._onLayerTransformDragStart(layer)("position-y")}
                          onDrag={this._onLayerTransformDrag(layer)("position-y")}
                          onDragEnd={this._onLayerTransformDragEnd(layer)("position-y")} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">
                  <FormattedMessage id="views.effect.scale"
                                    defaultMessage="Scale" />
                </div>
                <div className="effect__input__right">
                  <Number value={transform.scale.x}
                          step={0.01}
                          prefixString="X "
                          onChange={this._onLayerTransformChange(layer)("scale-x")}
                          onDragStart={this._onLayerTransformDragStart(layer)("scale-x")}
                          onDrag={this._onLayerTransformDrag(layer)("scale-x")}
                          onDragEnd={this._onLayerTransformDragEnd(layer)("scale-x")} />
                  <Number value={transform.scale.y}
                          step={0.01}
                          prefixString="Y "
                          onChange={this._onLayerTransformChange(layer)("scale-y")}
                          onDragStart={this._onLayerTransformDragStart(layer)("scale-y")}
                          onDrag={this._onLayerTransformDrag(layer)("scale-y")}
                          onDragEnd={this._onLayerTransformDragEnd(layer)("scale-y")} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">
                  <FormattedMessage id="views.effect.fix_aspect_ratio"
                                    defaultMessage="Fix Aspect Ratio" />
                </div>
                <div className="effect__input__right">
                  <Checkbox value={this.state.isFixingAspect}
                            onChange={this._onScaleIsFixingAspectChange} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">
                  <FormattedMessage id="views.effect.rotation"
                                    defaultMessage="Rotation" />
                </div>
                <div className="effect__input__right">
                  <Number value={transform.rotation}
                          min={0}
                          max={360}
                          suffixString="°"
                          onChange={this._onLayerTransformChange(layer)("rotation")}
                          onDragStart={this._onLayerTransformDragStart(layer)("rotation")}
                          onDrag={this._onLayerTransformDrag(layer)("rotation")}
                          onDragEnd={this._onLayerTransformDragEnd(layer)("rotation")} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">
                  <FormattedMessage id="views.effect.opacity"
                                    defaultMessage="Opacity" />
                </div>
                <div className="effect__input__right">
                  <Number value={transform.opacity}
                          min={0}
                          max={1}
                          step={0.01}
                          onChange={this._onLayerTransformChange(layer)("opacity")}
                          onDragStart={this._onLayerTransformDragStart(layer)("opacity")}
                          onDrag={this._onLayerTransformDrag(layer)("opacity")}
                          onDragEnd={this._onLayerTransformDragEnd(layer)("opacity")} />
                </div>
              </div>
            </fieldset>

            <fieldset>
              <div className="effect__legend">
                <FormattedMessage id="views.effect.script"
                                  defaultMessage="Script" />
              </div>
              <div className="effect__input">
                <ScriptArea value={layer.scriptString}
                            width="100%"
                            height="250px"
                            theme="monokai"
                            onChange={this._onScriptChange(layer)} />
              </div>
            </fieldset>
          </section>
        );
      }
      else {
        // Composition edit mode
        return (
          <section className="effect panel">
            <fieldset>
              <div className="effect__legend">
                <Text value={comp.name}
                      onChange={this._onCompositionNameChange(comp)} />
              </div>

              <div className="effect__input">
                <div className="effect__input__left">
                  <FormattedMessage id="views.effect.width"
                                    defaultMessage="Width" />
                </div>
                <div className="effect__input__right">
                  <Number value={comp.width}
                          min={1}
                          step={1}
                          suffixString="px"
                          onChange={this._onCompWidthChange(comp)} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">
                  <FormattedMessage id="views.effect.height"
                                    defaultMessage="Height" />
                </div>
                <div className="effect__input__right">
                  <Number value={comp.height}
                          min={1}
                          step={1}
                          suffixString="px"
                          onChange={this._onCompHeightChange(comp)} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">
                  <FormattedMessage id="views.effect.fix_aspect_ratio"
                                    defaultMessage="Fix Aspect Ratio" />
                </div>
                <div className="effect__input__right">
                  <Checkbox value={this.state.isFixingAspect}
                            onChange={this._onScaleIsFixingAspectChange} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">
                  <FormattedMessage id="views.effect.number_of_frames"
                                    defaultMessage="Number of Frames" />
                </div>
                <div className="effect__input__right">
                  <Number value={comp.frame}
                          min={1}
                          step={1}
                          suffixString="frame"
                          onChange={this._onCompFrameChange(comp)} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">
                  <FormattedMessage id="views.effect.frame_rate"
                                    defaultMessage="Frame Rate" />
                </div>
                <div className="effect__input__right">
                  <Number value={comp.fps}
                          min={1}
                          max={30}
                          step={1}
                          suffixString="fps"
                          onChange={this._onCompFPSChange(comp)} />
                </div>
              </div>
            </fieldset>
          </section>
        );
      }
    }
    else {
      // Nothing
      return (
        <section className="effect panel">
        </section>
      );
    }
  },

  _onLayerNameChange(layer) {
    return (value) => {
      layer.name = value;
      layer.update();
    };
  },

  _onCompositionNameChange(composition) {
    return (value) => {
      composition.name = value;
      composition.update();
    };
  },

  _onChangeActiveItemClick(item) {
    return () => {
      Actions.changeSelectingItem(null);
      Actions.changeActiveItem(item);
    };
  },

  _onLayerTransformChange(layer) {
    return this._onLayerTransformDragEnd(layer);
  },

  _onLayerTransformDragStart(layer) {
    return (el) => () => {

      layer.update({
        tmpTransform: layer.transform.clone(),
      }, false);
      this.setState({
        layerTransformDragging: true,
      });
    }
  },

  _onLayerTransformDrag(layer) {
    return (el) => (value) => {
      const tmpTr = layer.tmpTransform;

      if (el === "anchor-point-x") {
        tmpTr.anchorPoint.x = value;
      }
      else if (el === "anchor-point-y") {
        tmpTr.anchorPoint.y = value;
      }
      else if (el === "position-x") {
        tmpTr.position.x = value;
      }
      else if (el === "position-y") {
        tmpTr.position.y = value;
      }
      else if (el === "scale-x") {
        if (this.state.isFixingAspect && tmpTr.scale.x !== 0) {
          tmpTr.scale.y = round(value * layer.transform.scale.y / tmpTr.scale.x, 0.01);
        }
        tmpTr.scale.x = value;
      }
      else if (el === "scale-y") {
        if (this.state.isFixingAspect && tmpTr.scale.y !== 0) {
          tmpTr.scale.x = round(value * layer.transform.scale.x / tmpTr.scale.y, 0.01);
        }
        tmpTr.scale.y = value;
      }
      else if (el === "rotation") {
        tmpTr.rotation = value;
      }
      else if (el === "opacity") {
        tmpTr.opacity = value;
      }

      Actions.updateLayer(layer, false);
    }
  },

  _onLayerTransformDragEnd(layer) {
    return (el) => (value) => {
      const tr = layer.transform;

      if (el === "anchor-point-x") {
        tr.anchorPoint.x = value;
      }
      else if (el === "anchor-point-y") {
        tr.anchorPoint.y = value;
      }
      else if (el === "position-x") {
        tr.position.x = value;
      }
      else if (el === "position-y") {
        tr.position.y = value;
      }
      else if (el === "scale-x") {
        if (this.state.isFixingAspect && tr.scale.x !== 0) {
          tr.scale.y = round(value * tr.scale.y / tr.scale.x, 0.01);
        }
        tr.scale.x = value;
      }
      else if (el === "scale-y") {
        if (this.state.isFixingAspect && tr.scale.y !== 0) {
          tr.scale.x = round(value * tr.scale.x / tr.scale.y, 0.01);
        }
        tr.scale.y = value;
      }
      else if (el === "rotation") {
        tr.rotation = value;
      }
      else if (el === "opacity") {
        tr.opacity = value;
      }
      layer.update({
        tmpTransform: null,
      });
      this.setState({
        layerTransformDragging: false,
      });
    };
  },

  _onScaleIsFixingAspectChange(value) {
    this.setState({
      isFixingAspect: value,
    });
  },

  _onScriptChange(layer) {
    return (value) => {
      layer.scriptString = value;
      layer.update();
    };
  },

  _onCompWidthChange(composition) {
    return (value) => {
      const h = (this.state.isFixingAspect)
        ? Math.round(composition.height * value / composition.width)
        : composition.height;
      composition.update({
        width: value,
        height: h,
      });
    };
  },

  _onCompHeightChange(composition) {
    return (value) => {
      const w = (this.state.isFixingAspect)
        ? Math.round(composition.width * value / composition.height)
        : composition.width;
      composition.update({
        width: w,
        height: value,
      });
    };
  },

  _onCompFrameChange(composition) {
    return (value) => {
      composition.update({
        frame: value,
      });
    };
  },

  _onCompFPSChange(composition) {
    return (value) => {
      composition.update({
        fps: value,
      });
    };
  },
});

export default Effect;
