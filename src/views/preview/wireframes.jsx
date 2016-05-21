"use strict";

import React                      from "react";
import _Lang                      from "lodash/lang";


class _WireframeBase extends React.Component {}
_WireframeBase.propTypes = {
  className: React.PropTypes.string.isRequired,
  previewScale: React.PropTypes.number.isRequired,
  id: React.PropTypes.string,
};
_WireframeBase.defaultProps = {
  className: "",
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

export class Circle extends _WireframeBase {
  render() {
    const scale = this.props.fixScale
      ? `scale(${1 / this.props.previewScale})`
      : "";
    const strokeWidth = this.props.fixStrokeWidth
      ? this.props.strokeWidth / this.props.previewScale
      : this.props.strokeWidth;

    return (
      <circle {...this.props}
              transform={`${this.props.transform} ${scale}`}
              strokeWidth={strokeWidth}/>
    );
  }
}
Circle.propTypes = {
  fixScale: React.PropTypes.bool.isRequired,
  fixStrokeWidth: React.PropTypes.bool.isRequired,
};
Circle.defaultProps = {
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

export class Corner extends Rect {
  render() {
    return (
      <Rect {...this.props}
            className={`wireframe__corner wireframe-fill ${this.props.className}`} />
    );
  }
}
Corner.defaultProps = {
  x: -4,
  y: -4,
  width: 8,
  height: 8,
  fixScale: true,
  fixStrokeWidth: false,
};

export class Handle extends _WireframeBase {
  render() {
    const circle = (this.props.r)
      ? <Group className="wireframe__handle__circle"
               onMouseDown={this.props.onCircleMouseDown}
               previewScale={this.props.previewScale}>
          <Circle className="wireframe__handle__circle__skeleton wireframe-stroke"
                  cx={0} cy={0} r={this.props.r}
                  fill="none"
                  strokeWidth={1}
                  fixStrokeWidth={true}
                  previewScale={this.props.previewScale} />
          <Circle className="wireframe__handle__circle__hover"
                  cx={0} cy={0} r={this.props.r}
                  fill="none"
                  stroke="none"
                  strokeWidth={6}
                  fixStrokeWidth={true}
                  previewScale={this.props.previewScale} />
        </Group>
      : null;

    return (
      <Group className={`wireframe__handle ${this.props.className}`}
             transform={`translate(${this.props.x} ${this.props.y})`}
             previewScale={this.props.previewScale}>
        {circle}
        <Group className="wireframe__handle__anchor"
               fixScale={true}
               onMouseDown={this.props.onAnchorMouseDown}
               previewScale={this.props.previewScale}>
          <Circle className="wireframe__handle__anchor__skeleton wireframe-stroke"
                  cx={0} cy={0} r={4}
                  fill="none"
                  strokeWidth={2}
                  previewScale={this.props.previewScale} />
          <path className="wireframe__handle__anchor__skeleton wireframe-stroke"
                d="M 2 0 h 5 M 0 2 v 5 M -2 0 h -5 M 0 -2 v -5"
                fill="none"
                strokeWidth={2} />
          <Rect className="wireframe__handle__anchor__hover"
                x={-7} y={-7} width={14} height={14}
                fill="none"
                stroke="none"
                previewScale={this.props.previewScale}/>
        </Group>
      </Group>
    );
  }
}
Handle.propTypes = {
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
  r: React.PropTypes.number,
  onCircleMouseDown: React.PropTypes.func,
  onAnchorMouseDown: React.PropTypes.func,
};

export class Layer extends _WireframeBase {
  constructor(props) {
    super(props);
    this.state = {
      mouseMoveEvent: null,
      mouseUpEvent: null,
    };
  }

  render() {
    const handle = (this.props.handle)
      ? <Handle className="wireframe__layer__handle"
                x={this.props.handle.x}
                y={this.props.handle.y}
                r={this.props.handle.r}
                onCircleMouseDown={this._onMouseDown("handle-circle").bind(this)}
                onAnchorMouseDown={this._onMouseDown("handle-anchor").bind(this)}
                previewScale={this.props.previewScale} />
      : null;
    const transform = (this.props.handle)
      ? `rotate(${this.props.rotation} ${this.props.handle.x} ${this.props.handle.y})`
      : "";

    return (
      <Group className={`wireframe__layer ${this.props.className}`}
             transform={transform}
             onClick={this.props.onClick}
             previewScale={this.props.previewScale}>
        <Rect className="wireframe__layer__rect wireframe-stroke"
              x={this.props.x} y={this.props.y}
              width={Math.abs(this.props.width)} height={Math.abs(this.props.height)}
              transform={`translate(${Math.min(0, this.props.width)} ${Math.min(0, this.props.height)})`}
              fill="none"
              strokeWidth={1}
              strokeDasharray="2"
              fixStrokeWidth={true}
              onMouseDown={this._onMouseDown("rect").bind(this)}
              previewScale={this.props.previewScale} />
        {handle}
        <Group className="wireframe__layer__corner"
               transform={`translate(${this.props.x} ${this.props.y})`}
               previewScale={this.props.previewScale}>
          <Corner className="wireframe__layer__corner-nw"
                  transform={`translate(0 0)`}
                  onMouseDown={this._onMouseDown("corner-nw").bind(this)}
                  previewScale={this.props.previewScale} />
          <Corner className="wireframe__layer__corner-n"
                  transform={`translate(${this.props.width / 2} 0)`}
                  onMouseDown={this._onMouseDown("corner-n").bind(this)}
                  previewScale={this.props.previewScale} />
          <Corner className="wireframe__layer__corner-ne"
                  transform={`translate(${this.props.width} 0)`}
                  onMouseDown={this._onMouseDown("corner-ne").bind(this)}
                  previewScale={this.props.previewScale} />
          <Corner className="wireframe__layer__corner-e"
                  transform={`translate(${this.props.width} ${this.props.height / 2})`}
                  onMouseDown={this._onMouseDown("corner-e").bind(this)}
                  previewScale={this.props.previewScale} />
          <Corner className="wireframe__layer__corner-se"
                  transform={`translate(${this.props.width} ${this.props.height})`}
                  onMouseDown={this._onMouseDown("corner-se").bind(this)}
                  previewScale={this.props.previewScale} />
          <Corner className="wireframe__layer__corner-s"
                  transform={`translate(${this.props.width / 2} ${this.props.height})`}
                  onMouseDown={this._onMouseDown("corner-s").bind(this)}
                  previewScale={this.props.previewScale} />
          <Corner className="wireframe__layer__corner-sw"
                  transform={`translate(0 ${this.props.height})`}
                  onMouseDown={this._onMouseDown("corner-sw").bind(this)}
                  previewScale={this.props.previewScale} />
          <Corner className="wireframe__layer__corner-w"
                  transform={`translate(0 ${this.props.height / 2})`}
                  onMouseDown={this._onMouseDown("corner-w").bind(this)}
                  previewScale={this.props.previewScale} />
        </Group>
      </Group>
    );
  }

  _onMouseDown(el) {
    return (e) => {
      const mouseMoveEvent = this._onMouseMove(el).bind(this);
      const mouseUpEvent = this._onMouseUp(el).bind(this);

      document.body.addEventListener("mousemove", mouseMoveEvent);
      document.body.addEventListener("mouseup", mouseUpEvent);
      this.setState({
        mouseMoveEvent: mouseMoveEvent,
        mouseUpEvent: mouseUpEvent,
      });
    };
  }

  _onMouseMove(el) {
    return (e) => {
      if (e.buttons % 2 === 1) { // left button
        this.props.onDrag(el)(e);
      }
      else {
        this._onMouseUp(el).bind(this)();
      }
    };
  }

  _onMouseUp(el) {
    return () => {
      document.body.removeEventListener("mousemove", this.state.mouseMoveEvent);
      document.body.removeEventListener("mouseup", this.state.mouseUpEvent);
      this.setState({
        mouseMoveEvent: null,
        mouseUpEvent: null,
      });
    };
  }
}
Layer.propTypes = {
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
  width: React.PropTypes.number.isRequired,
  height: React.PropTypes.number.isRequired,
  rotation: React.PropTypes.number.isRequired,
  handle: React.PropTypes.shape({
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    r: React.PropTypes.number,
  }),
  onDrag: React.PropTypes.func,
  onClick: React.PropTypes.func,
};
Layer.defaultProps = {
  rotation: 0,
  handle: null,
};

export default {
  Rect: Rect,
  Group: Group,
  Corner: Corner,
  Handle: Handle,
  Layer: Layer,
};
