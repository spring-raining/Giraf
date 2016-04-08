"use strict";

export default () => {
  try {
    const language = window.navigator.language
                  || window.navigator.userLanguage
                  || window.navigator.browserLanguage;

    if (language.indexOf("ja") === 0) {
      return "ja-JP";
    }

    return "en-US";
  } catch (e) {
    return "en-US";
  }
};
