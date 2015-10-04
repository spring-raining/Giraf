"use strict";

import React                  from "react";
import {Layout, Flex, Fixed}  from "react-layout-pane";
import Split                  from "react-split-pane";

import Store                  from "src/stores/store";
import Nav                    from "src/views/nav";
import Project                from "src/views/project";
import Effect                 from "src/views/effect";
import Preview                from "src/views/preview";
import Timeline               from "src/views/timeline";


var App = React.createClass({
  getInitialState() {
    return Store.getAll();
  },

  componentDidMount() {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnMount() {
    Store.removeChangeListener(this._onChange);
  },

  render() {
    var _;
    let dragging = (_ = this.state.dragging)? _.type : null;

    return <div data-giraf-dragging={dragging}>
      <Layout type="column">
        <Fixed>
          <Nav store={this.state} />
        </Fixed>
        <Flex>
          <Split split="vertical" minSize="30" defaultSize="30%">
            <Project store={this.state} />
            <Split split="horizontal" minSize="30" defaultSize="50%">
              <Split split="vertical">
                <Effect store={this.state} />
                <Preview store={this.state} />
              </Split>
              <Timeline store={this.state} />
            </Split>
          </Split>
        </Flex>
      </Layout>
    </div>;
  },

  _onChange() {
    this.setState(Store.getAll());
  },
});

export default App;
