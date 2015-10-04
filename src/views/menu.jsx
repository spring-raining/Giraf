"use strict";

import React from "react";


var Menu = React.createClass({
  propTypes () {
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
          <Menu content={e.child}
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

export default Menu;
