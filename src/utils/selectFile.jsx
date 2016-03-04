"use strict";

import React from "react";
import ReactDOM from "react-dom";

export function run(callback) {
  const containerId = "dummy_input_container";
  const inputId = "dummy_input";

  var DummyInput = class extends React.Component {
    _onChange() {
      callback(document.getElementById(inputId).files);
      document.body.removeChild(document.getElementById(containerId));
    }

    componentDidMount() {
      document.getElementById(inputId).click();
    }

    render() {
      return <input type="file" style={{display: "none"}} id={inputId} multiple
                    onChange={this._onChange} />;
    }
  };
  var dom = document.getElementById(containerId);
  if (!dom) {
    dom = document.createElement("div");
    dom.id = containerId;
    document.body.appendChild(dom);
  }
  ReactDOM.render(<DummyInput />, dom);
}

export default {
  run: run,
};
