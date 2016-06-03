"use strict";

import Decimal                    from "decimal.js";

export function round(n, step = 1) {
  return new Decimal(n + "")
    .toNearest(step)
    .toNumber();
}

export default {
  round: round,
};
