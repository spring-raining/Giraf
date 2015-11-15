"use strict";

import React                                    from "react";

import Actions                                  from "src/actions/actions";
import {Composition}                            from "src/stores/model/composition";
import {Footage}                                from "src/stores/model/footage";
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
            <Player item={this.props.targetFootage} />
          </div>
          <div className="create-video-layer-modal__controller">
            <button onClick={this._onBeginButtonClicked}>
              ここを始点にする
            </button>
            <button onClick={this._onEndButtonClicked}>
              ここを終点にする
            </button>
          </div>
          <div className="create-video-layer-modal__info">
            <div className="create-video-layer-modal__info__left">
              <canvas className="create-video-layer-modal__info__begin-canvas" />
            </div>
            <div className="create-video-layer-modal__info__center"></div>
            <div className="create-video-layer-modal__info__right">
              <canvas className="create-video-layer-modal__info__end-canvas" />
            </div>
          </div>
        </div>
      </Modal>
    );
  },

  _onBeginButtonClicked() {
    console.log("begin");
  },

  _onEndButtonClicked() {
    console.log("end");
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
