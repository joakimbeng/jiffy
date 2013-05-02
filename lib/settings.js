
var join = require('path').join;

module.exports = exports = getSettings;

/**
 * Get jiffy settings
 *
 * @param {String} dir
 * @returns {Object}
 */
function getSettings (dir) {
  if (!dir)
    throw new Error('Parameter "dir" must be set!');

  var settings = load(dir);

  addDefaultDirs(settings, dir);

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

function load (dir) {
  try {
    return require(join(dir, 'jiffy.json'));
  } catch (e) {
    throw new Error('No jiffy.json found in current folder!');
  }
}

function addDefaultDirs (settings, dir) {
  settings.dirs = settings.dirs || {};
  settings.postsDir = join(dir, settings.dirs.posts || 'posts'),
  settings.buildDir = join(dir, settings.dirs.build || 'build'),
  settings.templateDir = join(__dirname, '..', 'templates'),
  settings.cssDir = join(settings.buildDir, 'css');
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

