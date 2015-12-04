"use strict";

/*
 *  Inspired by the lukescott's gist
 *  https://gist.github.com/lukescott/36453a75c39c539f5c7d
 */

const PRIVATE_TRAITS_KEY = "_traits";

class _Base { }

function mixinTraits(object, ...traits) {
  let _object = object;
  let _traits = [];

  if (object === null) {
    _object = class { };
  }
  if (_object[PRIVATE_TRAITS_KEY]) {
    Array.prototype.push.apply(_traits, _object[PRIVATE_TRAITS_KEY]);
  }
  let props = {};
  props[PRIVATE_TRAITS_KEY] = {
    value: _traits,
    writable: true,
    configurable: true,
  };

  for (let trait of traits) {
    if (trait[PRIVATE_TRAITS_KEY]) {
      Array.prototype.push.apply(_traits, trait[PRIVATE_TRAITS_KEY]);
    }
    for (let name of Object.getOwnPropertyNames(trait)) {
      if (name !== PRIVATE_TRAITS_KEY && object.hasOwnProperty(name)) {
        props[name] = {
          value: trait[name],
          writable: true,
          configurable: true,
        };
      }
    }
    _traits.push(trait);
  }
  Object.defineProperties(_object, props);
  return _object;
}

function classWithTraits(baseClass, ...traits) {
  if (baseClass === null) {
    class traitedClass extends _Base { }
    mixinTraits.apply(this, [traitedClass.prototype].concat(traits));
    return traitedClass;
  } else {
    class traitedClass extends baseClass { }
    mixinTraits.apply(this, [traitedClass.prototype].concat(traits));
    return traitedClass;
  }
}

function hasTrait(object, trait) {
  let _traits;
  if (typeof object === "function") {
    _traits = object.prototype[PRIVATE_TRAITS_KEY];
  }
  else {
    _traits = object[PRIVATE_TRAITS_KEY];
  }
  return Array.isArray(_traits)
      && _traits.indexOf(trait) >= 0;
}

export default {
  mixinTraits: mixinTraits,
  classWithTraits: classWithTraits,
  hasTrait: hasTrait,
};
