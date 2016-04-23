"use strict";

import React                      from "react";

import {Footage, FootageKinds}    from "src/stores/model/footage";
import {Composition}              from "src/stores/model/composition";


var Player = React.createClass({
  propTypes() {
    return {
      item: React.PropTypes.instanceOf(Footage).isRequired,
      playing: React.PropTypes.boolean,
      time: React.PropTypes.number,
      onPause:      React.PropTypes.func,
      onPlay:       React.PropTypes.func,
      onSeeked:     React.PropTypes.func,
      onTimeUpdate: React.PropTypes.func,
    };
  },

  getInitialState() {
    return {
      isPlaying: false,
      currentGIFFrame: 0,
    };
  },

  componentDidMount() {
    if (this.refs.GIFCanvasContainer) {
      this._updateGIFCanvasDOM(this.state.currentGIFFrame);
    }

    if (this.props.playing) {
      this.setState({
        isPlaying: true,
      });
    }
  },

  componentWillReceiveProps(nextProps) {
    // change playing
    if (nextProps.playing !== undefined) {
      this.setState({
        isPlaying: nextProps.playing,
      });
    }

    // change current time
    if (nextProps.time !== undefined && nextProps.time !== this.props.time) {
      if (this.refs.GIFCanvasContainer) {
        this.setState({
          currentGIFFrame: Math.max(0,
                           Math.min(this.props.item.gifFrames.length - 1,
                                    nextProps.time)),
        });
      }
      if (this.refs.video) {
        this.refs.video.currentTime = nextProps.time;
      }
    }
  },

  componentDidUpdate(prevProps, prevState) {
    // start
    if (this.state.isPlaying && !prevState.isPlaying) {
      if (this.refs.GIFCanvasContainer) {
        this._updateGIFCanvasDOMAutomatically(this.state.currentGIFFrame);
      }
      if (this.refs.video) {
        this.refs.video.play();
      }
    }

    // stop
    if (!this.state.isPlaying && prevState.isPlaying) {
      if (this.refs.video) {
        this.refs.video.pause();
      }
    }

    // gif frame update
    if (this.state.currentGIFFrame !== prevState.currentGIFFrame) {
      this._updateGIFCanvasDOM(this.state.currentGIFFrame);
    }
  },

  render() {
    let item = this.props.item;

    if (item.type === "image/gif") {
      return (
        <div className="preview__player">
          <div ref="GIFCanvasContainer"
               className="preview__player__container footage image"
               onClick={this._onGIFCanvasClicked}>
          </div>
        </div>
      );
    }
    else if (item instanceof Footage
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
            <video controls src={item.objectURL}
                   ref="video"
                   onPause={this._onPause("video")}
                   onPlay={this._onPlay("video")}
                   onSeeked={this._onSeeked("video")}
                   onTimeUpdate={this._onTimeUpdate("video")}/>
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
  _onPause(type) {
    return (e) => {
      this.setState({
        isPlaying: false,
      });
      
      if (type === "video") {
        if (this.props.onPause) {
          this.props.onPause(e.target.currentTime);
        }
      }
      else if (type === "gif") {
        if (this.props.onPause) {
          this.props.onPause(this.state.currentGIFFrame);
        }
      }
    }
  },

  _onPlay(type) {
    return (e) => {
      this.setState({
        isPlaying: true,
      });
      
      if (type === "video") {
        if (this.props.onPlay) {
          this.props.onPlay(e.target.currentTime);
        }
      }
      else if (type === "gif") {
        if (this.props.onPlay) {
          this.props.onPlay(this.state.currentGIFFrame);
        }
      }
    }
  },

  _onSeeked(type) {
    return (e) => {
      if (type === "video") {
        if (this.props.onSeeked) {
          this.props.onSeeked(e.target.currentTime);
        }
      }
      else if (type == "gif") {
        this.setState({
          currentGIFFrame: e,
        });
        if (this.props.onSeeked) {
          this.props.onSeeked(this.state.currentGIFFrame);
        }
      }
    }
  },

  _onTimeUpdate(type) {
    return (e) => {
      if (type === "video") {
        if (this.props.onTimeUpdate) {
          this.props.onTimeUpdate(e.target.currentTime);
        }
      }
      else if (type === "gif") {
        this.setState({
          currentGIFFrame: e,
        });
        if (this.props.onTimeUpdate) {
          this.props.onTimeUpdate(this.state.currentGIFFrame);
        }
      }
    }
  },

  _onGIFCanvasClicked() {
    if (this.state.isPlaying) {
      this._onPause("gif")();
    }
    else {
      this._onPlay("gif")();
    }
  },

  _updateGIFCanvasDOM(time) {
    return new Promise((resolve, reject) => {
      if (!this.refs.GIFCanvasContainer) {
        reject();
      }

      const containerDOM = this.refs.GIFCanvasContainer;
      this.props.item.render(time).then(
        (result) => {
          if (!containerDOM.firstChild) {
            containerDOM.appendChild(result);
          }
          this._onTimeUpdate("gif")(time);
          resolve(result);
        },
        (error) => {
          reject(error);
        });
    });
  },

  _updateGIFCanvasDOMAutomatically(firstTime) {
    const this_ = this;

    Promise.resolve(firstTime).then(
      function loop(time) {
        const frame = this_.props.item.gifFrames[time];

        return new Promise((resolve, reject) => {
          new Promise((resolve_, reject_) => {
            this_.setState({
              currentGIFFrame: time,
            });
            setTimeout(() => {
              resolve_();
            }, (frame.delayTime > 0) ? frame.delayTime : 100);
          }).then(
            (result) => {
              if (!this_.state.isPlaying) {
                reject();
              }
              const t = (time + 1 < this_.props.item.gifFrames.length) ? time + 1 : 0;
              resolve(t);
            },
            (error) => {
              console.error(error);
              reject();
            }
          );
        }).then(loop)
          .catch((error) => {
            // stopped
          });
      }
    );
  },
});

export default Player;
