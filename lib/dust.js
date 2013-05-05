
var kleiDust = require('klei-dust'),
    q = require('q'),
    settings = require('./settings');

kleiDust.setOptions({
  root: settings.themeDir,
  useHelpers: true
});

module.exports = exports = q.denodeify(kleiDust.dust);
