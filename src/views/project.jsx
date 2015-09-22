"use strict";

import React from "react";

import Actions from "../actions/actions";
import File from "./project/file";

var Project = React.createClass({
  render() {
    let store = this.props.store;

    let files = store.files.map((e) => <File file={e} key={e.id} />);
    return <section className="project panel">
        <button onClick={this._onClick}>ファイルを読み込む</button>
        <ul>
          {files}
        </ul>
      </section>;
  },

  _onClick() {
    Actions.importFile();
  },
});

export default Project;
