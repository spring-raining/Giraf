import React from "react";

import ModelComp from "../../stores/model/composition";
import ModelLayer from "../../stores/model/layer";


export default React.createClass({
  propTypes() {
    return {
      composition: React.PropTypes.instanceOf(ModelComp).isRequired,
      layer: React.PropTypes.instanceOf(ModelLayer).isRequired,
    };
  },

  render() {
    let comp = this.props.composition;
    let layer = this.props.layer;

    return <div className="timeline__layer-header">
      <span className="timeline__layer-header__name">{layer.name}</span>
    </div>;
  },
});
