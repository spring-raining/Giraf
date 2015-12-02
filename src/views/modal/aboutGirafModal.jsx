"use strict";

import React                                    from "react";

import pkg                                      from "package.json";
import Actions                                  from "src/actions/actions";
import {Modal, ModalButtonSet}                  from "src/views/modal";


const AboutGirafModal = React.createClass({
  render() {
    const title = "Girafについて";

    const buttonContent = [
      {
        text: "閉じる",
        onClick: () => {
          Actions.updateModal(null);
        },
      },
    ];

    return (
      <Modal title={title}
             footer={ <ModalButtonSet content={buttonContent} /> }
             className="small">
        <h2>Giraf 2</h2>
        <p>Version: {pkg.version}</p>
        <p>{pkg.copyright}</p>
      </Modal>
    );
  },
});

export default AboutGirafModal;
