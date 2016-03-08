"use strict";

import React                      from "react";
import ReactDOM                   from "react-dom";
import {addLocaleData, IntlProvider} from "react-intl";
import enLocaleData               from "react-intl/lib/locale-data/en";
import App                        from "src/views/app";


addLocaleData(enLocaleData);

ReactDOM.render(
  <IntlProvider locale="en">
    <App />
  </IntlProvider>,
  document.getElementById("app")
);
