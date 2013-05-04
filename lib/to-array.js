
/**
 * Transform an Object/Associative array to an ordinary array
 *
 * @param {Object} obj
 * @returns {Array}
 */
function toArray (obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
}

module.exports = exports = toArray;
