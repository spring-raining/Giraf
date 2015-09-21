import React from "react";
import {Layout, Flex, Fixed} from "react-layout-pane";
import Split from "react-split-pane";

import Nav from "./nav";
import Project from "./project";
import Effect from "./effect";
import Preview from "./preview";
import Node from "./node";

React.render(
  <Layout type="rows">
    <Fixed><Nav /></Fixed>
    <Flex>
      <Split split="vertical">
        <Project />
        <Split split="horizontal">
          <Split split="vertical">
            <Effect />
            <Preview />
          </Split>
          <Node />
        </Split>
      </Split>
    </Flex>
  </Layout>,
  document.getElementById("app")
);
