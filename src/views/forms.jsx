"use strict";

import React from "react";


const NativeCheckbox = React.createClass({
  propType() {
    return {
      value:    React.PropTypes.bool.isRequired,
    };
  },

  render() {
    return (
      <input {...this.props}
             type="checkbox"
             className="form-native-checkbox"
             checked={this.props.value} />
    );
  },
});

const NativeNumber = React.createClass({
  propTypes() {
    return {
      value: React.PropTypes.number.isRequired,
    };
  },

  render() {
    return (
      <input {...this.props}
             type="number"
             className="form-native-number" />
    );
  },
});

const NativeSelect = React.createClass({
  propTypes() {
    return {
      value:        React.PropTypes.any.isRequired,
    };
  },

  render() {
    return (
      <select {...this.props}
              className="form-native-select">
        {this.props.children}
      </select>
    );
  },
});

const NativeOption = React.createClass({
  propTypes() {
    return {
      value: React.PropTypes.any.isRequired,
    };
  },

  render() {
    return (
      <option {...this.props}
              className="form-native-option">
        {this.props.children}
      </option>
    );
  }
});

const NativeRange = React.createClass({
  propTypes() {
    return {
      value:    React.PropTypes.number.isRequired,
    };
  },

  render() {
    return (
      <input {...this.props}
              type="range"
              className="effect-native-range" />
    );
  },
});

const Checkbox = React.createClass({
  propType() {
    return {
      value:    React.PropTypes.bool.isRequired,
      name:     React.PropTypes.string,
      onChange: React.PropTypes.func,
    };
  },

  render() {
    return (
      <div className="form-checkbox">
        <NativeCheckbox value={this.props.value}
                        name={this.props.name}
                        onChange={this._onChange} />
      </div>
    );
  },

  _onChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e.target.checked);
    }
  },
});

const Number = React.createClass({
  propTypes() {
    return {
      value:        React.PropTypes.number.isRequired,
      name:         React.PropTypes.string,
      min:          React.PropTypes.number,
      max:          React.PropTypes.number,
      step:         React.PropTypes.number,
      onChange:     React.PropTypes.func,
      prefixString: React.PropTypes.string,
      suffixString: React.PropTypes.string,
    };
  },

  getInitialState() {
    return {
      tmpValue: this.props.value,
      isEditing: false,
    };
  },

  render() {
    const input = (this.state.isEditing)
      ? <div className="form-number__focus">
          <NativeNumber value={this.state.tmpValue}
                        name={this.props.name}
                        min={this.props.min}
                        max={this.props.max}
                        step={this.props.step}
                        autoFocus={true}
                        onChange={this._onChange}
                        onBlur={this._onBlur} />
        </div>
      : <div className="form-number__unfocus"
              onClick={this._onUnfocusBoxClicked}>
          {this.props.value}
        </div>;

    const prefix = (this.props.prefixString)
      ? <span className="form-number__prefix">{this.props.prefixString}</span>
      : null;

    const suffix = (this.props.suffixString)
      ? <span className="form-number__suffix">{this.props.suffixString}</span>
      : null;

    return (
      <div className="form-number">
        {prefix}
        {input}
        {suffix}
      </div>
    );
  },

  _onChange(e) {
    this.setState({
      tmpValue: e.target.value,
    });
  },

  _onBlur(e) {
    let val = +e.target.value;
    if (typeof(this.props.min) === "number") {
      val = Math.max(val, this.props.min);
    }
    if (typeof(this.props.max) === "number") {
      val = Math.min(val, this.props.max);
    }

    this.setState({
      tmpValue: this.props.value,
      isEditing: false,
    });
    if (this.props.onChange) {
      this.props.onChange(val);
    }
  },

  _onUnfocusBoxClicked() {
    this.setState({
      tmpValue: this.props.value,
      isEditing: true,
    });
  },
});

const Select = React.createClass({
  propTypes() {
    return {
      value:        React.PropTypes.any.isRequired,
      options:      React.PropTypes.array.isRequired,
      name:         React.PropTypes.string,
      optionNames:  React.PropTypes.array,
      onChange:     React.PropTypes.func,
    };
  },

  render() {
    const options = this.props.options.map((opt, i) => {
      const name = (this.props.optionNames)? this.props.optionNames[i] : opt;
      return (
        <NativeOption value={opt} key={i}>
          {name}
        </NativeOption>
      );
    });

    return (
      <div className="form-select">
        <NativeSelect value={this.props.value}
                      name={this.props.name}
                      onChange={this._onChange}>
          {options}
        </NativeSelect>
      </div>
    )
  },

  _onChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  },
});

const ScriptArea = React.createClass({
  propTypes() {
    return {
      value:    React.PropTypes.string.isRequired,
      name:    React.PropTypes.string,
      cols:     React.PropTypes.number,
      rows:     React.PropTypes.number,
      onChange: React.PropTypes.func,
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
      <textarea className="form-script-area"
                name={this.props.name}
                value={this.state.tmpValue}
                cols={this.props.cols}
                rows={this.props.rows}
                onBlur={this._onBlur}
                onChange={this._onChange} />
    );
  },

  _onBlur(e) {
    this.setState({
      tmpValue: e.target.value,
    });
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  },

  _onChange(e) {
    this.setState({
      tmpValue: e.target.value,
    });
  },
});

export default {
  NativeCheckbox: NativeCheckbox,
  NativeNumber: NativeNumber,
  NativeSelect: NativeSelect,
  NativeOption: NativeOption,
  NativeRange: NativeRange,
  Checkbox: Checkbox,
  Number: Number,
  Select: Select,
  ScriptArea: ScriptArea,
}
