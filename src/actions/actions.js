"use strict";

import _Utility                       from "lodash/utility";

import Dispatcher                     from "src/dispatcher/dispatcher";
import ActionConst                    from "src/actions/const";
import createCompositionAsync         from "src/actions/task/createCompositionAsync";
import createLayerAsync               from "src/actions/task/createLayerAsync";
import renderGIFAsync                 from "src/actions/task/renderGIFAsync";
import FileLoader                     from "src/utils/fileLoader";
import genUUID                        from "src/utils/genUUID";
import SelectFile                     from "src/utils/selectFile";
import {hasTrait}                     from "src/utils/traitUtils";
import {renderFrameAsync, renderFrameAutomatically as autoRender}
                                      from "src/utils/renderUtils";
import Store                          from "src/stores/store";
import _Selectable                    from "src/stores/model/_selectable";
import {Composition}                  from "src/stores/model/composition";
import {Layer}                        from "src/stores/model/layer";
import {Footage}                      from "src/stores/model/footage";
import {DragAction, DragActionType}   from "src/stores/model/dragAction";
import {Point}                        from "src/stores/model/point";
import {Transform}                    from "src/stores/model/transform"
import {Alert}                        from "src/stores/model/alert";


export default {
  changeActiveItem: changeActiveItem,
  changeEditingComposition: changeEditingComposition,
  changeEditingLayer: changeEditingLayer,
  changeSelectingItem: changeSelectingItem,
  clearFrameCache: clearFrameCache,
  createComposition: createComposition,
  createCompositionWithFootage: createCompositionWithFootage,
  createLayer: createLayer,
  deleteAlert: deleteAlert,
  deleteLayer: deleteLayer,
  deleteSelectingItem: deleteSelectingItem,
  endDrag: endDrag,
  goBackwardCurrentFrame: goBackwardCurrentFrame,
  goForwardCurrentFrame: goForwardCurrentFrame,
  importFile: importFile,
  pause: pause,
  play: play,
  pushAlert: pushAlert,
  redo: redo,
  renderFrame: renderFrame,
  renderFrameAutomatically: renderFrameAutomatically,
  renderGIF: renderGIF,
  startDrag: startDrag,
  togglePlay: togglePlay,
  undo: undo,
  updateComposition: updateComposition,
  updateCurrentFrame: updateCurrentFrame,
  updateExpandingMenuId: updateExpandingMenuId,
  updateFootage: updateFootage,
  updateLayer: updateLayer,
  updateModal: updateModal,
}

export function changeActiveItem(item) {
  if (item === null || hasTrait(item, _Selectable)) {
    Dispatcher.dispatch({
      actionType: ActionConst.CHANGE_ACTIVE_ITEM,
      item: item,
    });
  }
}

export function changeEditingComposition(composition) {
  if (composition === null || composition instanceof Composition) {
    changeActiveItem(composition);
  }
}

export function changeEditingLayer(layer) {
  if (layer === null || layer instanceof Layer) {
    changeSelectingItem(layer);
  }
}

export function changeSelectingItem(item) {
  if (item === null || hasTrait(item, _Selectable)) {
    Dispatcher.dispatch({
      actionType: ActionConst.CHANGE_SELECTING_ITEM,
      item: item
    });
  }
}

export function clearFrameCache(composition, frames=null) {
  let _frames = frames;
  if (frames === null) {
    _frames = [];
    for (let i=0; i < composition.frame; i++) {
      _frames.push(i);
    }
  }
  if (typeof(frames) === "number") {
    _frames = [frames];
  }
  if (_frames instanceof Array) {
    Dispatcher.dispatch({
      actionType: ActionConst.CLEAR_FRAME_CACHE,
      composition: composition,
      frames: _frames.filter((e) => e >= 0 && e < composition.frame),
    })
  }
}

export function createComposition(composition = null) {
  if (composition instanceof Composition) {
    Dispatcher.dispatch({
      actionType: ActionConst.CREATE_COMPOSITION,
      composition: composition,
    });
  }
  else {
    createCompositionAsync().then(
      (result) => {
        Dispatcher.dispatch({
          actionType: ActionConst.CREATE_COMPOSITION,
          composition: result,
        });
      },
      (error) => {
        if (error) {
          if (error instanceof Alert) {
            pushAlert(error);
          }
          else {
            console.error(error);
            console.warn("Failed to create composition.")
          }
        }
      }
    )
  }
}

