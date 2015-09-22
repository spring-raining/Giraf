import React from "react";

import ModelFile from "../../stores/model/file";

export default React.createClass({
  propTypes() {
    return {
      file: React.PropTypes.instanceOf(ModelFile).isRequired,
    }
  },
  render() {
    return (
      <li className={"project__file " + this.props.file.status}>
        <span className="project__file__title">{this.props.file.name}</span>
      </li>
    );
  },
});