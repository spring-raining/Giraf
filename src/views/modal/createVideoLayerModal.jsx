"use strict";

import React                                    from "react";

import Actions                                  from "src/actions/actions";
import {Composition}                            from "src/stores/model/composition";
import {Footage, FootageKinds}                  from "src/stores/model/footage";
import {Layer}                                  from "src/stores/model/layer";
import {Point}                                  from "src/stores/model/point";
import {Transform}                              from "src/stores/model/transform";
import {Modal, ModalButtonSet}                  from "src/views/modal";
import Player                                   from "src/views/preview/player";
import genUUID                                  from "src/utils/genUUID";


const CreateVideoLayerModal = React.createClass({
  propTypes() {
    return {
      targetFootage:   React.PropTypes.instanceOf(Footage).isRequired,
      parentComp:      React.PropTypes.instanceOf(Composition),
      onCancelClicked: React.PropTypes.func,
      onCreateClicked: React.PropTypes.func,
    };
  },

  getInitialState() {
    return {
      playerPlaying: false,
      playerTime: 0,
      currentTime: 0,
      beginTime: null,
      endTime: null,
      videoFPS: 12,
      videoFrames: 0,
    };
  },

  render() {
    const title = "範囲を選択";

    const buttonContent = [
      {
        text: "キャンセル",
        onClick: () => {
          Actions.updateModal(null);
          if (this.props.onCancelClicked) {
            this.props.onCancelClicked();
          }
        },
      }, {
        text: "決定",
        onClick: () => {
          Actions.updateModal(null);
          if (this.props.onCreateClicked) {
            this.props.onCreateClicked(this._getNewLayer());
          }
        },
      },
    ];

    return (
      <Modal title={title}
             footer={ <ModalButtonSet content={buttonContent} /> }>
        <div className="create-video-layer-modal">
          <div className="create-video-layer-modal__player">
            <Player item={this.props.targetFootage}
                    playing={this.state.playerPlaying}
                    time={this.state.playerTime}
                    onPlay={this._onPlayerPlay}
                    onPause={this._onPlayerPause}
                    onSeeked={this._onPlayerSeeked}
                    onTimeUpdate={this._onPlayerTimeUpdate} />
          </div>
          <div className="create-video-layer-modal__controller">
            <button onClick={this._onBeginButtonClicked}>
              ここを始点にする
            </button>
            <button onClick={this._onPrevFrameButtonClicked}>
              前のフレーム
            </button>
            <button onClick={this._onNextFrameButtonClicked}>
              次のフレーム
            </button>
            <button onClick={this._onEndButtonClicked}>
              ここを終点にする
            </button>
          </div>
          <div className="create-video-layer-modal__info">
            <div className="create-video-layer-modal__info__left">
              <canvas className="create-video-layer-modal__info__begin-canvas"
                      width={this.props.targetFootage.width + "px"}
                      height={this.props.targetFootage.height + "px"}
                      ref="beginCanvas"/>
            </div>
            <div className="create-video-layer-modal__info__center"></div>
            <div className="create-video-layer-modal__info__right">
              <canvas className="create-video-layer-modal__info__end-canvas"
                      width={this.props.targetFootage.width + "px"}
                      height={this.props.targetFootage.height + "px"}
                      ref="endCanvas"/>
            </div>
          </div>
        </div>
      </Modal>
    );
  },

  _onPlayerPlay(time) {
    this.setState({
      playerPlaying: true,
      currentTime: time,
    });
  },

  _onPlayerPause(time) {
    this.setState({
      playerPlaying: false,
      currentTime: time,
    });
  },

  _onPlayerSeeked(time) {
    this.setState({
      currentTime: time,
    });
  },

  _onPlayerTimeUpdate(time) {
    this.setState({
      currentTime: time,
    });
  },


  _onBeginButtonClicked() {
    this.setState({
      playerPlaying: false,
      beginTime: this.state.currentTime,
    });

    this.props.targetFootage.render(this.state.currentTime).then(
      (result) => {
        const context = this.refs.beginCanvas.getContext("2d");
        context.drawImage(result, 0, 0);
      },
      (error) => {
        console.error(error);
      }
    );
  },

  _onPrevFrameButtonClicked() {
    if (this.props.targetFootage.getFootageKind() === FootageKinds.VIDEO) {
      this.setState({
        playerPlaying: false,
        playerTime: this.state.currentTime - (1 / this.state.videoFPS),
      });
    }
    else if (this.props.targetFootage.type === "image/gif") {
      this.setState({
        playerPlaying: false,
        playerTime: this.state.currentTime - 1,
      });
    }
  },

  _onNextFrameButtonClicked() {
    if (this.props.targetFootage.getFootageKind() === FootageKinds.VIDEO) {
      this.setState({
        playerPlaying: false,
        playerTime: this.state.currentTime + (1 / this.state.videoFPS),
      });
    }
    else if (this.props.targetFootage.type === "image/gif") {
      this.setState({
        playerPlaying: false,
        playerTime: this.state.currentTime + 1,
      });
    }
  },

  _onEndButtonClicked() {
    this.setState({
      playerPlaying: false,
      endTime: this.state.currentTime,
    });
    this.props.targetFootage.render(this.state.currentTime).then(
      (result) => {
        const context = this.refs.endCanvas.getContext("2d");
        context.drawImage(result, 0, 0);
      },
      (error) => {
        console.error(error);
      }
    );
  },

  _genNewComposition() {
    const newComp = new Composition(
      genUUID(),
      this.props.targetFootage.name,
      this.props.targetFootage.width,
      this.props.targetFootage.height

    );
    Actions.createComposition(newComp);
    return newComp;
  },

  _getNewLayer() {
    const composition = (this.props.parentComp instanceof Composition)?
      this.props.parentComp : this._genNewComposition();
    const footage = this.props.targetFootage;

    return new Layer(
      genUUID(),
      footage.name,
      composition.id,
      footage,
      new Transform(
        new Point([footage.width     / 2, footage.height     / 2]),
        new Point([composition.width / 2, composition.height / 2]),
        new Point([1, 1]),
        0,
        1),
      0,
      parentComp.frame);
  },
});

export default CreateVideoLayerModal;
