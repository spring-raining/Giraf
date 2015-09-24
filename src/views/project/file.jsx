import React from "react";

import Actions from "../../actions/actions";
import ModelFile from "../../stores/model/file";

export default React.createClass({
  propTypes() {
    return {
      file: React.PropTypes.instanceOf(ModelFile).isRequired,
      isSelected: React.PropTypes.boolean.isRequired,
    }
  },
  render() {
    var className = "project__file " + this.props.file.status
                  + (this.props.isSelected? " selected": "");
    return (
      <li className={className} onClick={this._onClick}>
        <span className="project__file__title">{this.props.file.name}</span>
      </li>
    );
  },
  _onClick() {
    Actions.changeSelectingItem(this.props.file);
  },
});