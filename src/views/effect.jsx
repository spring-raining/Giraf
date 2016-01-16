"use strict";

import React                              from "react";

import Actions                            from "src/actions/actions";
import Store                              from "src/stores/store";
import {Composition}                      from "src/stores/model/composition";
import {Layer}                            from "src/stores/model/layer";
import {Number, Checkbox, ScriptArea, Text}
                                          from "src/views/forms";


var Effect = React.createClass({
  getInitialState() {
    return {
      isFixingAspect: true,
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
        const source = (layer.entity)
          ? <div className="effect__input">
              <div className="effect__input__left">ソース名</div>
              <div className="effect__input__right">
                <div>
                  <div>{layer.entity.name}</div>
                  <a onClick={this._onChangeActiveItemClicked(layer.entity)}>
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
                      onChange={this._onLayerNameChanged(layer)} />
              </div>

              {source}
            </fieldset>

            <fieldset>
              <div className="effect__legend">トランスフォーム</div>
              <div className="effect__input">
                <div className="effect__input__left">
                  アンカーポイント
                </div>
                <div className="effect__input__right">
                  <Number value={layer.transform.anchorPoint.x}
                          prefixString="X "
                          onChange={this._onAnchorPointXChanged(layer)} />
                  <Number value={layer.transform.anchorPoint.y}
                          prefixString="Y "
                          onChange={this._onAnchorPointYChanged(layer)} />
                </div>
              </div>

              <div className="effect__input">
                <div className="effect__input__left">位置</div>

                <div className="effect__input__right">
                  <Number value={layer.transform.position.x}
                          prefixString="X "
                          onChange={this._onPositionXChanged(layer)} />
                  <Number value={layer.transform.position.y}
                          prefixString="Y "
                          onChange={this._onPositionYChanged(layer)} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">大きさ</div>
                <div className="effect__input__right">
                  <Number value={layer.transform.scale.x}
                          step={0.01}
                          prefixString="X "
                          onChange={this._onScaleXChanged(layer)} />
                  <Number value={layer.transform.scale.y}
                          step={0.01}
                          prefixString="Y "
                          onChange={this._onScaleYChanged(layer)} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">縦横比を固定</div>
                <div className="effect__input__right">
                  <Checkbox value={this.state.isFixingAspect}
                            onChange={this._onScaleIsFixingAspectChanged} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">回転</div>
                <div className="effect__input__right">
                  <Number value={layer.transform.rotation}
                          min={0}
                          max={360}
                          suffixString="°"
                          onChange={this._onRotationChanged(layer)} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">透明度</div>
                <div className="effect__input__right">
                  <Number value={layer.transform.opacity}
                          min={0}
                          max={1}
                          step={0.01}
                          onChange={this._onOpacityChanged(layer)} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">効果</div>
                <div className="effect__input__right">
                  <ScriptArea value={layer.scriptString}
                              rows={10}
                              onChange={this._onScriptChanged(layer)} />
                </div>
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
                      onChange={this._onCompositionNameChanged(comp)} />
              </div>

              <div className="effect__input">
                <div className="effect__input__left">幅</div>
                <div className="effect__input__right">
                  <Number value={comp.width}
                          min={1}
                          step={1}
                          suffixString="px"
                          onChange={this._onCompWidthChanged(comp)} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">高さ</div>
                <div className="effect__input__right">
                  <Number value={comp.height}
                          min={1}
                          step={1}
                          suffixString="px"
                          onChange={this._onCompHeightChanged(comp)} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">縦横比を固定</div>
                <div className="effect__input__right">
                  <Checkbox value={this.state.isFixingAspect}
                            onChange={this._onScaleIsFixingAspectChanged} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">フレーム数</div>
                <div className="effect__input__right">
                  <Number value={comp.frame}
                          min={1}
                          step={1}
                          suffixString="frame"
                          onChange={this._onCompFrameChanged(comp)} />
                </div>
              </div>
              <div className="effect__input">
                <div className="effect__input__left">フレームレート</div>
                <div className="effect__input__right">
                  <Number value={comp.fps}
                          min={1}
                          max={30}
                          step={1}
                          suffixString="fps"
                          onChange={this._onCompFPSChanged(comp)} />
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

  _onLayerNameChanged(layer) {
    return (value) => {
      layer.name = value;
      layer.update();
    };
  },

  _onCompositionNameChanged(composition) {
    return (value) => {
      composition.name = value;
      composition.update();
    };
  },

  _onChangeActiveItemClicked(item) {
    return () => {
      Actions.changeSelectingItem(null);
      Actions.changeActiveItem(item);
    };
  },

  _onAnchorPointXChanged(layer) {
    return (value) => {
      layer.transform.anchorPoint.x = value;
      layer.update();
    };
  },

  _onAnchorPointYChanged(layer) {
    return (value) => {
      layer.transform.anchorPoint.y = value;
      layer.update();
    };
  },

  _onPositionXChanged(layer) {
    return (value) => {
      layer.transform.position.x = value;
      layer.update();
    };
  },

  _onPositionYChanged(layer) {
    return (value) => {
      layer.transform.position.y = value;
      layer.update();
    };
  },

  _onScaleXChanged(layer) {
    return (value) => {
      let scale = layer.transform.scale;

      if (this.state.isFixingAspect && scale.x !== 0) {
        layer.transform.scale.y = Math.round(100 * value * scale.y / scale.x) / 100;
      }
      layer.transform.scale.x = value;
      layer.update();
    };
  },

  _onScaleYChanged(layer) {
    return (value) => {
      let scale = layer.transform.scale;

      if (this.state.isFixingAspect && scale.y !== 0) {
        layer.transform.scale.x = Math.round(100 * value * scale.x / scale.y) / 100;
      }
      layer.transform.scale.y = value;
      layer.update();
    };
  },

  _onScaleIsFixingAspectChanged(value) {
    this.setState({
      isFixingAspect: value,
    });
  },

  _onRotationChanged(layer) {
    return (value) => {
      layer.transform.rotation = value;
      layer.update();
    };
  },

  _onOpacityChanged(layer) {
    return (value) => {
      layer.transform.opacity = value;
      layer.update();
    };
  },


  _onScriptChanged(layer) {
    return (value) => {
      layer.scriptString = value;
      layer.update();
    };
  },

  _onCompWidthChanged(composition) {
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

  _onCompHeightChanged(composition) {
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

  _onCompFrameChanged(composition) {
    return (value) => {
      composition.update({
        frame: value,
      });
    };
  },

  _onCompFPSChanged(composition) {
    return (value) => {
      composition.update({
        fps: value,
      });
    };
  },
});

export default Effect;
