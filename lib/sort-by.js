
/**
 * Sort an array by given property/properties
 *
 * @param {Array} arr
 * @param {...String} properties...
 * @returns {Array}
 */
function sortBy () {
  var args = Array.prototype.slice.call(arguments);
  var arr = args.shift();
  return arr.sort(function (a, b) {
    for (var i = 0; i < args.length; i++) {
      var property = args[i];
      var invert = property.indexOf('-') === 0;
      if (invert) {
        property = property.slice(1);
      }
      var aVal = getValue(a, property);
      var bVal = getValue(b, property);
      if (aVal < bVal)
        return invert ? 1 : -1;
      if (aVal > bVal)
        return invert ? -1 : 1;
    }
    return 0;
  });
}

function getValue (obj, property) {
  return property.split('.').reduce(function (prev, current) {
    return prev[current];
  }, obj);
}

module.exports = exports = sortBy;
