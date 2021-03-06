"use strict";

import React              from "react";
import Isvg               from "react-inlinesvg";
import {FormattedMessage} from "react-intl";

import pkg                from "package.json";
import Actions            from "src/actions/actions";
import Item               from "src/views/project/item";
import Menu               from "src/views/menu";
import genUUID            from "src/utils/genUUID";


var Project = React.createClass({

  menuContent: [
    {
      name: <FormattedMessage id="views.project.import_file"
                              defaultMessage="Import File" />,
      onClick: () => {
        Actions.updateExpandingMenuId(null);
        Actions.importFile();
      },
    }, {
      name: <FormattedMessage id="views.project.create_composition"
                              defaultMessage="Create Composition" />,
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
      const isActive   = (e.id === store.get("activeItem", "id"));
      return <Item item={e} key={e.id}
                   isSelected={isSelected}
                   isActive={isActive} />;
    });
    const comps = store.get("compositions").map((e) => {
      const isSelected = (e.id === store.get("selectingItem", "id"));
      const isActive   = (e.id === store.get("activeItem", "id"));
      return <Item item={e} key={e.id}
                   isSelected={isSelected}
                   isActive={isActive} />;
    });

    return (
      <section className="project panel">
        <div className="project__brand">
          <Isvg src="rsc/giraf_logo.svg"
                className="project__brand__logo giraf_logo"/>
          <div className="project__brand__text">
            <span className="project__brand__version">Version: {pkg.version}</span>
            <span className="project__brand__copyright">{pkg.copyright}</span>
          </div>
          <div className="project__brand__menu">
            <button className="flat lsf-icon"
                    title="etc"
                    onClick={this._onMenuButtonClick}>
            </button>
            <Menu content={this.menuContent}
                  expand={expandMenuId === this.menuId}/>
          </div>
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
