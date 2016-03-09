"use strict";

import React                                    from "react";
import {FormattedMessage}                       from "react-intl";

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

  getKeyEvents() {
    return {
      "enter": this._onSubmit,
    };
  },

  render() {
    const title = <FormattedMessage id="views.modal.create_composition_modal.title"
                                    defaultMessage="Create New Composition" />;

    const buttonContent = [
      {
        text: <FormattedMessage id="views.modal.create_composition_modal.cancel"
                                defaultMessage="Cancel" />,
        className: "sub",
        onClick: this._onCancel,
      }, {
        text: <FormattedMessage id="views.modal.create_composition_modal.create"
                                defaultMessage="Create" />,
        onClick: this._onSubmit,
      },
    ];

    return (
      <Modal title={title}
             footer={ <ModalButtonSet content={buttonContent} /> }
             keyEvents={this.getKeyEvents()}
             className="small">
        <div className="create-composition-modal">
          <div className="create-composition-modal__settings">
            <div className="create-composition-modal__input">
              <div className="create-composition-modal__input__left">
                <FormattedMessage id="views.modal.create_composition_modal.composition_name"
                                  defaultMessage="Composition Name" />
              </div>
              <div className="create-composition-modal__input__right">
                <Text value={this.state.compName}
                      onChange={this._onCompNameChanged} />
              </div>
            </div>
            <div className="create-composition-modal__input">
              <div className="create-composition-modal__input__left">
                <FormattedMessage id="views.modal.create_composition_modal.width"
                                  defaultMessage="Width" />
              </div>
              <div className="create-composition-modal__input__right">
                <Number value={this.state.compWidth}
                        min={1}
                        step={1}
                        suffixString="px"
                        onChange={this._onCompWidthChanged} />
              </div>
            </div>
            <div className="create-composition-modal__input">
              <div className="create-composition-modal__input__left">
                <FormattedMessage id="views.modal.create_composition_modal.height"
                                  defaultMessage="Height" />
              </div>
              <div className="create-composition-modal__input__right">
                <Number value={this.state.compHeight}
                        min={1}
                        step={1}
                        suffixString="px"
                        onChange={this._onCompHeightChanged} />
              </div>
            </div>
            <div className="create-composition-modal__input">
              <div className="create-composition-modal__input__left">
                <FormattedMessage id="views.modal.create_composition_modal.number_of_frames"
                                  defaultMessage="Number of Frames" />
              </div>
              <div className="create-composition-modal__input__right">
                <Number value={this.state.compFrame}
                        min={1}
                        step={1}
                        suffixString="frame"
                        onChange={this._onCompFrameChanged} />
              </div>
            </div>
            <div className="create-composition-modal__input">
              <div className="create-composition-modal__input__left">
                <FormattedMessage id="views.modal.create_composition_modal.frame_rate"
                                  defaultMessage="Frame Rate" />
              </div>
              <div className="create-composition-modal__input__right">
                <Number value={this.state.compFPS}
                        min={1}
                        max={30}
                        step={1}
                        suffixString="fps"
                        onChange={this._onCompFPSChanged} />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  },

  _onSubmit() {
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
    return false;
  },

  _onCancel() {
    Actions.updateModal(null);
    if (this.props.onCancelClicked) {
      this.props.onCancelClicked();
    }
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
