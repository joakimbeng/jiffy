Jiffy
=======

> Make a blog in a jiffy...

## Yet Another Static Blog Generator?

Yes, that's right Jiffy is a static blog generator, and it's built with [Node.js](http://nodejs.org).

### Why?

I've been inspired by other static blog generators like [Jekyll](https://github.com/mojombo/jekyll) and [Blacksmith](https://github.com/flatiron/blacksmith), to mention a few, and I wanted to build my own because it's fun and hopefully it's useful for somebody else but me.

### How?

#### Requirements

To use **Jiffy** you'll need Node.js, and know how to write [Markdown](http://daringfireball.net/projects/markdown/), easy right?

#### Installing

You install Jiffy via npm:

    $ npm install -g jiffy

#### Create a new blog

To initiate a new blog in an empty directory run:

    $ jiffy init

And follow the walkthrough.

#### Building/Compiling your blog

To build your nice new blog you can run either:

    jiffy build

Or just:

    jiffy

#### Deploying

When your blog has been built just put all the files in `./build/` on a web host of your choice - done.

You can also run/preview the blog locally by opening the `./build/index.html` in a browser.

## Creating blog posts

A blog post is written in Markdown with the [Github Flavoured Markdown](https://help.github.com/articles/github-flavored-markdown) syntax and should be saved in the `./posts` directory.

There is two ways in which one can save a blog post:

### Making a blog post the simple way

Just create a markdown file with a name in the format `<YYYY-MM-DD> - <Blog title>.md` and save it in `./posts/`.

**Note:** There is no way, for the moment, to specify category or tags for blog post with this method.

### Making a blog post the alternate way

Create a folder in `./posts` with a name in the format `<YYYY-MM-DD> - <Blog title>` and create a markdown file in that directory with your blog post content, e.g: `./posts/2013-05-20 - My first post/post.md` (the name for the markdown file doesn't matter, as long as it has the extension `.md` or `.markdown`).

#### Post meta

Create a json file in your post folder, e.g: `./posts/2013-05-20 - My first post/meta.json` (the name for the file doesn't matter as long as it has the extension `.json`).

In the meta json file you can specify: author, category and tags.

Example:

```json
{
  "author": "gd",
  "category": "My first category",
  "tags": ["first tag", "second tag"]
}
```

Where `author` is the identifier for the author and if omitted the default author is used, see Configuration section below for more information.

#### Assets **WIP**

This alternative way of creating blog posts has the advantage that you can put all your blog post assets, i.e. images, in the same folder as the post content and meta and refer to them relative to your post folder, e.g: `![My image](image.jpg)`, in your markdown and Jiffy will take care of the rest.

**Note:** Not available right now - feature for next version.

## Theming

Jiffy comes with a default theme that uses a slightly modified version of [Flat UI](http://designmodo.github.io/Flat-UI/) for the design, and uses [Highlight.js](http://softwaremaniacs.org/soft/highlight/en/) for code syntax highlighting with the Monokai theme. The syntax highlighting is applied during compile time so the compiled blog doesn't depend on javascript.

The html templating engine used by Jiffy is [dustjs-linkedin](http://linkedin.github.io/dustjs/).

### Modifying the theme/Creating your own

To make you own theme, just run:

    $ jiffy new-theme

Then you have a clean copy of the default theme that is ready to modify.

## Configuration

The main configuration for your blog resides in `./jiffy.json`, and a default configuration can look like this:

```json
{
  "title": "Your jiffy blog",
  "url": "http://example.com/jiffy",
  "authors": [
    {
      "identifier": "jd",
      "name": "Jane Doe",
      "default": true
    }
  ],
  "truncate": 500
}
```

### Options

#### `truncate` *{Number}*

The `truncate` option specifies if and to which length the blog posts should be truncated on the index, category and tag pages.

Set to `null`, or another "falsy" value, to disable truncation.

**Note:** The truncation makes sure the html is not broken.

#### `authors` *{Array}*

To specify author information for your Jiffy blog the option `authors` is used.

Each author is represented by an object with the keys `identifier` (*unique*) and `name`, if more than one author is specified one must have `default` set to `true` as well, e.g:

```json
{
  ...
  "authors": [
    {
      "identifier": "jd",
      "name": "Jane Doe",
      "default": true
    },
    {
      "identifier": "gd",
      "name": "Gina Doe"
    }
  ]
  ...
}
```

**Note:** All posts without a specified author will use the default (or only) author.

#### `services` *{Object}*

The `services` option is used to enable third party utilities.

**Jiffy has support for this services:**

* `googleAnalytics` *{String}* - Set this to your GA Tracking ID to enable Google Analytics support
* `disqus` *{String}* - Set this to your Disqus Shortname to enable Disqus for comments

Example:

```json
{
  ...
  "services": {
    "googleAnalytics": "UA-XXXX-NN",
    "disqus": "disqus_shortname"
  ...
}
```

## License

MIT, see `./LICENSE`.
