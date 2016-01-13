"use strict";

import React                      from "react";
import Decimal                    from "decimal.js";
import UAParser                   from "ua-parser-js";
import _Lang                      from "lodash/lang";

import genDummyImg                from "src/utils/genDummyImg";


const userAgent = new UAParser();

const NativeCheckbox = React.createClass({
  propType() {
    return {
      value: React.PropTypes.bool.isRequired,
    };
  },

  render() {
    return (
      <input {...this.props}
             type="checkbox"
             className="form-native form-native-checkbox"
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
             className="form-native form-native-number" />
    );
  },
});

const NativeSelect = React.createClass({
  propTypes() {
    return {
      value: React.PropTypes.any.isRequired,
    };
  },

  render() {
    return (
      <select {...this.props}
              className="form-native form-native-select">
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
              className="form-native form-native-option">
        {this.props.children}
      </option>
    );
  }
});

const NativeRange = React.createClass({
  propTypes() {
    return {
      value: React.PropTypes.number.isRequired,
    };
  },

  render() {
    return (
      <input {...this.props}
              type="range"
              className="form-native form-native-range" />
    );
  },
});

const NativeText = React.createClass({
  propTypes() {
    return {
      value: React.PropTypes.string.isRequired,
    };
  },

  render() {
    return (
      <input {...this.props}
             type="text"
             className="form-native form-native-text" />
    );
  }
});

const NativeTextarea = React.createClass({
  propTypes() {
    return {
      value: React.PropTypes.string.isRequired,
    };
  },

  render() {
    return (
      <textarea {...this.props}
                className="form-native form-native-textarea" />
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
      <div className="form form-checkbox">
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
      draggingClientX: null,
    };
  },

  render() {
    const prefix = (_Lang.isString(this.props.prefixString)
                 && this.props.prefixString.length > 0)
      ? <span className="form-number__prefix">
          {this.props.prefixString}
        </span>
      : null;

    const suffix = (_Lang.isString(this.props.suffixString)
                 && this.props.suffixString.length > 0)
      ? <span className="form-number__suffix">
          {this.props.suffixString}
        </span>
      : null;

    const unfocusValue = (this.state.draggingClientX !== null)
      ? this.state.tmpValue
      : this.props.value;

    const input = (this.state.isEditing)
      ? <div className="form-number__focus">
          {prefix}
            <NativeNumber value={this.state.tmpValue}
                          name={this.props.name}
                          min={this.props.min}
                          max={this.props.max}
                          step={this.props.step}
                          autoFocus={true}
                          onChange={this._onChange}
                          onKeyDown={this._onKeyDown}
                          onBlur={this._onBlur} />
          {suffix}
        </div>
      : <div className="form-number__unfocus"
             draggable="true"
             onDragStart={this._onDragStart}
             onDrag={this._onDrag}
             onDragEnd={this._onDragEnd}
             onClick={this._onUnfocusBoxClicked}>
          {prefix}
          <span className="form-number__unfocus__value">
            {unfocusValue}
          </span>
          {suffix}
          <input type="number"
                 className="form-number__unfocus__dummy-input"
                 onFocus={this._onDummyFocus}/>
        </div>;

    return (
      <div className="form form-number">
        {input}
      </div>
    );
  },

  _onChange(e) {
    this.setState({
      tmpValue: e.target.value,
    });
  },

  _isEditingOnFirefox: false,
  _dragEndOnFirefox: false,
  _editCanceled: false,

  _onKeyDown(e) {
    if (e.keyCode === 13) {   // Enter
      e.preventDefault();
      e.target.blur();
    }
    if (e.keyCode === 27) {   // Esc
      this._editCanceled = true;
      e.preventDefault();
      e.target.blur();
    }
  },

  _onBlur(e) {
    if (userAgent.getBrowser().name === "Firefox") {
      if (this._isEditingOnFirefox) {
        this._isEditingOnFirefox = false;
      }
      else {
        this._isEditingOnFirefox = true;
        return;
      }
    }

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

    if (this._editCanceled) {
      this._editCanceled = false;
    }
    else if (this.props.onChange) {
      this.props.onChange(val);
    }
  },

  _onUnfocusBoxClicked() {
    if (userAgent.getBrowser().name === "Firefox") {
      if (this._dragEndOnFirefox) {
        this._dragEndOnFirefox = false;
        return;
      }
    }

    this.setState({
      tmpValue: this.props.value,
      isEditing: true,
    });
  },

  _onDummyFocus() {
    this._onUnfocusBoxClicked();
  },

  _onDragStart(e) {
    e.stopPropagation();

    // On Firefox, 'onDrag' and 'onDragEnd' won't fire.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=505521
    if (userAgent.getBrowser().name === "Firefox") {
      e.target.setCapture();
      e.target.addEventListener("mousemove", this._onDrag, false);
      e.target.addEventListener("mouseup", this._onDragEnd, false);
    }

    e.dataTransfer.setDragImage(genDummyImg(), 0, 0);
    this.setState({
      draggingClientX: e.clientX,
    });
  },

  _onDrag(e) {
    e.stopPropagation();
    // HACK: It sometimes fire event e.clientX is zero when mouse up.
    if (e.clientX === 0) {
      return;
    }

    const unit = 2;
    const diff = Math.floor(Math.abs(e.clientX - this.state.draggingClientX) / unit)
                 * ((e.clientX > this.state.draggingClientX)? 1 : -1);
    const step = (this.props.step)? this.props.step : 1;

    let result = new Decimal(diff).times(step)
                                  .plus(this.state.tmpValue)
                                  .toNumber();
    if (typeof(this.props.min) === "number") {
      result = Math.max(result, this.props.min);
    }
    if (typeof(this.props.max) === "number") {
      result = Math.min(result, this.props.max);
    }

    this.setState({
      tmpValue: result,
      draggingClientX: this.state.draggingClientX + diff * unit,
    });
  },

  _onDragEnd(e) {
    e.stopPropagation();

    if (userAgent.getBrowser().name === "Firefox") {
      this._dragEndOnFirefox = true;
      e.target.removeEventListener("mousemove", this._onDrag, false);
      e.target.removeEventListener("mouseup", this._onDragEnd, false);
    }

    this.setState({
      draggingClientX: null,
    });
    if (this.props.onChange && this.props.value !== this.state.tmpValue) {
      this.props.onChange(this.state.tmpValue);
    }
  },
});

