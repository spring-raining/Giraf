"use strict";

import React from "react";

import Menu from "./menu";


var Nav = React.createClass({
  getInitialState() {
    return {
      expandingChild: null,
    };
  },

  content: [
    {name: "あああ", child:[
      {name: "aaaa"},
      {name: "bbbbb", child: [
        {name: "hogehoge"},
        {name: "fugafuga"},
      ]},
      {name: "cccccc", disabled: true},
    ]},
    {name: "いいい", child: [

    ]},
    {name: "ううう", child: [

    ]},
  ],

  render() {
    let list = this.content.map((e, i) =>
      <li className="nav__li" key={i}
          onMouseOver={this._onMouseOver(i)}
          onClick={this._onClick(i)}>
        <span className="nav__text">{e.name}</span>
        <Menu content={e.child}
              expand={i === this.state.expandingChild} />
      </li>
    );

    return (
      <nav className="nav panel">
        <ul className="nav__ul">
          {list}
        </ul>
      </nav>
    );
  },

  _onMouseOver(index) {
    return (e) => {
      let c = (this.state.expandingChild === null)? null : index;
      this.setState({expandingChild: c});
    }
  },

  _onClick(index) {
    return (e) => {
      let c = (index === this.state.expandingChild)? null : index;
      this.setState({expandingChild: c});
    }
  },
});

export default Nav;
