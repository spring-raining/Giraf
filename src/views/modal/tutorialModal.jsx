"use strict";

import React                                    from "react";
import {FormattedMessage}                       from "react-intl";

import {Modal, ModalButtonSet}                  from "src/views/modal";


const TutorialModal = React.createClass({
  render() {
    const title = <FormattedMessage id="views.modal.tutorial_modal.title"
                                    defaultMessage="Easy 3-step to create GIF" />;

    return (
      <Modal title={title}>
        <div className="tutorial-modal pretty"
             style={{ display: "flex" }}>
          <div className="tutorial-modal__step">
            <img src="rsc/step1.png" />
            <h3>Step 1</h3>
            <p>
              <FormattedMessage id="views.modal.tutorial_modal.step_1"
                                defaultMessage="Import the mp4/GIF/image files" />
            </p>
          </div>
          <div className="tutorial-modal__step">
            <img src="rsc/step2.png" />
            <h3>Step 2</h3>
            <p>
              <FormattedMessage id="views.modal.tutorial_modal.step_2"
                                defaultMessage="Drop the imported footage on here" />
            </p>
          </div>
          <div className="tutorial-modal__step">
            <img src="rsc/step3.png" />
            <h3>Step 3</h3>
            <p>
              <FormattedMessage id="views.modal.tutorial_modal.step_3"
                                defaultMessage="Edit and create the GIF!" />
            </p>
          </div>
        </div>
      </Modal>
    );
  },
});

export default TutorialModal;
