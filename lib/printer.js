
var cursor = require('ansi')(process.stdout),
    colors = require('./colors');

function print (msg, color) {
  if (color)
    cursor.hex(getColor(color));

  cursor.write(msg)
        .reset();
}

function fatal (err) {
  cursor.hex(colors.POMEGRANATE)
        .bold()
        .write('\nERROR:\n')
        .reset();

  error((err.message ? err.message : err) + '\n');
}

function error (msg) {
  print(msg, 'POMEGRANATE');
}

function info (msg) {
  print(msg, 'ORANGE');
}

function ok (msg) {
  print(msg, 'EMERLAND');
}

function getColor (name) {
  var color = colors[name];
  if (!color) {
    throw new Error('Unknown color: ' + name);
  }
  return color;
}

module.exports = exports = {
  fatal: fatal,
  error: error,
  print: print,
  info: info,
  ok: ok
};
