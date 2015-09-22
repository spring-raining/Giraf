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
      <li>
        {this.props.file.name}
      </li>
    );
  },
});