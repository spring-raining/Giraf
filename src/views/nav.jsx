"use strict";

import React                  from "react";

import Actions                from "src/actions/actions";
import Menu                   from "src/views/menu";
import genUUID                from "src/utils/genUUID";


var Nav = React.createClass({
  getInitialState() {
    return {
      //expandingChild: null,
    };
  },

  content: [
    {
      name: "あああ",
      id: genUUID(),
      child: [
        {name: "aaaa"},
        {
          name: "bbbbb",
          child: [
            {name: "hogehoge"},
            {name: "fugafuga"},
          ]
        },
        {name: "cccccc", disabled: true},
      ],
    }, {
      name: "いいい",
      id: genUUID(),
      child: [],
    }, {
      name: "ううう",
      id: genUUID(),
      child: [],
    },
  ],

  render() {
    const expandMenuId = this.props.store.get("expandingMenuId");

    let list = this.content.map((e) => {
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
