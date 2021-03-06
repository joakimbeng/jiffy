var fs = require('./fs'),
  settings = require('./settings'),
  path = require('./path'),
  q = require('q'),
  sortBy = require('sort-by'),
  slug = require('slug'),
  truncate = require('html-truncate'),
  strip = require('striptags'),
  all = require('promise-all'),
  marked = require('marked'),
  highlight = require('./highlight');

exports.read = read;

/**
 * Read all posts from the posts directory
 *
 * @returns {Promise}
 */
function read() {
  return checkForPostsDir()
    .then(function (exists) {
      if (!exists)
        throw new Error(
          'Can not find posts directory: "' +
            settings.postsDir +
            '", have you run "jiffy init"?'
        );
      return fs.readDir(settings.postsDir);
    })
    .then(function (postDirs) {
      return q.all(postDirs.map(getPostInfo));
    })
    .then(removeInvalidPosts)
    .then(function (posts) {
      if (!posts.length)
        throw new Error('No posts found in: "' + settings.postsDir + '"');
      return posts.sort(sortBy('-date', 'name'));
    });
}

function checkForPostsDir() {
  return fs.exists(settings.postsDir);
}

function getPostInfo(dir) {
  var post = {};
  post.name = getPostName(dir);
  post.date = getPostDate(dir);
  post.url = nameToUrl('posts', post.name);
  post.fileName = nameToFileName('posts', post.name);

  if (['.', '_'].indexOf(dir[0]) > -1 || !post.name) return;

  var markdown = q.defer(),
    meta = q.defer();

  var hasPost = false,
    hasMeta = false;

  var postDir = path.join(settings.postsDir, dir);

  fs.stat(postDir).then(function (stats) {
    if (stats.isFile()) {
      if (!path.isMarkdown(postDir))
        markdown.reject(
          new Error('The file "' + postDir + '" is no markdown file!')
        );
      markdown.resolve(fs.readFile(postDir, 'utf-8'));
      meta.resolve({});
    } else {
      fs.readDir(postDir).then(function (files) {
        files.forEach(function (fileName) {
          var file = path.join(settings.postsDir, dir, fileName);
          if (path.isMarkdown(file)) {
            hasPost = true;
            markdown.resolve(fs.readFile(file, 'utf-8'));
          } else if (path.isJson(file)) {
            hasMeta = true;
            meta.resolve(fs.readJson(file));
          }
        });
        if (!hasPost)
          markdown.reject(
            new Error('Missing content (markdown file) for post: ' + post.name)
          );
        if (!hasMeta) meta.resolve({});
      });
    }
  });

  post.content = getHtml(markdown.promise);
  post.shortContent = getShortHtml(post.content);
  post.contentStripped = getStripped(post.content);
  post.shortStripped = getStripped(post.shortContent);
  post.category = getCategory(meta.promise);
  post.author = getAuthor(meta.promise);
  post.tags = getTags(meta.promise);
  post.datetime = getDatetime(post.date, meta.promise);
  post.pubDate = getPubDate(post.datetime);
  post.guid = getGuid(meta.promise);
  post.title = getTitle(post.name, meta.promise);

  return all(post);
}

function getPostName(dir) {
  var name = path.basename(dir).split(' - ').slice(1).join(' - ');
  if (path.isMarkdown(name)) return name.replace(/\.(md|markdown)$/, '');
  return name;
}

function getPostDate(dir) {
  return path.basename(dir).split(' - ')[0];
}

function nameToUrl(dir, name) {
  return dir + '/' + urlFriendlyName(name) + '.html';
}

function nameToFileName(dir, name) {
  return path.join(dir, urlFriendlyName(name) + '.html');
}

function urlFriendlyName(name) {
  return slug(name.toLowerCase());
}

function getHtml(markdown) {
  return markdown.then(function (markdown) {
    return marked(markdown, {highlight: highlight});
  });
}

function getTitle(name, meta) {
  return meta.then(function (meta) {
    return meta.title || name;
  });
}

function getShortHtml(html) {
  if (!settings.truncate) return html;

  return html.then(function (code) {
    return truncate(code, settings.truncate);
  });
}

function getStripped(promise) {
  return promise.then(function (content) {
    return strip(content);
  });
}

function getCategory(meta) {
  return meta.then(function (meta) {
    var name = meta.category || settings.defaultCategory;
    return {
      name: name,
      url: nameToUrl('category', name),
      fileName: nameToFileName('category', name),
    };
  });
}

function getAuthor(meta) {
  return meta.then(function (meta) {
    return settings.getAuthor(meta.author);
  });
}

function getTags(meta) {
  return meta.then(function (meta) {
    return (meta.tags || []).map(function (name) {
      return {
        name: name,
        url: nameToUrl('tags', name),
        fileName: nameToFileName('tags', name),
      };
    });
  });
}

function getDatetime(date, meta) {
  return meta.then(function (meta) {
    return new Date(
      Date.parse(meta.datetime || date + ' ' + (meta.time || '12:00:00 GMT'))
    );
  });
}

function getPubDate(datetimeStr) {
  return datetimeStr.then(function (datetime) {
    return datetime.toGMTString();
  });
}

function getGuid(meta) {
  return meta.then(function (meta) {
    return meta.guid;
  });
}

function removeInvalidPosts(posts) {
  return posts.filter(function (post) {
    return post;
  });
}
