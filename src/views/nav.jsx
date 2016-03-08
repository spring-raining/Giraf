"use strict";

import React                  from "react";
import {FormattedMessage}     from 'react-intl';

import Actions                from "src/actions/actions";
import Menu                   from "src/views/menu";
import AboutGirafModal        from "src/views/modal/aboutGirafModal";
import Store                  from "src/stores/store";
import History                from "src/stores/history";
import {Composition}          from "src/stores/model/composition";
import genUUID                from "src/utils/genUUID";


const messages = {
  aboutGiraf: {
    id: "nav.about_giraf",
    defaultMessage: "Girafについて",
  },
  github: {
    id: "nav.github",
    defaultMessage: "GitHub",
  },
  harusamexCom: {
    id: "nav.harusamex_com",
    defaultMessage: "harusamex.com",
  },
  file: {
    id: "nav.file",
    defaultMessage: "ファイル",
  },
  importFile: {
    id: "nav.import_file",
    defaultMessage: "ファイルを読み込む",
  },
  createComposition: {
    id: "nav.create_composition",
    defaultMessage: "コンポジションを作成",
  },
  createGIF: {
    id: "nav.create_gif",
    defaultMessage: "GIFを作成",
  },
  edit: {
    id: "nav.edit",
    defaultMessage: "編集",
  },
  undo: {
    id: "nav.undo",
    defaultMessage: "元に戻す"
  },
  redo: {
    id: "nav.redo",
    defaultMessage: "やり直す",
  },
};

var Nav = React.createClass({

  menuId: genUUID(),

  getNavContent() {
    const activeItem = Store.get("activeItem");
    const editingComposition = (activeItem instanceof Composition) ? activeItem : null;
    const canUndo = History.commitStack.length > 0;
    const canRedo = History.revertStack.length > 0;

    return [
      {
        name: "Giraf",
        id: this.menuId + "_1",
        child: [
          {
            name: <FormattedMessage {...messages.aboutGiraf} />,
            onClick: () => {
              Actions.updateExpandingMenuId(null);
              Actions.updateModal(<AboutGirafModal />);
            },
          }, {
            name: <FormattedMessage {...messages.github} />,
            onClick: () => {
              Actions.updateExpandingMenuId(null);
              window.open("https://github.com/spring-raining/giraf");
            },
          }, {
            name: <FormattedMessage {...messages.harusamexCom} />,
            onClick: () => {
              Actions.updateExpandingMenuId(null);
              window.open("http://harusamex.com");
            },
          },
        ],
      }, {
        name: "ファイル",
        id: this.menuId + "_2",
        child: [
          {
            name: <FormattedMessage {...messages.importFile} />,
            onClick: () => {
              Actions.updateExpandingMenuId(null);
              Actions.importFile();
            },
          }, {
            name: <FormattedMessage {...messages.createComposition} />,
            onClick: () => {
              Actions.updateExpandingMenuId(null);
              Actions.createComposition();
            },
          }, {
            name: <FormattedMessage {...messages.createGIF} />,
            disabled: (editingComposition? false : true),
            onClick: () => {
              if (editingComposition) {
                Actions.updateExpandingMenuId(null);
                Actions.renderGIF(editingComposition);
              }
            },
          },
        ],
      }, {
        name: "編集",
        id: this.menuId + "_3",
        child: [
          {
            name: <FormattedMessage {...messages.undo} />,
            disabled: !canUndo,
            onClick: () => {
              if (canUndo) {
                Actions.updateExpandingMenuId(null);
                Actions.undo();
              }
            },
          }, {
            name: <FormattedMessage {...messages.redo} />,
            disabled: !canRedo,
            onClick: () => {
              if (canRedo) {
                Actions.updateExpandingMenuId(null);
                Actions.redo();
              }
            },
          },
        ],
      },
    ];
  },

  render() {
    const expandMenuId = this.props.store.get("expandingMenuId");

    let list = this.getNavContent().map((e) => {
      const className = "nav__li"
                      + ((expandMenuId === e.id)? " active" : "");
      return (
        <li className={className}
            key={e.id}
            onMouseOver={this._onMouseOver(e.id)}
            onClick={this._onClick(e.id)}>
          <span className="nav__text">{e.name}</span>
          <Menu content={e.child}
                expand={expandMenuId === e.id}/>
        </li>
      );
    });

    return (
      <nav className="nav panel">
        <ul className="nav__ul">
          {list}
        </ul>
      </nav>
    );
  },

  _onMouseOver(id) {
    return (e) => {
      //let c = (this.state.expandingChild === null)? null : index;
      //this.setState({expandingChild: c});
      const expandingMenuId = this.props.store.get("expandingMenuId");
      if (expandingMenuId) {
        Actions.updateExpandingMenuId(id);
      }
    }
  },

  _onClick(id) {
    return (e) => {
      //let c = (index === this.state.expandingChild)? null : index;
      //this.setState({expandingChild: c});
      e.stopPropagation();
      const expandingMenuId = this.props.store.get("expandingMenuId");
      if (id === expandingMenuId) {
        Actions.updateExpandingMenuId(null);
      }
      else {
        Actions.updateExpandingMenuId(id);
      }
    }
  },
});

export default Nav;