const Progress = React.createClass({
  propTypes() {
    return {
      value:  React.PropTyeps.number.isRequired,
      max:    React.PropTypes.number,
    };
  },

  render() {
    const max = (this.props.max)? this.props.max : 1.0;
    const width = Math.min(100, Math.max(0, this.props.value / max * 100));
    const opacity = (width === 0)? 0 : 1;

    return (
      <div className="form form-progress pointer-disabled">
        <div className="form-progress__bar">
          <div className="form-progress__value"
               style={{width: `${width}%`, opacity: opacity}}>
          </div>
        </div>
      </div>
    );
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
      <div className="form form-select">
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
      <div className="form form-script-area">
        <NativeTextarea value={this.state.tmpValue}
                        name={this.props.name}
                        cols={this.props.cols}
                        rows={this.props.rows}
                        onBlur={this._onBlur}
                        onChange={this._onChange} />
      </div>
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

const Text = React.createClass({
  propTypes() {
    return {
      value:        React.PropTypes.number.isRequired,
      name:         React.PropTypes.string,
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
    const prefix = (_Lang.isString(this.props.prefixString)
                 && this.props.prefixString.length > 0)
      ? <span className="form-text__prefix">
          {this.props.prefixString}
        </span>
      : null;

    const suffix = (_Lang.isString(this.props.suffixString)
                 && this.props.suffixString.length > 0)
      ? <span className="form-text__suffix">
          {this.props.suffixString}
        </span>
      : null;

    const input = (this.state.isEditing)
      ? <div className="form-text__focus">
          {prefix}
          <NativeText value={this.state.tmpValue}
                      name={this.props.name}
                      autoFocus={true}
                      onChange={this._onChange}
                      onKeyDown={this._onKeyDown}
                      onBlur={this._onBlur} />
          {suffix}
        </div>
      : <div className="form-text__unfocus"
             onClick={this._onUnfocusBoxClicked}>
          {prefix}
          <span className="form-text__unfocus__value">
            {this.props.value}
          </span>
          {suffix}
          <input type="text"
                 className="form-text__unfocus__dummy-input"
                 onFocus={this._onDummyFocus}/>
        </div>;

    return (
      <div className="form form-text">
        {input}
      </div>
    );
  },

  _onChange(e) {
    this.setState({
      tmpValue: e.target.value,
    });
  },

  _editCanceled: false,

  _onKeyDown(e) {
    if (e.keyCode === 13) {   // Enter
      e.preventDefault();
      e.target.blur();
    }
    if (e.keyCode === 27) {   // Esc
      e.preventDefault();
      this._editCanceled = true;
      e.target.blur();
    }
  },

  _onBlur(e) {
    this.setState({
      tmpValue: this.props.value,
      isEditing: false,
    });

    if (this._editCanceled) {
      this._editCanceled = false;
    }
    else if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  },

  _onUnfocusBoxClicked() {
    this.setState({
      tmpValue: this.props.value,
      isEditing: true,
    });
  },

  _onDummyFocus() {
    this._onUnfocusBoxClicked();
  },
});

export default {
  NativeCheckbox: NativeCheckbox,
  NativeNumber: NativeNumber,
  NativeSelect: NativeSelect,
  NativeOption: NativeOption,
  NativeRange: NativeRange,
  NativeText: NativeText,
  NativeTextarea: NativeTextarea,
  Checkbox: Checkbox,
  Number: Number,
  Progress: Progress,
  Select: Select,
  ScriptArea: ScriptArea,
  Text: Text,
}
