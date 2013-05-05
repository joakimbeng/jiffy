
var kleiDust = require('klei-dust'),
    q = require('q'),
    settings = require('./settings');

function getDust (templateDir) {
  kleiDust.setOptions({
    root: templateDir,
    useHelpers: true
  });

  return q.denodeify(kleiDust.dust);
}

module.exports = exports = getDust;
