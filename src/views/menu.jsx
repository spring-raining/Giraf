"use strict";

import React                  from "react";


const MenuPart = React.createClass({
  propTypes() {
    return {
      content: React.PropTypes.array.isRequired,
      expand:  React.PropTypes.bool.isRequired,
    };
  },

  getInitialState() {
    return {
      expandingChild: null,
    };
  },

  render() {
    let convert = (content) => {
      let list = content.map((e, i) => {
        let child = (!e.child)? null :
          <MenuPart content={e.child}
                    expand={i === this.state.expandingChild} />;
        let className = "menu__li"
          + ((e.child)? " menu__expandable" : "")
          + ((e.disabled)? " menu__disabled" : "");
        return (
          <li className={className} key={i}
              onClick={this._onClick(e.onClick)}
              onMouseOver={this._onMouseOver(i)}>
            <span className="menu__text">{e.name}</span>
            {child}
          </li>
        );
      });
      return <ul className="menu__ul">{list}</ul>;
    };
    let className = "menu"
      + ((this.props.expand)? "" : " hidden");

    return (
      <div className={className}>
        {convert(this.props.content)}
      </div>
    );
  },

  _onMouseOver(index) {
    return (e) => {
      this.setState({expandingChild: index});
    }
  },

  _onClick(action) {
    return (e) => {
      e.stopPropagation();
      if (action instanceof Function) {
        action();
      }
    }
  },
});

const Menu = React.createClass({
  propTypes() {
    return {
      content:  React.PropTypes.array.isRequired,
      expand:   React.PropTypes.bool.isRequired,
    };
  },

  render() {
    const menuPart = (!this.props.expand)? null
      : <MenuPart content={this.props.content}
                  expand={true} />;

    return (
      <div className="menu__container">
        {menuPart}
      </div>
    );
  },
});

export default Menu;
