
var dust = require('./dust'),
    fs = require('./fs'),
    join = require('path').join,
    settings = require('./settings'),
    extend = require('./extend'),
    toArray = require('./to-array'),
    sortBy = require('./sort-by'),
    q = require('q'),
    url = require('url');

/**
 * Builds all html files to build folder
 *
 * @param {Array} posts
 * @returns {Promise}
 */
exports.build = function (posts) {
  var data = getData(posts);

  return q.all([
    copyAssets(),
    buildTagPages(data.tags, data),
    buildCategoryPages(data.categories, data),
    buildPostPages(data.posts, data),
    buildIndexPage(data)
  ]);
};


function copyAssets () {
  return fs.copyDir(join(settings.themeDir, 'assets'), settings.assetsDir);
}

function buildTagPages (tags, mainData) {
  return q.all(tags.map(function (tag) {
    var tagData = extend({path: '../', currentUrl: tag.tag.url, inTag: true}, tag, mainData);

    return build(tagData, 'tag', tagData.tag.fileName);
  }));
}

function buildCategoryPages (categories, mainData) {
  return q.all(categories.map(function (category) {
    var categoryData = extend({path: '../', currentUrl: category.category.url, inCategory: true}, category, mainData);

    return build(categoryData, 'category', categoryData.category.fileName);
  }));
}

function buildPostPages (posts, mainData) {
  return q.all(posts.map(function (post) {
    var postData = extend({post: post, path: '../', currentUrl: post.url, inPost: true}, mainData);

    return build(postData, 'post', post.fileName);
  }));
}

function buildIndexPage (mainData) {
  var indexData = extend({inIndex: true}, mainData);

  return build(indexData, 'index', 'index.html');
}

function build (data, template, filename) {
  return dust(template, data).then(function (out) {
    return fs.writeFile(join(settings.buildDir, filename), out, 'utf-8');
  });
}

function getData (posts) {
  protocol = url.parse(settings.url).protocol || 'http:';
  return {
    blogTitle: settings.title,
    blogUrl: settings.url,
    blogProtocol: protocol + '//',
    disqusShortname: settings.services.disqus,
    googleAnalytics: settings.services.googleAnalytics,
    posts: posts,
    tags: sortBy(getTagsFromPosts(posts), 'tag.name'),
    categories: sortBy(getCategoriesFromPosts(posts), 'category.name')
  };
}

function getTagsFromPosts (posts) {
  var tags = {};

  posts.forEach(function (post) {
    post.tags.forEach(function (tag) {
      if (!tags[tag.name])
        tags[tag.name] = {posts: [], tag: tag};
      tags[tag.name].posts.push(post);
    });
  });

  return toArray(tags);
}

function getCategoriesFromPosts (posts) {
  var categories = {};

  posts.forEach(function (post) {
    if (!categories[post.category.name])
      categories[post.category.name] = {posts: [], category: post.category};
    categories[post.category.name].posts.push(post);
  });

  return toArray(categories);
}
