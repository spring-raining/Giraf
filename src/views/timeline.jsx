"use strict";

import React from "react";

import Summary from "./timeline/summary";
import Composition from "../stores/model/composition";

class Timeline extends React.Component {
  render() {
    let store = this.props.store;
    let selectedItem = store.access.getSelectedItem();
    console.log(selectedItem);

    if (selectedItem instanceof Composition) {
      let summary = <Summary composition={selectedItem} />;

      return <section className="timeline panel">
        <button onClick={this._onCreateLayerButtonClicked}>Create Layer</button>
        {summary}
      </section>;
    }
    else {
      return <section className="timeline panel"></section>
    }
  }
}

export default Timeline;
