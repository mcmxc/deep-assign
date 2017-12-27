(function() {
  "use strict";

  const isEnumerable = {}.propertyIsEnumerable;
  const isObject = target => {
    if (target == null || target == undefined) return false;
    return target.constructor.name == "Object";
  };

  Object.defineProperty(Object, "deepAssign", {
    value: function deepAssign(target, ...sources) {
      if (!isObject(target)) throw new Error(target + " is not an Object");

      sources.forEach(source => {
        Reflect.ownKeys(source).forEach(key => {
          if (isEnumerable.call(source, key)) {
            if (isObject(target[key]) && isObject(source[key])) {
              target[key] = Object.deepAssign(target[key], source[key]);
            } else if (
              source[key] instanceof Date ||
              source[key] instanceof RegExp ||
              source[key] instanceof Map ||
              source[key] instanceof Set
            ) {
              target[key] = new source[key].constructor(source[key]);
            } else {
              target[key] = source[key];
            }
          }
        });
      });
      return target;
    }
  });
})();

// var one = {b: {c: {d: 'e'}}};
// var two = {b: {c: {f: 'g', j: 'i'}}};
// var three = {foo: 'bar'};

// Object.deepAssign(one, two, three)
//=> {b: {c: {d: 'e', f: 'g', j: 'i'}}, foo: 'bar'}
