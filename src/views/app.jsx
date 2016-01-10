"use strict";

import React                  from "react";
import Split                  from "react-split-pane";

import Actions                from "src/actions/actions";
import Store                  from "src/stores/store";
import History                from "src/stores/history";
import Nav                    from "src/views/nav";
import Project                from "src/views/project";
import Effect                 from "src/views/effect";
import Preview                from "src/views/preview";
import Timeline               from "src/views/timeline";
import setKeyEvents           from "src/utils/setKeyEvents";


var App = React.createClass({

  getGeneralKeyEvents() {
    return {
      // To prevent default browser behavior, return false.
      "space": () => {
        Actions.togglePlay();
        return false;
      },
      "mod+z": () => {
        Actions.undo();
        return false;
      },
      "mod+shift+z": () => {
        Actions.redo();
        return false;
      },
      "left": () => {
        Actions.pause();
        Actions.goBackwardCurrentFrame();
        return false;
      },
      "shift+left": () => {
        Actions.pause();
        Actions.goBackwardCurrentFrame(10);
        return false;
      },
      "right": () => {
        Actions.pause();
        Actions.goForwardCurrentFrame();
        return false;
      },
      "shift+right": () => {
        Actions.pause();
        Actions.goForwardCurrentFrame(10);
        return false;
      },
    };
  },

  getInitialState() {
    return {
      store: Store,
      appearingModal: false,
    }
  },

  componentDidMount() {
    this.state.store.addChangeListener(this._onChange);
    setKeyEvents(this.getGeneralKeyEvents());

    window.onbeforeunload = (e) => {
      if (History.isChanged()) {
        return "Girafは編集中です 変更は保存されません";
      } else {
        // Pass dialog
        e = null;
      }
    };
  },

  componentWillUnMount() {
    this.state.store.removeChangeListener(this._onChange);
  },

  componentDidUpdate(prevProps, prevState) {
    const modal = this.state.store.get("modal");
    // Appear modal
    if (modal && !this.state.appearingModal) {
      this.setState({
        appearingModal: true,
      });
    }

    // Disappear modal
    if (!modal && this.state.appearingModal) {
      setKeyEvents(this.getGeneralKeyEvents());
      this.setState({
        appearingModal: false,
      });
    }
  },

  render() {
    var _;
    let dragging = (_ = this.state.store.get("dragging"))? _.type : null;

    const modal = !(_ = this.state.store.get("modal"))? null :
      <div className="app__modal">{_}</div>;

    return (
      <div className="app" data-giraf-dragging={dragging}
           onClick={this._onClick}>
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
        {modal}
      </div>
    );
  },

  _onChange() {
    this.setState({
      store: Store
    });
  },

  _onClick(e) {
    Actions.updateExpandingMenuId(null);
  }
});

export default App;
