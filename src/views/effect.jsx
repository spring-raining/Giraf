"use strict";

import React from "react";

var Effect = React.createClass({
  render() {
    let comp  = this.props.store.editingComposition;
    let layer = this.props.store.editingLayer;

    // Layer edit mode
    if (comp && layer) {
      return (
        <section className="effect panel">
          <h4>{layer.name}</h4>
          <ul>
            <li>Anchor point: {layer.transform.anchorPoint.get()}</li>
            <li>Position: {layer.transform.position.get()}</li>
            <li>Scale: {layer.transform.scale.get()}</li>
            <li>Rotation: {layer.transform.rotation}</li>
            <li>Opacity: {layer.transform.opacity}</li>
          </ul>
        </section>
      );
    }
    // Composition edit mode
    else if (comp && !layer) {
      return (
        <section className="effect panel">
          <h4>{comp.name}</h4>
        </section>
      );
    }
    // Nothing
    else {
      return (
        <section className="effect panel">
        </section>
      );
    }
  },
});

export default Effect;
