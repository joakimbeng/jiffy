
/**
 * Extend/Clone an object
 *
 * @param {Object} to
 * @param {Object} from
 * @returns {Object}
 */
function extend (to, from) {
  var props = Object.getOwnPropertyNames(from);
  props.forEach(function(name) {
      if (!(name in to)) {
          var destination = Object.getOwnPropertyDescriptor(from, name);
          Object.defineProperty(to, name, destination);
      }
  });
  return to;
}

module.exports = exports = extend;
