import React from "react";

import Actions from "../../actions/actions";
import {Footage} from "../../stores/model/footage";
import {Composition} from "../../stores/model/composition";

export default React.createClass({
  propTypes() {
    return {
      item: React.PropTypes.oneOfType([
        React.PropTypes.instanceOf(Footage),
        React.PropTypes.instanceOf(Composition),
      ]).isRequired,
      isSelected: React.PropTypes.boolean.isRequired,
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
                  + (this.props.isSelected? " selected" : "");
    }

    return (
      <li className={className} draggable="true"
          onClick={this._onClick}
          onDragStart={this._onDragStart}
          onDragEnd={this._onDragEnd}>
        <span className="project__item__title">{this.props.item.name}</span>
      </li>
    );
  },

  _onClick() {
    Actions.changeSelectingItem(this.props.item);
  },

  _onDragStart() {
    Actions.startDrag(this.props.item);
  },

  _onDragEnd() {
    Actions.endDrag();
  },
});