export function createCompositionWithFootage(footage) {
  if (!(footage instanceof Footage)) {
    return;
  }
  const comp = new Composition(
    genUUID(),
    footage.name,
    footage.width,
    footage.height,
    48,
    12
  );
  createLayerAsync(comp, footage).then(
    (result) => {
      comp.update({
        frame: result.layerEnd,
      });
      Dispatcher.dispatch({
        actionType: ActionConst.CREATE_COMPOSITION,
        composition: comp,
      });
      Dispatcher.dispatch({
        actionType: ActionConst.CREATE_LAYER,
        layer: result,
        index: 0,
      });
    },
    (error) => {
      if (error) {
        if (error instanceof Alert) {
          pushAlert(error);
        }
        else {
          console.error(error);
          console.warn("Failed to create layer");
        }
      }
      pushAlert();
    }
  );
}

export function createLayer(parentComp, index = 0, entity = null) {
  if (entity instanceof Layer) {
    Dispatcher.dispatch({
      actionType: ActionConst.CREATE_LAYER,
      layer: entity,
      index: index,
    });
    clearFrameCache(parentComp, _Utility.range(entity.layerStart, entity.layerEnd));
  }
  else {
    createLayerAsync(parentComp, entity).then(
      (result) => {
        Dispatcher.dispatch({
          actionType: ActionConst.CREATE_LAYER,
          layer: result,
          index: index,
        });
        clearFrameCache(parentComp, _Utility.range(result.layerStart, result.layerEnd));
      },
      (error) => {
        if (error) {
          if (error instanceof Alert) {
            pushAlert(error);
          }
          else {
            console.error(error);
            console.warn("Failed to create layer");
          }
        }
      }
    );
  }
}

export function deleteAlert(alert) {
  if (alert instanceof Alert) {
    Dispatcher.dispatch({
      actionType: ActionConst.DELETE_ALERT,
      alert: alert,
    });
  }
}

export function deleteLayer(layer) {
  if (layer instanceof Layer) {
    Dispatcher.dispatch({
      actionType: ActionConst.DELETE_LAYER,
      layer: layer,
    });
  }
}

export function deleteSelectingItem() {
  const item = Store.get("selectingItem");
  if (item instanceof Layer) {
    deleteLayer(item);
  }
}

export function endDrag() {
  Dispatcher.dispatch({
    actionType: ActionConst.END_DRAG
  });
}

export function goBackwardCurrentFrame(frame = 1) {
  goForwardCurrentFrame(-frame);
}

export function goForwardCurrentFrame(frame = 1) {
  if (frame === null || typeof(frame) === "number") {
    const activeItem = Store.get("activeItem");
    const comp = (activeItem instanceof Composition)? activeItem : null;
    const fr = (Store.get("currentFrame") || 0) + frame;
    if (comp) {
      updateCurrentFrame(
        Math.max(0, Math.min(comp.frame - 1, fr))
      );
    }
  }
}

export function importFile(fileList = null) {
  new Promise((resolve) => {
    if (fileList) {
      resolve(fileList);
    }
    else {
      SelectFile.run((f) => resolve(f));
    }
  }).then((fileList) => {
    for (let i=0; i < fileList.length; i++) {
      const file = fileList[i];
      const footage = new Footage(genUUID(), file.name, file.size, file.type);
      FileLoader.run(footage, file).then(
        () => {
          Dispatcher.dispatch({
            actionType: ActionConst.IMPORT_FILE,
            footage: footage,
          });
        },
        (error) => {
          if (error instanceof Alert) {
            pushAlert(error);
          }
          else {
            console.error(error);
            console.warn("Failed to load file : ", file);
          }
        }
      );
    }
  });
}

export function pause() {
  play(false);
}

export function play(play = true) {
  if (typeof(play) !== "boolean") {
    return;
  }
  Dispatcher.dispatch({
    actionType: ActionConst.PLAY,
    play: play,
  });
}

export function pushAlert(alert) {
  if (alert instanceof Alert) {
    Dispatcher.dispatch({
      actionType: ActionConst.PUSH_ALERT,
      alert: alert,
    });
  }
}

