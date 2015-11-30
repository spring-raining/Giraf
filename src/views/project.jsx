"use strict";

import React              from "react";
import Isvg               from "react-inlinesvg";

import pkg                from "package.json";
import Actions            from "src/actions/actions";
import Item               from "src/views/project/item";
import Menu               from "src/views/menu";
import genUUID            from "src/utils/genUUID";


var Project = React.createClass({

  menuContent: [
    {
      name: "ファイルを読み込む",
      onClick: () => {
        Actions.updateExpandingMenuId(null);
        Actions.importFile();
      },
    }, {
      name: "コンポジションを作成",
      onClick: () => {
        Actions.updateExpandingMenuId(null);
        Actions.createComposition();
      },
    }
  ],

  menuId: genUUID(),

  render() {
    const store = this.props.store;
    const expandMenuId = store.get("expandingMenuId");

    const footages = store.get("footages").map((e) => {
      const isSelected = (e.id === store.get("selectingItem", "id"));
      return <Item item={e} key={e.id}
                   isSelected={isSelected}
                   isEdited={false} />;
    });
    const comps = store.get("compositions").map((e) => {
      const isSelected = (e.id === store.get("selectingItem", "id"));
      const isEdited   = (e.id === store.get("editingComposition", "id"));
      return <Item item={e} key={e.id}
                   isSelected={isSelected}
                   isEdited={isEdited} />;
    });

    return (
      <section className="project panel">
        <div className="project__brand">
          <Isvg src="rsc/giraf_logo.svg"
                className="project__brand__logo giraf_logo"/>
          <div className="project__brand__text">
            <span className="project__brand__version">{pkg.version}</span>
            <span className="project__brand__copyright">{pkg.copyright}</span>
          </div>
          <button className="project__brand__menu flat"
                  onClick={this._onMenuButtonClick}>
            ■
            <Menu content={this.menuContent}
                  expand={expandMenuId === this.menuId}/>
          </button>
        </div>
        <ul className="project__item-ul">
          {footages}
          {comps}
        </ul>
      </section>
    );
  },

  _onMenuButtonClick(e) {
    e.stopPropagation();
    const expandingMenuId = this.props.store.get("expandingMenuId");
    Actions.updateExpandingMenuId(
      (expandingMenuId === this.menuId)? null : this.menuId
    );
  }
});

export default Project;
