"use strict";

import Dispatcher from "../dispatcher";
import ActionConst from "./const";
import GenUUID from "../utils/genUUID";
import SelectFile from "../utils/selectFile";
import {hasTrait} from "../utils/traitUtils";
import _Selectable from "../stores/model/_selectable";
import Composition from "../stores/model/composition";
import Layer from "../stores/model/layer";
import File from "../stores/model/file";
import {DragAction, DragActionType} from "../stores/model/dragAction";


export default {
  importFile(file = null) {
    if (file) {
      Dispatcher.dispatch({
        actionType: ActionConst.IMPORT_FILE,
        file: file
      });
    }
    else {
      SelectFile.run((f) => {
        let files = [];
        for (let i=0; i < f.length; i++) files.push(f[i]);
        Dispatcher.dispatch({
          actionType: ActionConst.IMPORT_FILE,
          file: files
        })
      });
    }
  },

  updateFile(file) {
    Dispatcher.dispatch({
      actionType: ActionConst.UPDATE_FILE,
      file: file
    });
  },

  changeSelectingItem(item) {
    if (item === null || hasTrait(item, _Selectable)) {
      Dispatcher.dispatch({
        actionType: ActionConst.CHANGE_SELECTING_ITEM,
        item: item
      })
    }
  },

  createComposition(composition = null) {
    let comp = (composition !== null)? composition
      : new Composition(GenUUID(), "new composition", 400, 300, 48, 12);
    if (comp instanceof Composition) {
      Dispatcher.dispatch({
        actionType: ActionConst.CREATE_COMPOSITION,
        composition: comp
      });
    }
  },

  updateComposition(composition) {
    if (composition instanceof Composition) {
      Dispatcher.dispatch({
        actionType: ActionConst.UPDATE_COMPOSITION,
        composition: composition
      });
    }
  },

  createLayer(parentComp, index = 0, footage = null) {
    let lyr = (footage !== null && footage instanceof Layer)? footage
      : (footage !== null)?
        new Layer(GenUUID(), footage.name, parentComp.id, footage, {}, 0, 30)
      : new Layer(GenUUID(), "new layer", parentComp.id, null, {}, 0, 30);
    if (lyr instanceof Layer) {
      Dispatcher.dispatch({
        actionType: ActionConst.CREATE_LAYER,
        layer: lyr,
        index: index
      });
    }
  },

  updateLayer(layer) {
    if (layer instanceof Layer) {
      Dispatcher.dispatch({
        actionType: ActionConst.UPDATE_LAYER,
        layer: layer
      });
    }
  },

  startDrag(dragObj) {
    let dragAction = (dragObj instanceof DragAction)? dragObj : null;
    if (!dragAction) {
      let type = (dragObj instanceof File) ? DragActionType.FILE
        : (dragObj instanceof Composition) ? DragActionType.COMPOSITION
        : (dragObj instanceof Layer) ?       DragActionType.LAYER
        : null;
      if (type) {
        dragAction = new DragAction(type, dragObj);
      }
    }
    if (dragAction) {
      Dispatcher.dispatch({
        actionType: ActionConst.START_DRAG,
        dragAction: dragAction
      });
    }
  },

  endDrag() {
    Dispatcher.dispatch({
      actionType: ActionConst.END_DRAG
    });
  },

  updateCurrentFrame(frame) {
    if (frame === null || typeof(frame) === "number") {
      Dispatcher.dispatch({
        actionType: ActionConst.UPDATE_CURRENT_FRAME,
        currentFrame: frame
      });
    }
  },
};