export function redo(repeat = 1) {
  if (typeof(repeat) !== "number" || repeat < 1) {
    return;
  }
  Dispatcher.dispatch({
    actionType: ActionConst.REDO,
    repeat: repeat,
  });
}

export function renderFrame(composition, frame) {
  if (!(composition instanceof Composition)) {
    return;
  }
  renderFrameAsync(composition, frame).then(
    (result) => {
      Dispatcher.dispatch({
        actionType: ActionConst.RENDER_FRAME,
        canvas: result,
        composition: composition,
        frame: frame,
      });
    },
    (error) => {
      console.error(error);
      console.warn("Rendering failed", composition.name);
    }
  );
}

export function renderFrameAutomatically(composition) {
  let firstFrame = Store.get("currentFrame");
  if (firstFrame === null) {
    updateCurrentFrame(0);
    firstFrame = 0;
  }

  autoRender(
    composition,
    firstFrame,
    (frame) => {
      updateCurrentFrame(frame)
    },
    (canvas, frame) => {
      Dispatcher.dispatch({
        actionType: ActionConst.RENDER_FRAME,
        canvas: canvas,
        composition: composition,
        frame: frame,
      });
    },
    (error) => {
      console.error(error);
      console.warn("Rendering failed", composition);
    });
}

export function renderGIF(composition) {
  if (!(composition instanceof Composition)) {
    return;
  }
  renderGIFAsync(composition).then(
    (result) => {},
    (error) => {
      if (error) {
        if (error instanceof Alert) {
          pushAlert(error);
        }
        else {
          console.error(error);
          console.warn("Failed to render GIF", composition);
        }
      }
    }
  );
}

export function startDrag(dragObj) {
  let dragAction = (dragObj instanceof DragAction)? dragObj : null;
  if (!dragAction) {
    let type = (dragObj instanceof Footage) ? DragActionType.FOOTAGE
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
}

export function togglePlay() {
  let isPlaying = Store.get("isPlaying");
  play(!isPlaying);
}

export function undo(repeat = 1) {
  if (typeof(repeat) !== "number" || repeat < 1) {
    return;
  }
  Dispatcher.dispatch({
    actionType: ActionConst.UNDO,
    repeat: repeat,
  });
}

export function updateComposition(composition, refreshFrameCache = true) {
  if (composition instanceof Composition) {
    Dispatcher.dispatch({
      actionType: ActionConst.UPDATE_COMPOSITION,
      composition: composition
    });
  }
  if (refreshFrameCache) {
    clearFrameCache(composition);
  }
}

export function updateCurrentFrame(frame) {
  if (frame === null || typeof(frame) === "number") {
    Dispatcher.dispatch({
      actionType: ActionConst.UPDATE_CURRENT_FRAME,
      currentFrame: frame
    });
  }
}

export function updateExpandingMenuId(id) {
  Dispatcher.dispatch({
    actionType: ActionConst.UPDATE_EXPANDING_MENU_ID,
    id: id,
  });
}

export function updateFootage(footage) {
  Dispatcher.dispatch({
    actionType: ActionConst.UPDATE_FOOTAGE,
    footage: footage
  });
}

export function updateLayer(layer, refreshFrameCache = true) {
  if (layer instanceof Layer) {
    Dispatcher.dispatch({
      actionType: ActionConst.UPDATE_LAYER,
      layer: layer
    });
    let parentComp = Store.get("compositions")
      .filter((e) => e.id === layer.parentCompId)[0];
    if (refreshFrameCache) {
      clearFrameCache(parentComp, _Utility.range(layer.layerStart, layer.layerEnd));
    }
  }
}

export function updateModal(modal) {
  if (Store.get("modal") !== modal) {
    play(false);
  }
  Dispatcher.dispatch({
    actionType: ActionConst.UPDATE_MODAL,
    modal: modal,
  });
}

function _createCanvasWithRenderedFrame(composition, frame) {
  return new Promise((resolve,reject) => {
    try {
      let canvas = document.createElement("canvas");
      canvas.width = composition.width;
      canvas.height = composition.height;
      let ctx = canvas.getContext("2d");

      composition.render(frame).then(
        (result) => {
          ctx.drawImage(result, 0, 0);
          resolve(canvas);
        },
        (error) => {
          throw error;
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}
