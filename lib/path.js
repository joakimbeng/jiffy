
var path = require('path');

module.exports = exports = path;

/**
 * Check if file is json
 *
 * @param {String} file
 * @returns {Boolean}
 */
exports.isJson = function (file) {
  return path.extname(file) === '.json';
};

/**
 * Check if file is markdown
 *
 * @param {String} file
 * @returns {Boolean}
 */
exports.isMarkdown = function (file) {
  return ['.md', '.markdown'].indexOf(path.extname(file)) >= 0;
};
