"use strict";

import Mousetrap              from "mousetrap";
import _Lang                  from "lodash/lang";

export default (events) => {
  Mousetrap.reset();
  if (_Lang.isObject(events)) {
    Object.keys(events).forEach((k) => {
      Mousetrap.bind(k, events[k]);
    });
  }
};
