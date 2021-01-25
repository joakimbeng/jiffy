var dust = require('./dust'),
  fs = require('./fs'),
  join = require('path').join,
  sortBy = require('sort-by'),
  settings = require('./settings'),
  url = require('url');

/**
 * Builds all html files to build folder
 *
 * @param {Array} posts
 * @returns {Promise}
 */
exports.build = function (posts) {
  var data = getData(posts);

  return Promise.all([
    copyAssets(),
    buildTagPages(data.tags, data),
    buildCategoryPages(data.categories, data),
    buildPostPages(data.posts, data),
    buildIndexPage(data),
    buildFeed(data),
  ]);
};

function copyAssets() {
  return fs.copyDir(join(settings.themeDir, 'assets'), settings.assetsDir);
}

function buildTagPages(tags, mainData) {
  return Promise.all(
    tags.map(function (tag) {
      var tagData = Object.assign(
        {path: '../', currentUrl: tag.tag.url, inTag: true},
        mainData,
        tag
      );

      return build(tagData, 'tag', tagData.tag.fileName);
    })
  );
}

function buildCategoryPages(categories, mainData) {
  return Promise.all(
    categories.map(function (category) {
      var categoryData = Object.assign(
        {path: '../', currentUrl: category.category.url, inCategory: true},
        mainData,
        category
      );

      return build(categoryData, 'category', categoryData.category.fileName);
    })
  );
}

function buildPostPages(posts, mainData) {
  return Promise.all(
    posts.map(function (post) {
      var postData = Object.assign(
        {post: post, path: '../', currentUrl: post.url, inPost: true},
        mainData
      );

      return build(postData, 'post', post.fileName);
    })
  );
}

function buildIndexPage(mainData) {
  var indexData = Object.assign({inIndex: true}, mainData);

  return build(indexData, 'index', 'index.html');
}

function buildFeed(mainData) {
  var feedData = Object.assign(
    {inFeed: true, lastBuildDate: mainData.buildTime.toGMTString()},
    mainData
  );

  return build(feedData, 'feed', 'rss.xml');
}

function build(data, template, filename) {
  return dust(template, data).then(function (out) {
    return fs.writeFile(join(settings.buildDir, filename), out, 'utf-8');
  });
}

function getData(posts) {
  protocol = url.parse(settings.url).protocol || 'http:';
  return {
    blogTitle: settings.title,
    blogUrl: settings.url,
    blogDescription: settings.description,
    blogProtocol: protocol + '//',
    disqusShortname: settings.services.disqus,
    googleAnalytics: settings.services.googleAnalytics,
    defaultAuthor: settings.getAuthor(),
    posts: posts,
    tags: getTagsFromPosts(posts).sort(sortBy('tag.name')),
    categories: getCategoriesFromPosts(posts).sort(sortBy('category.name')),
    buildTime: new Date(),
  };
}

function getTagsFromPosts(posts) {
  var tags = {};

  posts.forEach(function (post) {
    post.tags.forEach(function (tag) {
      if (!tags[tag.name]) tags[tag.name] = {posts: [], tag: tag};
      tags[tag.name].posts.push(post);
    });
  });

  return Object.values(tags);
}

function getCategoriesFromPosts(posts) {
  var categories = {};

  posts.forEach(function (post) {
    if (!categories[post.category.name])
      categories[post.category.name] = {posts: [], category: post.category};
    categories[post.category.name].posts.push(post);
  });

  return Object.values(categories);
}
