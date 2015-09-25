import React from "react";

import Actions from "../../actions/actions";
import ModelFile from "../../stores/model/file";
import ModelComp from "../../stores/model/composition";

export default React.createClass({
  propTypes() {
    return {
      item: React.PropTypes.oneOfType([
        React.PropTypes.instanceOf(ModelFile),
        React.PropTypes.instanceOf(ModelComp),
      ]).isRequired,
      isSelected: React.PropTypes.boolean.isRequired,
    }
  },
  render() {
    var className = "project__item";

    if (this.props.item instanceof ModelFile) {
      className += " file " + this.props.item.status
                  + (this.props.isSelected? " selected" : "");
    }
    else if (this.props.item instanceof ModelComp) {
      className += " composition "
                  + (this.props.isSelected? " selected" : "");
    }

    return (
      <li className={className} onClick={this._onClick}>
        <span className="project__file__title">{this.props.item.name}</span>
      </li>
    );
  },
  _onClick() {
    Actions.changeSelectingItem(this.props.item);
  },
});
