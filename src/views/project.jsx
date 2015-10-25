"use strict";

import React              from "react";

import Actions            from "src/actions/actions";
import Item               from "src/views/project/item";


var Project = React.createClass({
  render() {
    let store = this.props.store;

    let footages = store.get("footages").map((e) => {
      let isSelected = (e.id === store.get("selectingItem", "id"));
      return <Item item={e} key={e.id}
                   isSelected={isSelected}
                   isEdited={false} />;
    });
    let comps = store.get("compositions").map((e) => {
      let isSelected = (e.id === store.get("selectingItem", "id"));
      let isEdited   = (e.id === store.get("editingComposition", "id"));
      return <Item item={e} key={e.id}
                   isSelected={isSelected}
                   isEdited={isEdited} />;
    });

    return <section className="project panel">
        <button onClick={this._onImportFileButtonClicked}>ファイルを読み込む</button>
        <button onClick={this._onCreateCompositionButtonClicked}>Create Composition</button>
        <ul>
          {footages}
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
