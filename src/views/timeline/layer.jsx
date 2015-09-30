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

var LayerTimetable = React.createClass({
  propTypes() {
    return {
      composition: React.Proptypes.instanceOf(ModelComp).isRequired,
      layer: React.PropTypes.instanceOf(ModelLayer).isRequired,
    }
  },

  render() {
    let comp = this.props.composition;
    let layer = this.props.layer;

    return (
      <div className="timeline__layer-timetable timeline__layer-flex">
        <div className="timeline__layer-timetable__before"
             style={{flexGrow: layer.layerStart}}>
        </div>

        <div className="timeline__layer-timetable__entity"
             style={{flexGrow: layer.layerEnd - layer.layerStart}}>
          {layer.layerStart} - {layer.layerEnd}
        </div>

        <div className="timeline__layer-timetable__after"
             style={{flexGrow: comp.frame - layer.layerEnd}}>
        </div>
      </div>
    );
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
      <div className="timeline__layer-flex-container">
        <div className="timeline__layer-flex">
          {cells}
        </div>
      </div>
      <div className="timeline__layer-flex-container">
        <LayerTimetable layer={this.props.layer} composition={this.props.composition} />
      </div>
    </div>;
  },
});
