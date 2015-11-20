"use strict";

import React from "react";


const Select = React.createClass({
  propTypes() {
    return {
      name:         React.PropTypes.string.isRequired,
      value:        React.PropTypes.any.isRequired,
      options:      React.PropTypes.array.isRequired,
      optionNames:  React.PropTypes.array,
      onChange:     React.PropTypes.func.isRequired,
    };
  },

  render() {
    const options = this.props.options.map((opt, i) => {
      const name = (this.props.optionName)? this.props.optionName[i] : opt;
      return (
        <option value={opt} key={i}>{name}</option>
      );
    });

    return (
      <select className="form-select"
              name={this.props.name}
              value={this.props.value}
              onChange={this._onChange}>
        {options}
      </select>
    );
  },

  _onChange(e) {
    this.props.onChange(e.target.value);
  },
});

export default {
  Select: Select,
}
