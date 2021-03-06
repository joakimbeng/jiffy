var hljs = require('highlight.js');

const languages = hljs.listLanguages();

/**
 * Highlights code with hightlight.js
 *
 * @param {String} code
 * @param {String} lang
 * @returns {String}
 */
function highlight(code, lang) {
  if (!hljs) return code;
  if (lang === undefined || !languages.includes(lang)) {
    lang = hljs.highlightAuto(code).language;
    if (!lang) return code;
  }
  return hljs.highlight(lang, code).value;
}

module.exports = exports = highlight;
