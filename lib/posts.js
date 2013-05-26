
var fs = require('../lib/fs'),
    settings = require('../lib/settings'),
    path = require('../lib/path'),
    printer = require('../lib/printer')
    cli = require('../lib/cli'),
    q = require('q');

/**
 * Creates a new blog post
 *
 * Asking for title if not provided via cli arguments
 *
 * @returns {Promise}
 */
exports.create = function () {
  return q.try(function () {
    var postName = params.arguments.join(' ');
    if (postName) {
      return postName;
    }
    return cli.ask('What do you want to name your new blog post?');
  })
  .then(function (postName) {
    var postDir = path.join(settings.postsDir, (new Date()).toISOString().slice(0, 10) + ' - ' + postName);
    printer.info('Creating post "' + postName + '" in "./' + path.basename(path.dirname(postDir)) + '/' + path.basename(postDir) + '/"\n');
    return [postName, postDir, fs.mkdir(postDir)];
  })
  .spread(function (postName, postDir) {
    return [
      fs.writeFile(path.join(postDir, 'post.md'), postName + '\n' + (new Array(postName.length + 1)).join('=') + '\n', 'utf8'),
      fs.writeFile(path.join(postDir, 'meta.json'), '{\n}\n', 'utf8')
    ]
  });
}
