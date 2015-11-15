"use strict";

import React                      from "react";

import {Footage, FootageKinds}    from "src/stores/model/footage";
import {Composition}              from "src/stores/model/composition";


var Player = React.createClass({
  propTypes() {
    return {
      item: React.PropTypes.instanceOf(Footage).isRequired,
      onPause:      React.PropTypes.func,
      onPlay:       React.PropTypes.func,
      onSeeked:     React.PropTypes.func,
      onTimeUpdate: React.PropTypes.func,
    };
  },

  render() {
    let item = this.props.item;
    if (item instanceof Footage
    &&  item.getFootageKind() === FootageKinds.IMAGE) {
      return (
        <div className="preview__player">
          <div className="preview__player__container footage image">
            <img src={item.objectURL} />
          </div>
        </div>
      );
    }
    else if (item instanceof Footage
         &&  item.getFootageKind() === FootageKinds.VIDEO) {
      return (
        <div className="preview__player">
          <div className="preview__player__container footage video">
            <Video src={item.objectURL}
                   onPause={this._onPause}
                   onPlay={this._onPlay}
                   onSeeked={this._onSeeked}
                   onTimeUpdate={this._onTimeUpdate}/>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="preview__player">
          <div className="preview__player__container none"></div>
        </div>
      );
    }
  },
  _onPause(e) {
    console.log(e);
  },

  _onPlay(e) {
    console.log(e);
  },

  _onSeeked(e) {
    console.log(e);
  },

  _onTimeUpdate(e) {
    console.log(e);
  },
});

export default Player;
