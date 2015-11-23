"use strict";

import React                                    from "react";
import keyMirror                                from "keymirror";

import Actions                                  from "src/actions/actions";
import {Composition}                            from "src/stores/model/composition";
import {Modal, ModalButtonSet}                  from "src/views/modal";
import Player                                   from "src/views/preview/player";


const MODAL_SCENE = keyMirror({
  SETTING: null,
  RENDERING: null,
  RENDERED: null,
});

const RenderGIFModal = React.createClass({
  propTypes() {
    return {
      composition:      React.PropTypes.instanceOf(Composition).isRequired,
      onCancelClicked:  React.PropTypes.func,
      onDoneClicked:    React.PropTypes.func,
    };
  },

  getInitialState() {
    return {
      modalScene: MODAL_SCENE.SETTING,
      gifFPS: this.props.composition.fps,
      gifSize: this.props.composition.width,
      gifStart: 0,
      gifEnd: this.props.composition.frame,
    };
  },

  render() {
    const title = "GIFを作成";

    const buttonContent = (scene) => {
      switch (scene) {
        case (MODAL_SCENE.SETTING):
          return [
            {
              text: "キャンセル",
              className: "sub",
              onClick: this._onCancelClicked,
            },
            {
              text: "作成",
              onClick: this._onCreateClicked,
            },
          ];
        case (MODAL_SCENE.RENDERING):
          return [
            {
              text: "キャンセル",
              className: "sub",
              onClick: this._onCancelClicked,
            },
            {
              text: "作成",
              className: "disabled",
            },
          ];
        case (MODAL_SCENE.RENDERED):
          return [
            {
              text: "終了",
              onClick: this._onDoneClicked,
            },
          ];
      }
    };

    const modalContent = (scene) => {
      switch (scene) {
        case (MODAL_SCENE.SETTING):
          return <div className="render-gif-modal setting">

          </div>;
        case (MODAL_SCENE.RENDERING):
          return <div className="render-gif-modal rendering">

          </div>;
        case (MODAL_SCENE.RENDERED):
          return <div className="render-gif-modal rendered">

          </div>;
      }
    };

    return (
      <Modal title={title}
             footer={ <ModalButtonSet content={buttonContent(this.state.modalScene)} /> }>
        {modalContent(this.state.modalScene)}
      </Modal>
    )
  },

  _onCancelClicked() {
    Actions.updateModal(null);
    if (this.props.onCancelClicked) {
      this.props.onCancelClicked();
    }
  },

  _onCreateClicked() {
    // TODO: use exportGIF
  },

  _onDoneClicked() {
    Actions.updateModal(null);
    if (this.props.onDoneClicked) {
      this.props.onDoneClicked();
    }
  },
});

export default RenderGIFModal;
