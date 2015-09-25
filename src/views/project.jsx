"use strict";

import React from "react";

import Actions from "../actions/actions";
import Item from "./project/item";

var Project = React.createClass({
  render() {
    let store = this.props.store;

    let files = store.files.map((e) => {
      let isSelected = (e.id === store.idOfSelectingItem);
      return <Item item={e} key={e.id} isSelected={isSelected} />;
    });
    let comps = store.compositions.map((e) => {
      let isSelected = (e.id === store.idOfSelectingItem);
      return <Item item={e} key={e.id} isSelected={isSelected} />;
    });

    return <section className="project panel">
        <button onClick={this._onImportFileButtonClicked}>ファイルを読み込む</button>
        <button onClick={this._onCreateCompositionButtonClicked}>Create Composition</button>
        <ul>
          {files}
          {comps}
        </ul>
      </section>;
  },

  _onImportFileButtonClicked() {
    Actions.importFile();
  },

  _onCreateCompositionButtonClicked() {
    Actions.createComposition();
  },
});

export default Project;
