const pick = (object, keys) => keys.reduce((obj, key) => {
  if (object && object.hasOwnProperty(key)) {
    obj[key] = object[key];
  }
  return obj;
}, {});

module.exports.utils = {
  pick,
};
