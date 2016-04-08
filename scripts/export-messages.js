"use strict";

import * as fs                      from "fs";
import * as path                    from "path";
import {sync as globSync}           from "glob";
import {sync as mkdirpSync}         from "mkdirp";

const BUILD_MESSAGES_PATTERN        = "./.tmp/messages/**/*.json";
const TRANSLATED_MESSAGES_PATTERN   = "./src/messages/*.json";
const LANG_DIR                      = "./dist/lang/";

const defaultMessages = globSync(BUILD_MESSAGES_PATTERN)
  .map((filename) => fs.readFileSync(filename, "utf8"))
  .map((file) => JSON.parse(file))
  .reduce((collection, descriptors) => {
    descriptors.forEach(({id, defaultMessage}) => {
      if (collection.hasOwnProperty(id)) {
        throw new Error(`Duplicate message id: ${id}`);
      }

      collection[id] = defaultMessage;
    });

    return collection;
  }, {});

const translatedMessages = (filename) => {
  const messages = JSON.parse(fs.readFileSync(filename, "utf8"));

  return Object.keys(messages)
    .reduce((collection, key) => {
      if (defaultMessages.hasOwnProperty(key)) {
        collection[key] = messages[key];
      }
      return collection;
    }, {});
};

const sortedJSON = (obj) =>
  JSON.stringify(
    Object.keys(obj)
      .sort()
      .reduce((collection, key) => {
        collection[key] = obj[key];
        return collection;
      }, {}),
    null, 2);

mkdirpSync(LANG_DIR);
fs.writeFileSync(LANG_DIR + "en-US.json", sortedJSON(defaultMessages));
globSync(TRANSLATED_MESSAGES_PATTERN)
  .forEach((filename) => {
    fs.writeFileSync(
      LANG_DIR + path.basename(filename),
      sortedJSON(translatedMessages(filename)));
  });

