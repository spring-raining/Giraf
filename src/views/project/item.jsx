"use strict";

import React from "react";

import Actions              from "src/actions/actions";
import {Footage}            from "src/stores/model/footage";
import {Composition}        from "src/stores/model/composition";


export default React.createClass({
  propTypes() {
    return {
      item: React.PropTypes.oneOfType([
        React.PropTypes.instanceOf(Footage),
        React.PropTypes.instanceOf(Composition),
      ]).isRequired,
      isSelected: React.PropTypes.boolean.isRequired,
      isEdited: React.PropTypes.boolean.ieRequired,
    }
  },

  render() {
    var className = "project__item";

    if (this.props.item instanceof Footage) {
      className += " footage " + this.props.item.status
                  + (this.props.isSelected? " selected" : "");
    }
    else if (this.props.item instanceof Composition) {
      className += " composition "
                  + (this.props.isSelected? " selected" : "")
                  + (this.props.isEdited?   " edited" : "");
    }

    return (
      <li className={className} draggable="true"
          onClick={this._onClick}
          onDoubleClick={this._onDoubleClick}
          onDragStart={this._onDragStart}
          onDragEnd={this._onDragEnd}>
        <span className="project__item__title">{this.props.item.name}</span>
      </li>
    );
  },

  _onClick() {
    Actions.changeSelectingItem(this.props.item);
  },

  _onDoubleClick() {
    if (this.props.item instanceof Composition) {
      Actions.changeEditingComposition(this.props.item);
    }
    else {
      Actions.changeEditingComposition(null);
    }
  },

  _onDragStart() {
    Actions.startDrag(this.props.item);
  },

  _onDragEnd() {
    Actions.endDrag();
  },
});
