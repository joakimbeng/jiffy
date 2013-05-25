var fs = require('../lib/fs'),
    path = require('../lib/path'),
    ask = require('../lib/cli').ask,
    printer = require('../lib/printer');

/**
 * Creates a new theme
 *
 * @returns {Promise}
 */
exports.create = function () {
  return checkForConfig()
    .then(function (settings) {
      return ask('What do you want to name your new theme?');
    })
    .then(function (themeName) {
      return [themeName, fs.exists(path.join(process.cwd(), 'themes', themeName))];
    })
    .spread(function (themeName, exists) {
      if (exists)
        throw new Error('The theme: "' + themeName + '" already exists!');
      printer.info('\nCopying default theme...\n');
      return [themeName, fs.copyDir(path.join(__dirname, '..', 'themes', 'default'), path.join(process.cwd(), 'themes', themeName))];
    })
    .spread(function (themeName) {
      printer.info('Theme "' + themeName + '" created in: ./themes/' + themeName + '\n\n');
      return [themeName, ask('Do you want to set the blog theme to: "' + themeName + '"?', {default: 'y', type: 'boolean'})];
    })
    .spread(function (themeName, apply) {
      if (!apply)
        return;
      return fs.readJson('jiffy.json')
        .then(function (json) {
          json.theme = themeName;
          printer.info('\nThis will be your new jiffy.json:\n\n');
          return [printer.json(json, 'CARROT'), ask('\nDoes this look ok?', {default: 'y', type: 'boolean'})];
        })
        .spread(function (prettyJson, doSave) {
          if (!doSave) {
            printer.error('Exiting...\n');
            process.exit();
            return;
          }
          printer.info('\nSaving json...\n');
          return fs.writeFile('jiffy.json', prettyJson, 'utf8');
        });
    });
};

function checkForConfig () {
  return fs.exists(path.join(process.cwd(), 'jiffy.json'));
}
