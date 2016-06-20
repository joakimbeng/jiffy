
var join = require('path').join,
    exists = require('fs').existsSync;

module.exports = exports = getSettings();

/**
 * Get jiffy settings
 *
 * @returns {Object}
 */
function getSettings () {
  var settings = load();

  addDefaultDirs(settings);

  addDefaultSettings(settings);

  validate(settings);

  settings.getAuthor = function (identifier) {
    var author = this.authors.filter(function (author) {
      return author.identifier === identifier;
    })[0];
    if (!author && hasDefaultAuthor(this))
      return getDefaultAuthor(this);
    throw new Error('Author is missing! And no default author exists!');
  };

  return settings;
}

function load () {
  try {
    return require(join(process.cwd(), 'jiffy.json'));
  } catch (e) {
    throw new Error('No jiffy.json found in current folder, have you run "jiffy init"!?');
  }
}

function addDefaultDirs (settings) {
  settings.dirs = settings.dirs || {};
  settings.postsDir = join(process.cwd(), settings.dirs.posts || 'posts');
  settings.buildDir = join(process.cwd(), settings.dirs.build || 'build');
  settings.themeDir = getThemeLocation(settings);
  settings.assetsDir = join(settings.buildDir, 'assets');
}

function getThemeLocation (settings) {
  if (!settings.theme)
    settings.theme = 'default';

  var dir = join(process.cwd(), 'themes', settings.theme);
  if (exists(dir))
    return dir;

  dir = join(process.cwd(), 'node_modules', settings.theme);
  if (exists(dir))
    return dir;

  dir = join(process.cwd(), settings.theme);
  if (exists(dir))
    return dir;

  dir = join(__dirname, '..', 'themes', settings.theme);
  if (exists(dir))
    return dir;

  throw new Error('Cannot find theme "' + settings.theme + '"!');
}

function addDefaultSettings (settings) {
  if (typeof settings.truncate === 'undefined')
    settings.truncate = 500;
  settings.services = settings.services || {};
  settings.defaultCategory = settings.defaultCategory || 'Uncategorized';
}

function validate (settings) {
  if (!settings.title)
    throw new Error('Your blog needs a title, missing "title" in jiffy.json!');

  if (!settings.url)
    throw new Error('Your blog needs an url, missing "url" in jiffy.json!');

  if (!settings.authors)
    throw new Error('Your blog needs at least one author! Missing "authors" in jiffy.json!');

  if (!settings.authors.length)
    throw new Error('Your blog needs an author! "authors" cannot be empty!');

  if (settings.authors.length > 1 && !hasDefaultAuthor(settings))
    console.warn('When more than one author exists, it\'s good to mark one of them as default, with "default": true');
}

function hasDefaultAuthor (settings) {
  return settings.authors.length === 1
      || settings.authors.some(function (author) {
           return author.default;
         });
}

function getDefaultAuthor (settings) {
  if (settings.authors.length === 1)
    return settings.authors[0];
  return settings.authors.filter(function (author) {
    return author.default;
  })[0];
}
