"use strict";

import React                      from "react";


const WIREFRAME_COLOR = "#4A73F0";

class _WireframeBase extends React.Component {}
_WireframeBase.propTypes = {
  previewScale: React.PropTypes.number.isRequired,
  id: React.PropTypes.string,
};

export class Rect extends _WireframeBase {
  render() {
    const scale = this.props.fixScale
      ? `scale(${1 / this.props.previewScale})`
      : "";
    const strokeWidth = this.props.fixStrokeWidth
      ? this.props.strokeWidth / this.props.previewScale
      : this.props.strokeWidth;

    return (
      <rect {...this.props}
            transform={`${this.props.transform} ${scale}`}
            strokeWidth={strokeWidth} />
    );
  }
}
Rect.propTypes = {
  fixScale: React.PropTypes.bool.isRequired,
  fixStrokeWidth: React.PropTypes.bool.isRequired,
};
Rect.defaultProps = {
  fixScale: false,
  fixStrokeWidth: false,
  transform: "",
  strokeWidth: 0,
};

export class Group extends _WireframeBase {
  render() {
    const scale = this.props.fixScale
      ? `scale(${1 / this.props.previewScale})`
      : "";

    return (
      <g {...this.props}
         transform={`${this.props.transform} ${scale}`}>
        {this.props.children}
      </g>
    );
  }
}
Group.propTypes = {
  fixScale: React.PropTypes.bool.isRequired,
};
Group.defaultProps = {
  fixScale: false,
  transform: "",
};

export class Handle extends Rect {}
Handle.defaultProps = {
  x: -4,
  y: -4,
  width: 8,
  height: 8,
  fill: WIREFRAME_COLOR,
  fixScale: true,
  fixStrokeWidth: false,
};

export class Layer extends _WireframeBase {
  render() {
    return (
      <Group previewScale={this.props.previewScale}>
        <Rect x={this.props.x} y={this.props.y}
              width={this.props.width} height={this.props.height}
              stroke={WIREFRAME_COLOR}
              strokeWidth={2}
              fixStrokeWidth={true}
              previewScale={this.props.previewScale} />
        <Group transform={`translate(${this.props.x} ${this.props.y})`}
               previewScale={this.props.previewScale}>
          <Handle transform={`translate(0 0)`}
                  previewScale={this.props.previewScale} />
          <Handle transform={`translate(${this.props.width} 0)`}
                  previewScale={this.props.previewScale} />
          <Handle transform={`translate(${this.props.width} ${this.props.height})`}
                  previewScale={this.props.previewScale} />
          <Handle transform={`translate(0 ${this.props.height})`}
                  previewScale={this.props.previewScale} />
        </Group>
      </Group>
    )
  }
}
Layer.propTypes = {
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
};

export default {
  Rect: Rect,
  Group: Group,
  Handle: Handle,
  Layer: Layer,
};
