"use strict";

import Dispatcher                     from "src/dispatcher";
import ActionConst                    from "src/actions/const";
import GenUUID                        from "src/utils/genUUID";
import SelectFile                     from "src/utils/selectFile";
import {hasTrait}                     from "src/utils/traitUtils";
import _Selectable                    from "src/stores/model/_selectable";
import {Composition}                  from "src/stores/model/composition";
import {Layer}                        from "src/stores/model/layer";
//import {Footage}                      from "src/stores/model/footage";
import F                              from "src/stores/model/footage";
import {DragAction, DragActionType}   from "src/stores/model/dragAction";


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

  updateFootage(footage) {
    Dispatcher.dispatch({
      actionType: ActionConst.UPDATE_FOOTAGE,
      footage: footage
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

  createLayer(parentComp, index = 0, entity = null) {
    let lyr = (entity !== null && entity instanceof Layer)? entity
      : (entity !== null)?
        new Layer(GenUUID(), entity.name, parentComp.id, entity, {}, 0, 30)
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
      let type = (dragObj instanceof F.Footage) ? DragActionType.FOOTAGE
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
