"use strict";

import React                                    from "react";

import Actions                                  from "src/actions/actions";
import {Composition}                            from "src/stores/model/composition";
import {Modal, ModalButtonSet}                  from "src/views/modal";
import genUUID                                  from "src/utils/genUUID";


const CreateCompositionModal = React.createClass({
  propTypes() {
    return {
      onCancelClicked: React.PropTypes.func,
      onCreateClicked: React.PropTypes.func,
    };
  },

  render() {
    const title = "新しいコンポジションを作成";

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
        text: "作成",
        onClick: () => {
          Actions.updateModal(null);
          if (this.props.onCreateClicked) {
            this.props.onCreateClicked(
              new Composition(genUUID(), "new composition", 400, 300, 48, 12)
            );
          }
        },
      },
    ];

    return (
      <Modal title={title}
             footer={ <ModalButtonSet content={buttonContent} /> }>
        コンポジションを作成します。
      </Modal>
    );
  },
});

export default CreateCompositionModal;
