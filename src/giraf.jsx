"use strict";

import React                      from "react";
import ReactDOM                   from "react-dom";
import {addLocaleData, IntlProvider} from "react-intl";
import enLocaleData               from "react-intl/lib/locale-data/en";
import jaLocaleData               from "react-intl/lib/locale-data/ja";

import App                        from "src/views/app";
import getUserLanguage            from "src/utils/getUserLanguage";


const localeData = {
  "en-US": enLocaleData,
  "ja-JP": jaLocaleData,
};

addLocaleData(enLocaleData);
try {
  const language = getUserLanguage();
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "lang/" + language + ".json");
  xhr.onload = (e) => {
    if (xhr.status === 200) {
      addLocaleData(localeData[language]);
      callback(language, JSON.parse(xhr.responseText));
    }
    else {
      callback(null, null);
    }
  };
  xhr.send();
} catch (e) {
  console.error(e);
  callback(null, null);
}

function callback(locale, messages) {
  ReactDOM.render(
    <IntlProvider locale={locale} messages={messages}>
      <App />
    </IntlProvider>,
    document.getElementById("app")
  );
}
