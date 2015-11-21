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
          <h4 className="effect__header">{layer.name}</h4>

          <fieldset>
            <legend>アンカーポイント</legend>
            <label>
              <span>X</span>
              <Number value={layer.transform.anchorPoint.x}
                      onChange={this._onAnchorPointXChanged} />
            </label>
            <label>
              <span>Y</span>
              <Number value={layer.transform.anchorPoint.y}
                      onChange={this._onAnchorPointYChanged} />
            </label>
          </fieldset>
          <fieldset>
            <legend>位置</legend>
            <label>
              <span>X</span>
              <Number value={layer.transform.position.x}
                      onChange={this._onPositionXChanged} />
            </label>
            <label>
              <span>Y</span>
              <Number value={layer.transform.position.y}
                      onChange={this._onPositionYChanged} />
            </label>
          </fieldset>
          <fieldset>
            <legend>大きさ</legend>
            <label>
              <span>X</span>
              <Number value={layer.transform.scale.x}
                      step="0.01"
                      onChange={this._onScaleXChanged} />
            </label>
            <label>
              <span>Y</span>
              <Number value={layer.transform.scale.y}
                      step="0.01"
                      onChange={this._onScaleYChanged} />
            </label>
            <label>
              <span>縦横比を固定</span>
              <Checkbox value={this.state.isFixingAspect}
                        onChange={this._onScaleIsFixingAspectChanged} />
            </label>
          </fieldset>
          <fieldset>
            <legend>回転</legend>
            <Number value={layer.transform.rotation}
                    min="0"
                    max="360"
                    onChange={this._onRotationChanged} />
          </fieldset>
          <fieldset>
            <legend>透明度</legend>
            <Number value={layer.transform.opacity}
                    min="0"
                    max="1"
                    step="0.01"
                    onChange={this._onOpacityChanged} />
          </fieldset>
          <fieldset>
            <legend>効果</legend>
            <ScriptArea value={layer.scriptString}
                        rows="10"
                        onChange={this._onScriptChanged} />
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
