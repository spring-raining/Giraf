"use strict";

import React                              from "react";

import {Number, Checkbox, ScriptArea}     from "src/views/forms";


var Effect = React.createClass({
  getInitialState() {
    return {
      isFixingAspect: true,
    };
  },

  render() {
    let comp  = this.props.store.get("editingComposition");
    let layer = this.props.store.get("editingLayer");

    // Layer edit mode
    if (comp && layer) {
      return (
        <section className="effect panel">

          <fieldset>
            <div className="effect__legend">{layer.name}</div>
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
                        onChange={this._onAnchorPointXChanged} />
                <Number value={layer.transform.anchorPoint.y}
                        prefixString="Y "
                        onChange={this._onAnchorPointYChanged} />
              </div>
            </div>

            <div className="effect__input">
              <div className="effect__input__left">位置</div>

              <div className="effect__input__right">
                <Number value={layer.transform.position.x}
                        prefixString="X "
                        onChange={this._onPositionXChanged} />
                <Number value={layer.transform.position.y}
                        prefixString="Y "
                        onChange={this._onPositionYChanged} />
              </div>
            </div>
            <div className="effect__input">
              <div className="effect__input__left">大きさ</div>
              <div className="effect__input__right">
                <Number value={layer.transform.scale.x}
                        step={0.01}
                        prefixString="X "
                        onChange={this._onScaleXChanged} />
                <Number value={layer.transform.scale.y}
                        step={0.01}
                        prefixString="Y "
                        onChange={this._onScaleYChanged} />
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
                        onChange={this._onRotationChanged} />
              </div>
            </div>
            <div className="effect__input">
              <div className="effect__input__left">透明度</div>
              <div className="effect__input__right">
                <Number value={layer.transform.opacity}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={this._onOpacityChanged} />
              </div>
            </div>
            <div className="effect__input">
              <div className="effect__input__left">効果</div>
              <div className="effect__input__right">
                <ScriptArea value={layer.scriptString}
                            rows={10}
                            onChange={this._onScriptChanged} />
              </div>
            </div>
          </fieldset>
        </section>
      );
    }
    // Composition edit mode
    else if (comp && !layer) {
      return (
        <section className="effect panel">
          <h4>{comp.name}</h4>
        </section>
      );
    }
    // Nothing
    else {
      return (
        <section className="effect panel">
        </section>
      );
    }
  },

  _onAnchorPointXChanged(value) {
    let layer = this.props.store.get("editingLayer");
    layer.transform.anchorPoint.x = value;
    layer.update();
  },

  _onAnchorPointYChanged(value) {
    let layer = this.props.store.get("editingLayer");
    layer.transform.anchorPoint.y = value;
    layer.update();
  },

  _onPositionXChanged(value) {
    let layer = this.props.store.get("editingLayer");
    layer.transform.position.x = value;
    layer.update();
  },

  _onPositionYChanged(value) {
    let layer = this.props.store.get("editingLayer");
    layer.transform.position.y = value;
    layer.update();
  },

  _onScaleXChanged(value) {
    let layer = this.props.store.get("editingLayer");
    let scale = layer.transform.scale;

    if (this.state.isFixingAspect && scale.x !== 0) {
      layer.transform.scale.y = Math.round(100 * value * scale.y / scale.x) / 100;
    }
    layer.transform.scale.x = value;
    layer.update();
  },

  _onScaleYChanged(value) {
    let layer = this.props.store.get("editingLayer");
    let scale = layer.transform.scale;

    if (this.state.isFixingAspect && scale.y !== 0) {
      layer.transform.scale.x = Math.round(100 * value * scale.x / scale.y) / 100;
    }
    layer.transform.scale.y = value;
    layer.update();
  },

  _onScaleIsFixingAspectChanged(value) {
    this.setState({
      isFixingAspect: value,
    });
  },

  _onRotationChanged(value) {
    let layer = this.props.store.get("editingLayer");
    layer.transform.rotation = value;
    layer.update();
  },

  _onOpacityChanged(value) {
    let layer = this.props.store.get("editingLayer");
    layer.transform.opacity = value;
    layer.update();
  },


  _onScriptChanged(value) {
    let layer = this.props.store.get("editingLayer");
    layer.scriptString = value;
    layer.update();
  },
});

export default Effect;
