import React from "react";

import ModelComp from "../../stores/model/composition";
import ModelLayer from "../../stores/model/layer";


var LayerCell = React.createClass({
  propTypes() {
    return {
      index: React.PropTypes.number.isRequired,
    }
  },

  render() {
    return <div className="timeline__layer-cell"></div>;
  },
});

export default React.createClass({
  propTypes() {
    return {
      composition: React.PropTypes.instanceOf(ModelComp).isRequired,
      layer: React.PropTypes.instanceOf(ModelLayer).isRequired,
    };
  },

  render() {
    let cells = [];
    for (var i=0; i < this.props.composition.frame; i++) {
      cells.push(<LayerCell index={i} key={i} />);
    }

    return <div className="timeline__layer">
      <div className="timeline__layer-cell-container">
        {cells}
      </div>
    </div>;
  },
});
