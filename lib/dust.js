
var kleiDust = require('klei-dust'),
    q = require('q'),
    settings = require('./settings');

kleiDust.setOptions({
  root: settings.themeDir,
  useHelpers: true
});

require('dustjs-helper-formatdate');

module.exports = exports = q.denodeify(kleiDust.dust);
