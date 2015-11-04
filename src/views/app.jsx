"use strict";

import React                  from "react";
import Split                  from "react-split-pane";
import Mousetrap              from "mousetrap";

import Actions                from "src/actions/actions";
import Store                  from "src/stores/store";
import Nav                    from "src/views/nav";
import Project                from "src/views/project";
import Effect                 from "src/views/effect";
import Preview                from "src/views/preview";
import Timeline               from "src/views/timeline";


var App = React.createClass({
  getInitialState() {
    return {
      store: Store
    }
  },

  componentDidMount() {
    this.state.store.addChangeListener(this._onChange);
    this.setKeyEvents();
  },

  componentWillUnMount() {
    this.state.store.removeChangeListener(this._onChange);
  },

  setKeyEvents() {
    // To prevent default browser behavior, return false.
    Mousetrap.bind("space", () => {
      Actions.togglePlay();
      return false;
    });

    Mousetrap.bind("mod+z", () => {
      Actions.undo();
      return false;
    });

    Mousetrap.bind("mod+shift+z", () => {
      Actions.redo();
      return false;
    });
  },

  render() {
    var _;
    let dragging = (_ = this.state.dragging)? _.type : null;

    return (
      <div className="app" data-giraf-dragging={dragging}>
        <div className="app__nav">
          <Nav store={this.state.store} />
        </div>
        <div className="app__main">
          <Split split="vertical" minSize="30" defaultSize="30%">
            <Project store={this.state.store} />
            <Split split="horizontal" minSize="30" defaultSize="50%">
              <Split split="vertical">
                <Effect store={this.state.store} />
                <Preview store={this.state.store} />
              </Split>
              <Timeline store={this.state.store} />
            </Split>
          </Split>
        </div>
      </div>
    );
  },

  _onChange() {
    this.setState({
      store: Store
    });
  },
});

export default App;
