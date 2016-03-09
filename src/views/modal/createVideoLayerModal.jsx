"use strict";

import React                                    from "react";
import {FormattedMessage}                       from "react-intl";
import _Utility                                 from "lodash/utility";

import Actions                                  from "src/actions/actions";
import {Composition}                            from "src/stores/model/composition";
import {Footage, FootageKinds}                  from "src/stores/model/footage";
import {Layer}                                  from "src/stores/model/layer";
import {Point}                                  from "src/stores/model/point";
import {Transform}                              from "src/stores/model/transform";
import {Select}                                 from "src/views/forms";
import {Modal, ModalButtonSet}                  from "src/views/modal";
import Player                                   from "src/views/preview/player";
import genUUID                                  from "src/utils/genUUID";


const VIDEO_FPS_OPTIONS = [1, 2, 3, 4, 6, 8, 12, 15, 24, 30];
const DEFAULT_VIDEO_FPS = 12;

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
      videoFPS: DEFAULT_VIDEO_FPS,
    };
  },

  getKeyEvents() {
    return {
      "space": () => {
        this.setState({
          playerPlaying: !this.state.playerPlaying,
        });
        return false;
      },
      "enter": this._onSubmit,
      "left": this._onPrevFrameButtonClicked,
      "right": this._onNextFrameButtonClicked,
    };
  },

  render() {
    const title = <FormattedMessage id="views.modal.create_video_layer_modal.title"
                                    defaultMessage="Select Range" />;

    const buttonContent = [
      {
        text: <FormattedMessage id="views.modal.create_video_layer_modal.cancel"
                                defaultMessage="Cancel" />,
        onClick: this._onCancel,
      }, {
        text: <FormattedMessage id="views.modal.create_video_layer_modal.ok"
                                defaultMessage="OK" />,
        onClick: this._onSubmit,
      },
    ];

    const infoContent = (() => {
      const reverse = (this.state.beginTime === null
                       || this.state.endTime === null
                       || this.state.beginTime <= this.state.endTime)
        ? null
        : <div className="create-video-layer-modal__info__center__dd">
            reverse
          </div>;

      if (this.props.targetFootage.getFootageKind() === FootageKinds.VIDEO) {
        return (
          <ul>
            <li>
              <label>
                <div className="create-video-layer-modal__info__center__dt">
                  <FormattedMessage id="views.modal.create_video_layer_modal.frame_rate"
                                    defaultMessage="Frame Rate" />
                </div>
                <div className="create-video-layer-modal__info__center__dd">
                  <Select name="videoFPS"
                          value={this.state.videoFPS}
                          options={VIDEO_FPS_OPTIONS}
                          onChange={this._onVideoFPSChanged} />
                  <span>fps</span>
                </div>
              </label>
            </li>
            <li>
              <div className="create-video-layer-modal__info__center__dt">
                <FormattedMessage id="views.modal.create_video_layer_modal.number_of_frames"
                                  defaultMessage="Number of Frames" />
              </div>
              <div className="create-video-layer-modal__info__center__dd">
                <span className="modal__badge">
                  {this._getFrameNumber()}
                </span>
                <span>frames</span>
              </div>
              {reverse}
            </li>
          </ul>
        );
      }
      else if (this.props.targetFootage.type === "image/gif") {
        return (
          <ul>
            <li>
              <div className="create-video-layer-modal__info__center__dt">
                <FormattedMessage id="views.modal.create_video_layer_modal.number_of_frames"
                                  defaultMessage="Number of Frames" />
              </div>
              <div className="create-video-layer-modal__info__center__dd">
                <span className="modal__badge">
                  {this._getFrameNumber()}
                </span>
                <span>frames</span>
              </div>
              {reverse}
            </li>
          </ul>
        );
      }
    })();

    return (
      <Modal title={title}
             footer={ <ModalButtonSet content={buttonContent} /> }
             keyEvents={this.getKeyEvents()}>
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
              <FormattedMessage id="views.modal.create_video_layer_modal.set_in_point"
                                defaultMessage="Set In Point" />
            </button>
            <button onClick={this._onPrevFrameButtonClicked}>
              <FormattedMessage id="views.modal.create_video_layer_modal.previous_frame"
                                defaultMessage="Previous Frame" />
            </button>
            <button onClick={this._onNextFrameButtonClicked}>
              <FormattedMessage id="views.modal.create_video_layer_modal.next_frame"
                                defaultMessage="Next Frame" />
            </button>
            <button onClick={this._onEndButtonClicked}>
              <FormattedMessage id="views.modal.create_video_layer_modal.set_out_point"
                                defaultMessage="Set Out Point" />
            </button>
          </div>
          <div className="create-video-layer-modal__info">
            <div className="create-video-layer-modal__info__left">
              <canvas className="create-video-layer-modal__info__begin-canvas"
                      width={this.props.targetFootage.width + "px"}
                      height={this.props.targetFootage.height + "px"}
                      ref="beginCanvas"/>
            </div>
            <div className="create-video-layer-modal__info__center">
              <div className="create-video-layer-modal__info__center__content">
                {infoContent}
              </div>
            </div>
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

  _onSubmit() {
    const newLayer = this._getNewLayer();
    if (newLayer) {
      Actions.updateModal(null);
      if (this.props.onCreateClicked) {
        this.props.onCreateClicked(newLayer);
      }
    }
    return false;
  },

  _onCancel() {
    Actions.updateModal(null);
    if (this.props.onCancelClicked) {
      this.props.onCancelClicked();
    }
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
    return false;
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
    return false;
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

  _onVideoFPSChanged(value) {
    this.setState({
      videoFPS: value,
    });
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
    if (this.state.beginTime === null || this.state.endTime === null) {
      return null;
    }

    const composition = (this.props.parentComp instanceof Composition)?
      this.props.parentComp : this._genNewComposition();
    const footage = this.props.targetFootage;

    const frame = this._getFrameNumber();
    const beginTime = this.state.beginTime;
    let endTime = this.state.endTime;
    if (footage.getFootageKind() === FootageKinds.VIDEO) {
      endTime += 1 / this.state.videoFPS;
    }
    else if (footage.type === "image/gif") {
      endTime += 1;
    }

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
      frame,
      beginTime,
      endTime);
  },

  _getFrameNumber() {
    if (this.state.beginTime === null || this.state.endTime === null) {
      return 0;
    }

    const a = Math.min(this.state.beginTime, this.state.endTime);
    const b = Math.max(this.state.beginTime, this.state.endTime);
    if (this.props.targetFootage.getFootageKind() === FootageKinds.VIDEO) {
      return Math.floor((b - a) * this.state.videoFPS) + 1;
    }
    else if (this.props.targetFootage.type === "image/gif") {
      return b - a + 1;
    }
  },
});

export default CreateVideoLayerModal;
