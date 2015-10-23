"use strict";

import React from "react";


var Checkbox = React.createClass({
  propType() {
    return {
      name:     React.PropTypes.string.isRequired,
      label:    React.PropTypes.string,
      value:    React.PropTypes.bool.isRequired,
      onChange: React.PropTypes.func.isRequired,
    };
  },

  render() {
    return (
      <div className="effect__input-container">
        <label className="effect__input-label">
          <span className="effect__input-label__description">{this.props.label}</span>
          <input type="checkbox" className="effect__input-checkbox"
                 name={this.props.name}
                 checked={this.props.value}
                 onChange={this._onChange} />
        </label>
      </div>
    );
  },

  _onChange(e) {
    this.props.onChange(e.target.checked);
  }
});

var Number = React.createClass({
  propTypes() {
    return {
      name:     React.PropTypes.string.isRequired,
      label:    React.PropTypes.string,
      value:    React.PropTypes.number.isRequired,
      min:      React.PropTypes.number,
      max:      React.PropTypes.number,
      step:     React.PropTypes.number,
      onChange: React.PropTypes.func.isRequired,
    };
  },

  getInitialState() {
    return {
      tmpValue: this.props.value,
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      tmpValue: nextProps.value,
    })
  },

  render() {
    return (
      <div className="effect__input-container">
        <label className="effect__input-label">
          <span className="effect__input-label__description">{this.props.label}</span>
          <input type="number" className="effect__input-number"
                 name={this.props.name}
                 value={this.state.tmpValue}
                 min={this.props.min}
                 max={this.props.max}
                 step={this.props.step}
                 onBlur={this._onBlur}
                 onChange={this._onChange} />
        </label>
      </div>
    );
  },

  _onBlur(e) {
    this.setState({
      tmpValue: this.state.tmpValue,
    });
    this.props.onChange(+this.state.tmpValue);
  },

  _onChange(e) {
    this.setState({
      tmpValue: e.target.value,
    });
  }
});

var Range = React.createClass({
  propTypes() {
    return {
      name:     React.PropTypes.string.isRequired,
      label:    React.PropTypes.string,
      value:    React.PropTypes.number.isRequired,
      min:      React.PropTypes.number,
      max:      React.PropTypes.number,
      step:     React.PropTypes.number,
      onChange: React.PropTypes.func.isRequired,
    };
  },

  getInitialState() {
    return {
      tmpValue: this.props.value,
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      tmpValue: nextProps.value,
    })
  },

  render() {
    return (
      <div className="effect__input-container">
        <label className="effect__input-label">
          <span className="effect__input-label__description">{this.props.label}</span>
          <input type="range" className="effect__input-range"
                 name={this.props.name}
                 value={this.state.tmpValue}
                 min={this.props.min}
                 max={this.props.max}
                 step={this.props.step}
                 onChange={this._onChange}
                 onInput={this._onInput} />
        </label>
      </div>
    );
  },

  _onChange(e) {
    this.setState({
      tmpValue: e.target.value,
    });
    this.props.onChange(+e.target.value);
  },

  _onInput(e) {
    this.setState({
      tmpValue: e.target.value,
    });
  }
});

export default {
  Checkbox: Checkbox,
  Number: Number,
  Range: Range,
}
