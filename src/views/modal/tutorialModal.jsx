"use strict";

import React                                    from "react";

import {Modal, ModalButtonSet}                  from "src/views/modal";


const TutorialModal = React.createClass({
  render() {
    const title = "3ステップでかんたんGIF作成";

    return (
      <Modal title={title}>
        <div className="tutorial-modal pretty"
             style={{ display: "flex" }}>
          <div className="tutorial-modal__step">
            <img src="rsc/step1.png" />
            <h3>Step 1</h3>
            <p>mp4/GIFアニメ/画像を読み込む</p>
          </div>
          <div className="tutorial-modal__step">
            <img src="rsc/step2.png" />
            <h3>Step 2</h3>
            <p>読み込んだ素材をここにドラッグ</p>
          </div>
          <div className="tutorial-modal__step">
            <img src="rsc/step3.png" />
            <h3>Step 3</h3>
            <p>編集してGIFを作成！</p>
          </div>
        </div>
      </Modal>
    );
  },
});

export default TutorialModal;
