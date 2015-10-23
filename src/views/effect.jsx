"use strict";

import React                              from "react";

import {Checkbox, Number, Range}          from "src/views/effect/modules";


var Effect = React.createClass({
  getInitialState() {
    return {
      isFixingAspect: true,
    };
  },

  render() {
    let comp  = this.props.store.editingComposition;
    let layer = this.props.store.editingLayer;

    // Layer edit mode
    if (comp && layer) {
      return (
        <section className="effect panel">
          <h4 className="effect__header">{layer.name}</h4>

          <fieldset>
            <legend>アンカーポイント</legend>
            <Number name="anchor-point-x" label="X"
                    value={layer.transform.anchorPoint.x}
                    onChange={this._onAnchorPointXChanged} />
            <Number name="anchor-point-y" label="Y"
                    value={layer.transform.anchorPoint.y}
                    onChange={this._onAnchorPointYChanged} />
          </fieldset>
          <fieldset>
            <legend>位置</legend>
            <Number name="position-x" label="X"
                    value={layer.transform.position.x}
                    onChange={this._onPositionXChanged} />
            <Number name="position-y" label="Y"
                    value={layer.transform.position.y}
                    onChange={this._onPositionYChanged} />
          </fieldset>
          <fieldset>
            <legend>大きさ</legend>
            <Number name="scale-x" label="X"
                    value={layer.transform.scale.x}
                    step="0.01"
                    onChange={this._onScaleXChanged} />
            <Number name="scale-y" label="Y"
                    value={layer.transform.scale.y}
                    step="0.01"
                    onChange={this._onScaleYChanged} />
            <Checkbox name="scale-is-fixing-aspect" label="縦横比を固定"
                      value={this.state.isFixingAspect}
                      onChange={this._onScaleIsFixingAspectChanged} />
          </fieldset>
          <fieldset>
            <legend>回転</legend>
            <Range name="rotation"
                   value={layer.transform.rotation}
                   min="0"
                   max="360"
                   onChange={this._onRotationChanged} />
          </fieldset>
          <fieldset>
            <legend>透明度</legend>
            <Range name="opacity"
                   value={layer.transform.opacity}
                   min="0"
                   max="1"
                   step="0.01"
                   onChange={this._onOpacityChanged} />
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
    let layer = this.props.store.editingLayer;
    layer.transform.anchorPoint.x = value;
    layer.update({
      transform: layer.transform,
    });
  },

  _onAnchorPointYChanged(value) {
    let layer = this.props.store.editingLayer;
    layer.transform.anchorPoint.y = value;
    layer.update({
      transform: layer.transform,
    });
  },

  _onPositionXChanged(value) {
    let layer = this.props.store.editingLayer;
    layer.transform.position.x = value;
    layer.update({
      transform: layer.transform,
    });
  },

  _onPositionYChanged(value) {
    let layer = this.props.store.editingLayer;
    layer.transform.position.y = value;
    layer.update({
      transform: layer.transform,
    });
  },

  _onScaleXChanged(value) {
    let layer = this.props.store.editingLayer;
    let scale = layer.transform.scale;

    if (this.state.isFixingAspect && scale.x !== 0) {
      layer.transform.scale.y = Math.round(100 * value * scale.y / scale.x) / 100;
    }
    layer.transform.scale.x = value;
    layer.update({
      transform: layer.transform,
    });
  },

  _onScaleYChanged(value) {
    let layer = this.props.store.editingLayer;
    let scale = layer.transform.scale;

    if (this.state.isFixingAspect && scale.y !== 0) {
      layer.transform.scale.x = Math.round(100 * value * scale.x / scale.y) / 100;
    }
    layer.transform.scale.y = value;
    layer.update({
      transform: layer.transform,
    });
  },

  _onScaleIsFixingAspectChanged(value) {
    this.setState({
      isFixingAspect: value,
    });
  },

  _onRotationChanged(value) {
    let layer = this.props.store.editingLayer;
    layer.transform.rotation = value;
    layer.update({
      transform: layer.transform,
    });
  },

  _onOpacityChanged(value) {
    let layer = this.props.store.editingLayer;
    layer.transform.opacity = value;
    layer.update({
      transform: layer.transform,
    });
  },
});

export default Effect;
