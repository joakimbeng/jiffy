
var printer = require('../lib/printer'),
    cli = require('../lib/cli'),
    fs = require('../lib/fs'),
    path = require('../lib/path');

exports.initialize = function () {
  return checkForConfig()
    .then(function (exists) {
      if (exists)
        throw new Error('A "jiffy.json" already exists in current directory,\ncan\'t initialize a new blog here');
      return {};
    })
    .then(function (config) {
      printer.info('Alright! Let\'s make a blog!\n\n');
      return [config, cli.ask('What do you want to name your blog?', {default: 'My jiffy blog!'})];
    })
    .spread(function (config, title) {
      config.title = title;

      return [config, cli.ask('What\'s the URL for the blog going to be?', {default: 'http://example.com'})];
    })
    .spread(function (config, url) {
      config.url = url;

      return [config, cli.ask('What\'s your name? (used as author information)', {default: 'Jane Doe'})];
    })
    .spread(function (config, name) {
      var author = {
        identifier: getAuthorKeyFromName(name),
        name: name,
        default: true
      };
      config.authors = [author];

      return config;
    })
    .then(function (config) {
      // Defaults:
      config.truncate = 500;

      return config;
    })
    .then(function (config) {
      printer.info('\nThis is the jiffy.json that is going to be generated:\n\n');
      config = printer.json(config, 'CARROT');
      return [config, cli.ask('\nDoes this look ok?', {default: 'y', type: 'boolean'})];
    })
    .spread(function (config, doSave) {
      if (!doSave) {
        printer.error('Exiting...\n');
        process.exit();
      }
      printer.info('\nSaving json...\n');
      return fs.writeFile('jiffy.json', config, 'utf8');
    })
    .then(function () {
      printer.info('Writing example post...\n');
      var dir = path.join('posts', (new Date()).toISOString().slice(0, 10) + ' - An example post');
      return fs.copyDir(path.join(__dirname, '..', 'example'), dir);
    });
};

function checkForConfig () {
  return fs.exists(path.join(process.cwd(), 'jiffy.json'));
}

function getAuthorKeyFromName (name) {
  if (name.length <= 1) {
    throw new Error('A name must be at least two characters long!');
  }
  var parts = name.split(' ');
  if (parts.length === 1) {
    return (name[0] + name[1]).toLowerCase();
  }
  return parts.reduce(function (prev, current) {
    return prev + current[0].toLowerCase();
  }, '');
}
