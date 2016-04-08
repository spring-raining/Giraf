"use strict";

import React                  from "react";
import {FormattedMessage, defineMessages} from 'react-intl';

import Actions                from "src/actions/actions";
import Menu                   from "src/views/menu";
import AboutGirafModal        from "src/views/modal/aboutGirafModal";
import Store                  from "src/stores/store";
import History                from "src/stores/history";
import {Composition}          from "src/stores/model/composition";
import genUUID                from "src/utils/genUUID";


const messages = defineMessages({
  aboutGiraf: {
    id: "views.nav.about_giraf",
    defaultMessage: "About Giraf",
  },
  github: {
    id: "views.nav.github",
    defaultMessage: "GitHub",
  },
  harusamexCom: {
    id: "views.nav.harusamex_com",
    defaultMessage: "harusamex.com",
  },
  file: {
    id: "views.nav.file",
    defaultMessage: "File",
  },
  importFile: {
    id: "views.nav.import_file",
    defaultMessage: "Import File",
  },
  createComposition: {
    id: "views.nav.create_composition",
    defaultMessage: "Create Composition",
  },
  createGIF: {
    id: "views.nav.create_gif",
    defaultMessage: "Create GIF",
  },
  edit: {
    id: "views.nav.edit",
    defaultMessage: "Edit",
  },
  undo: {
    id: "views.nav.undo",
    defaultMessage: "Undo"
  },
  redo: {
    id: "views.nav.redo",
    defaultMessage: "Redo",
  },
});

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
        name: <FormattedMessage {...messages.file} />,
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
        name: <FormattedMessage {...messages.edit} />,
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
