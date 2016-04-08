"use strict";

import React                                    from "react";
import {FormattedMessage}                       from "react-intl";
import keyMirror                                from "keymirror";

import Actions                                  from "src/actions/actions";
import {Composition}                            from "src/stores/model/composition";
import {Modal, ModalButtonSet}                  from "src/views/modal";
import {Number, Progress}                       from "src/views/forms";
import {renderFrameAsync}                       from "src/utils/renderUtils";
import formatByte                               from "src/utils/formatByte";
import writeGIF                                 from "src/utils/writeGIF";
import dataURLToBlob                            from "src/utils/dataURLToBlob";
import saveFile                                 from "src/utils/saveFile";


const MODAL_SCENE = keyMirror({
  SETTING: null,
  RENDERING: null,
  RENDERED: null,
});

const createImgAsync = (blob) => {
  return new Promise((resolve, reject) => {
    try {
      const img = document.createElement("img");
      img.onload = () => {
        resolve(img);
      };
      img.src = blob;
    } catch (e) {
      reject(e);
    }
  });
};

const RenderGIFModal = React.createClass({

  // When this component is unmounted, it will become false.
  alive: true,

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
      previewFrame: 0,
      renderedCanvases: {},
      renderAborted: false,
      progress: 0,
      resultGIF: null,
      resultGIFImg: null,
    };
  },

  componentDidMount() {
    const composition = this.props.composition;

    // Render frame on background
    const render = (frame) => {
      return new Promise((resolve, reject) => {
        if (!this.alive) {
          return reject();
        }
        renderFrameAsync(composition, frame).then(
          (result) => {
            const r = {};
            r[frame] = result;
            this.setState({
              renderedCanvases: Object.assign(this.state.renderedCanvases, r),
              progress: (frame + 1) / composition.frame,
            });
            if (frame + 1 < composition.frame) {
              resolve(frame + 1);
            }
            else {
              reject();
            }
          },
          (error) => {
            this.setState({
              renderAborted: true,
            });
            console.error(error);
            console.warn("Failed to render frame : " + frame);
            reject();
          }
        )
      });
    };
    render(0).then(
      function loop(frame) {
        return render(frame).then(
          loop,
          (error) => {
            // stopped
          }
        );
      }
    );

    // Frame timer
    const timer = (frame) => {
      return new Promise((resolve, reject) => {
        if (!this.alive) {
          return reject();
        }
        new Promise((resolve_) => {
          setTimeout(resolve_, 1000 / this.state.gifFPS);
        }).then(() => {
          this.setState({
            previewFrame: frame,
          });
          const nextFrame = (frame + 1 >= this.state.gifStart
                          && frame + 1 <  this.state.gifEnd)
              ? frame + 1
              : this.state.gifStart;
          resolve(nextFrame);
        });
      });
    };
    timer(this.state.gifStart).then(
      function loop(frame) {
        return timer(frame).then(
          loop,
          (error) => {
            // stopped
          }
        )
      }
    )
  },

  componentDidUpdate() {
    const composition = this.props.composition;
    const flush = (dom) => {
      while (dom.firstChild) {
        dom.removeChild(dom.firstChild);
      }
    };

    // update preview DOM
    const previewCanvasDOM = this.refs.previewCanvasContainer;
    if (previewCanvasDOM) {
      flush(previewCanvasDOM);
      const canvas = this.state.renderedCanvases[this.state.previewFrame];
      if (canvas) {
        previewCanvasDOM.appendChild(canvas);
        const width = this.state.gifSize;
        const height = Math.round(composition.height * this.state.gifSize / composition.width);
        const font = Math.min(100, height - 30);
        previewCanvasDOM.style.width = `${width}px`;
        previewCanvasDOM.style.height = `${height}px`;
        previewCanvasDOM.style.lineHeight = `${height}px`;
        previewCanvasDOM.style.fontSize = `${font}px`;
      }
    }
    const previewGIFDOM = this.refs.previewGIFContainer;
    if (previewGIFDOM) {
      if (!previewGIFDOM.firstChild
      ||  previewGIFDOM.firstChild !== this.state.resultGIFImg) {
        flush(previewGIFDOM);
        previewGIFDOM.appendChild(this.state.resultGIFImg);
      }
    }
  },

  componentWillUnmount() {
    // out of control
    this.alive = false;
  },

  getKeyEvents() {
    return {
      "enter": () => {
        if (this.state.modalScene === MODAL_SCENE.SETTING
        &&  this._canCreateGIF()) {
          this._onCreateClicked();
        }
        return false;
      },
    };
  },

  render() {
    const title = <FormattedMessage id="views.modal.render_gif_modal.title"
                                    defaultMessage="Create GIF" />;

    const footer = (
      <div className="render-gif-modal-footer-content">
        <Progress value={this.state.progress} max={1} />
        <ModalButtonSet content={this._buttonContent()} />
      </div>
    );

    return (
      <Modal title={title}
             footer={footer}
             keyEvents={this.getKeyEvents()}>
        {this._modalContent()}
      </Modal>
    )
  },

  _buttonContent() {
    switch (this.state.modalScene) {
      case (MODAL_SCENE.SETTING):
        return (this._canCreateGIF())
          ? [
              {
                text: <FormattedMessage id="views.modal.render_gif_modal.cancel"
                                        defaultMessage="Cancel" />,
                className: "sub",
                onClick: this._onCancelClicked,
              },
              {
                text: <FormattedMessage id="views.modal.render_gif_modal.create_gif"
                                        defaultMessage="Create GIF" />,
                onClick: this._onCreateClicked,
              },
            ]
          : [
              {
                text: <FormattedMessage id="views.modal.render_gif_modal.cancel"
                                        defaultMessage="Cancel" />,
                className: "sub",
                onClick: this._onCancelClicked,
              },
              {
                text: <FormattedMessage id="views.modal.render_gif_modal.rendering"
                                        defaultMessage="Rendering..." />,
                className: "disabled",
              },
            ];
      case (MODAL_SCENE.RENDERING):
        return [
          {
            text: <FormattedMessage id="views.modal.render_gif_modal.cancel"
                                    defaultMessage="Cancel" />,
            className: "sub",
            onClick: this._onCancelClicked,
          },
          {
            text: <FormattedMessage id="views.modal.render_gif_modal.generating_gif"
                                    defaultMessage="Generating GIF..." />,
            className: "disabled",
          },
        ];
      case (MODAL_SCENE.RENDERED):
        return [
          {
            text: <FormattedMessage id="views.modal.render_gif_modal.create_again"
                                    defaultMessage="Create again" />,
            onClick: this._onReRenderClicked,
          },
          {
            text: <FormattedMessage id="views.modal.render_gif_modal.finish"
                                    defaultMessage="Finish" />,
            onClick: this._onDoneClicked,
          },
        ];
    }
  },

  _modalContent() {
    const previewGIF = (() => {
      switch (this.state.modalScene) {
        case (MODAL_SCENE.SETTING):
          return (
            <div className="render-gif-modal__preview">
              <div className="render-gif-modal__preview__canvas-container"
                   ref="previewCanvasContainer">
              </div>
              <div className="render-gif-modal__preview__frame">
                {this.state.previewFrame + 1}
              </div>
            </div>
          );
        case (MODAL_SCENE.RENDERING):
          return (
            <div className="render-gif-modal__preview">
              <div className="render-gif-modal__preview__canvas-container"
                   ref="previewCanvasContainer">
              </div>
              <div className="render-gif-modal__preview__gif-description">
                <FormattedMessage id="views.modal.render_gif_modal.generating_now"
                                  defaultMessage="Generating now..." />
              </div>
            </div>
          );
        case (MODAL_SCENE.RENDERED):
          return (
            <div className="render-gif-modal__preview">
              <div className="render-gif-modal__preview__gif-container"
                   onClick={this._saveGIF}
                   ref="previewGIFContainer">
              </div>
              <div className="render-gif-modal__preview__gif-description">
                <FormattedMessage id="views.modal.render_gif_modal.generating_finished"
                                  defaultMessage="Generating Finished" />
                 : {formatByte(this.state.resultGIF.size)}
              </div>
            </div>
          );
      }
    })();

    switch (this.state.modalScene) {

      case (MODAL_SCENE.SETTING):
        return (
          <div className="render-gif-modal">
            {previewGIF}
            <div className="render-gif-modal__settings">
              <div className="render-gif-modal__input">
                <div className="render-gif-modal__input__left">
                  <FormattedMessage id="views.modal.render_gif_modal.start_frame_of_output_gif"
                                    defaultMessage="Start Frame of Output GIF" />
                </div>
                <div className="render-gif-modal__input__right">
                  <Number value={this.state.gifStart + 1}
                          min={1}
                          max={this.state.gifEnd}
                          step={1}
                          onChange={this._onGIFStartChanged} />
                </div>
              </div>
              <div className="render-gif-modal__input">
                <div className="render-gif-modal__input__left">
                  <FormattedMessage id="views.modal.render_gif_modal.end_frame_of_output_gif"
                                    defaultMessage="End Frame of Output GIF" />
                </div>
                <div className="render-gif-modal__input__right">
                  <Number value={this.state.gifEnd}
                          min={this.state.gifStart + 1}
                          max={this.props.composition.frame}
                          step={1}
                          onChange={this._onGIFEndChanged} />
                </div>
              </div>
              <div className="render-gif-modal__input">
                <div className="render-gif-modal__input__left">
                  <FormattedMessage id="views.modal.render_gif_modal.frame_rate_of_output_gif"
                                    defaultMessage="Frame Rate of Output GIF" />
                </div>
                <div className="render-gif-modal__input__right">
                  <Number value={this.state.gifFPS}
                          min={1}
                          max={30}
                          step={1}
                          suffixString="fps"
                          onChange={this._onGIFFPSChanged} />
                </div>
              </div>
              <div className="render-gif-modal__input">
                <div className="render-gif-modal__input__left">
                  <FormattedMessage id="views.modal.render_gif_modal.size_of_output_gif"
                                    defaultMessage="Size of Output GIF" />
                </div>
                <div className="render-gif-modal__input__right">
                  <Number value={this.state.gifSize}
                          min={10}
                          max={1000}
                          step={1}
                          suffixString="px"
                          onChange={this._onGIFSizeChanged} />
                </div>
              </div>
            </div>
          </div>
        );

      case (MODAL_SCENE.RENDERING):
      case (MODAL_SCENE.RENDERED):
        return (
          <div className="render-gif-modal">
            {previewGIF}
            <div className="render-gif-modal__settings">
              <div className="render-gif-modal__input">
                <div className="render-gif-modal__input__left">
                  <FormattedMessage id="views.modal.render_gif_modal.start_frame_of_output_gif"
                                    defaultMessage="Start Frame of Output GIF" />
                </div>
                <div className="render-gif-modal__input__right">
                  {this.state.gifStart + 1}
                </div>
              </div>
              <div className="render-gif-modal__input">
                <div className="render-gif-modal__input__left">
                  <FormattedMessage id="views.modal.render_gif_modal.end_frame_of_output_gif"
                                    defaultMessage="End Frame of Output GIF" />
                </div>
                <div className="render-gif-modal__input__right">
                  {this.state.gifEnd}
                </div>
              </div>
              <div className="render-gif-modal__input">
                <div className="render-gif-modal__input__left">
                  <FormattedMessage id="views.modal.render_gif_modal.frame_rate_of_output_gif"
                                    defaultMessage="Frame Rate of Output GIF" />
                </div>
                <div className="render-gif-modal__input__right">
                  {this.state.gifFPS} fps
                </div>
              </div>
              <div className="render-gif-modal__input">
                <div className="render-gif-modal__input__left">
                  <FormattedMessage id="views.modal.render_gif_modal.size_of_output_gif"
                                    defaultMessage="Size of Output GIF" />
                </div>
                <div className="render-gif-modal__input__right">
                  {this.state.gifSize} px
                </div>
              </div>
            </div>
          </div>
        );
    }
  },

  _onCancelClicked() {
    Actions.updateModal(null);
    if (this.props.onCancelClicked) {
      this.props.onCancelClicked();
    }
  },

  _onCreateClicked() {
    if (!this._canCreateGIF()) {
      return;
    }
    this.setState({
      modalScene: MODAL_SCENE.RENDERING,
      progress: 0,
    });

    let canvases = [];
    for (let i = this.state.gifStart; i < this.state.gifEnd; i++) {
      canvases.push(this.state.renderedCanvases[i]);
    }

    const width = this.state.gifSize;
    const height = Math.round(this.props.composition.height
                              * this.state.gifSize
                              / this.props.composition.width);
    const interval = 1 / this.state.gifFPS;

    writeGIF(canvases, width, height, interval, {
      progressCallback: (captureProgress) => {
        this.setState({
          progress: captureProgress,
        });
      },
    }).then(
      (result) => {
        this.setState({
          resultGIF: dataURLToBlob(result.image),
        });
        return createImgAsync(result.image);
      },
      (error) => {
        console.error(error);
        console.warn("Failed to write GIF.");
        this.setState({
          modalScene: MODAL_SCENE.SETTING,
        });
      }
    ).then(
      (result) => {
        this.setState({
          modalScene: MODAL_SCENE.RENDERED,
          resultGIFImg: result,
        });
      },
      (error) => {
        console.error(error);
        this.setState({
          modalScene: MODAL_SCENE.SETTING,
        });
      }
    );
  },

  _onDoneClicked() {
    Actions.updateModal(null);
    if (this.props.onDoneClicked) {
      this.props.onDoneClicked();
    }
  },

  _onReRenderClicked() {
    this.setState({
      modalScene: MODAL_SCENE.SETTING,
      resultGIF: null,
      resultGIFImg: null,
    });
  },

  _onGIFStartChanged(value) {
    if (this.state.modalScene === MODAL_SCENE.SETTING) {
      this.setState({
        gifStart: value - 1,
      });
    }
  },

  _onGIFEndChanged(value) {
    if (this.state.modalScene === MODAL_SCENE.SETTING) {
      this.setState({
        gifEnd: value,
      });
    }
  },

  _onGIFFPSChanged(value) {
    if (this.state.modalScene === MODAL_SCENE.SETTING) {
      this.setState({
        gifFPS: value,
      });
    }
  },

  _onGIFSizeChanged(value) {
    if (this.state.modalScene === MODAL_SCENE.SETTING) {
      this.setState({
        gifSize: value,
      });
    }
  },

  _canCreateGIF() {
    return this.props.composition.frame
           === Object.keys(this.state.renderedCanvases).length;
  },

  _saveGIF() {
    if (this.state.resultGIF) {
      saveFile(this.state.resultGIF,
               this.props.composition.name + ".gif");
    }
  },
});

export default RenderGIFModal;
