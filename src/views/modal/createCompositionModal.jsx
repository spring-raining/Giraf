"use strict";

import React                                    from "react";

import Actions                                  from "src/actions/actions";
import {Composition}                            from "src/stores/model/composition";
import {Text, Number}                           from "src/views/forms";
import {Modal, ModalButtonSet}                  from "src/views/modal";
import genUUID                                  from "src/utils/genUUID";


const CreateCompositionModal = React.createClass({
  propTypes() {
    return {
      onCancelClicked: React.PropTypes.func,
      onCreateClicked: React.PropTypes.func,
    };
  },

  getInitialState() {
    return {
      compName: "New Composition",
      compWidth: 400,
      compHeight: 300,
      compFrame: 48,
      compFPS: 12,
    };
  },

  render() {
    const title = "新しいコンポジションを作成";

    const buttonContent = [
      {
        text: "キャンセル",
        className: "sub",
        onClick: () => {
          Actions.updateModal(null);
          if (this.props.onCancelClicked) {
            this.props.onCancelClicked();
          }
        },
      }, {
        text: "作成",
        onClick: () => {
          Actions.updateModal(null);
          if (this.props.onCreateClicked) {
            this.props.onCreateClicked(
              new Composition(
                genUUID(),
                this.state.compName,
                this.state.compWidth,
                this.state.compHeight,
                this.state.compFrame,
                this.state.compFPS)
            );
          }
        },
      },
    ];

    return (
      <Modal title={title}
             footer={ <ModalButtonSet content={buttonContent} /> }
             className="small">
        <div className="create-composition-modal">
          <div className="create-composition-modal__settings">
            <div className="create-composition-modal__input">
              <div className="create-composition-modal__input__left">
                コンポジション名
              </div>
              <div className="create-composition-modal__input__right">
                <Text value={this.state.compName}
                      onChange={this._onCompNameChanged} />
              </div>
            </div>
            <div className="create-composition-modal__input">
              <div className="create-composition-modal__input__left">
                幅
              </div>
              <div className="create-composition-modal__input__right">
                <Number value={this.state.compWidth}
                        min={1}
                        step={1}
                        onChange={this._onCompWidthChanged} />
              </div>
            </div>
            <div className="create-composition-modal__input">
              <div className="create-composition-modal__input__left">
                高さ
              </div>
              <div className="create-composition-modal__input__right">
                <Number value={this.state.compHeight}
                        min={1}
                        step={1}
                        onChange={this._onCompHeightChanged} />
              </div>
            </div>
            <div className="create-composition-modal__input">
              <div className="create-composition-modal__input__left">
                フレーム数
              </div>
              <div className="create-composition-modal__input__right">
                <Number value={this.state.compFrame}
                        min={1}
                        step={1}
                        onChange={this._onCompFrameChanged} />
              </div>
            </div>
            <div className="create-composition-modal__input">
              <div className="create-composition-modal__input__left">
                フレームレート
              </div>
              <div className="create-composition-modal__input__right">
                <Number value={this.state.compFPS}
                        min={1}
                        max={30}
                        step={1}
                        onChange={this._onCompFPSChanged} />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  },

  _onCompNameChanged(value) {
    this.setState({
      compName: value,
    });
  },

  _onCompWidthChanged(value) {
    this.setState({
      compWidth: value,
    });
  },

  _onCompHeightChanged(value) {
    this.setState({
      compHeight: value,
    });
  },

  _onCompFrameChanged(value) {
    this.setState({
      compFrame: value,
    });
  },

  _onCompFPSChanged(value) {
    this.setState({
      compFPS: value,
    });
  },
});

export default CreateCompositionModal;
