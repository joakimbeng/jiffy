
var fs = require('klei-fs'),
    q = require('q'),
    ncp = require('ncp').ncp,
    dirname = require('path').dirname;

function mkdir (path, mode, callback) {
  if (typeof mode === 'function' && !callback) {
    callback = mode;
    mode = '0777';
  }

  var mkdirCallback = function (err) {
    if (err) {
      callback(err);
      return;
    }
    fs.mkdir(path, mode, function (err) {
      if (err && err.code == 'EEXIST') {
        callback(null);
        return;
      }
      callback(err);
    });
  };

  fs.exists(path, function (exists) {
    if (exists) {
      callback(null);
      return;
    }
    var parent = dirname(path);
    mkdir(parent, mode, mkdirCallback);
  });
}

function writeFile (filename, data, options, callback) {
  var cb = callback;
  if (typeof options === 'function' && !cb)
    cb = options;
  mkdir(dirname(filename), function (err) {
    if (err) {
      cb(err);
      return;
    }
    fs.writeFile(filename, data, options, callback);
  });
}

function copyDir (from, to, callback) {
  mkdir(to, function (err) {
    if (err) {
      callback(err);
      return;
    }
    ncp(from, to, callback);
  });
}

module.exports = exports = {
  readDir: q.denodeify(fs.readdir),
  readFile: q.denodeify(fs.readFile),
  readJson: q.denodeify(fs.readJson),
  stat: q.denodeify(fs.stat),
  writeFile: q.denodeify(writeFile),
  copyDir: q.denodeify(copyDir),
  exists: q.denodeify(function (file, cb) {
    fs.exists(file, function (exists) { cb(null, exists); });
  }),
  mkdir: q.denodeify(mkdir)
};
