
var argv = process.argv,
    basename = require('path').basename,
    extend = require('./extend'),
    printer = require('./printer'),
    pkg = require('../package.json');

var builtInOptions = [
  {name: 'help', description: 'Show this usage information'},
  {name: 'version', description: 'Show version information'}
];

function init (commands, options) {

  options = builtInOptions.concat((options || []));

  try {
    var command = getCommand(commands);
    var opts = getOptions(options);
  } catch (e) {
    printHeader(pkg.version);
    printHelp(commands, options);
    printer.error(e.msg);
    process.exit();
  }

  if (opts.version) {
    printer.print(pkg.version + '\n');
    process.exit();
  }

  printHeader(pkg.version);

  if (opts.help) {
    printHelp(commands, options);
    process.exit();
  }

  return extend({command: command}, opts);
}

function getCommand (commands) {
  var commandNames = commands.map(function (command) {
    return command.name;
  });

  var givenCommands = argv.slice(2).filter(function (command) {
    return commandNames.indexOf(command) >= 0;
  });

  if (givenCommands.length > 1) {
    throw new Error('Only one command can be specified at a time');
  }

  for (var i = 0; i < commands.length; i++) {
    var command = commands[i];
    if (givenCommands.indexOf(command.name) === 0)
      return command.name;
    else if (!givenCommands.length && command.default)
      return command.name;
  }

  throw new Error('No command specified!');
}

function getOptions (options) {
  var opts = {};
  options.forEach(function (option) {
    opts[option.name] = hasOption(option.name);
  });
  return opts;
}

function printHeader (version) {
  printer.print(
    '          __  __\n' +
    '     / ´ /_  /_\n' +
    '  __/ / /   /  /__/  ',
    'TURQUOISE'
  );

  printer.print(
    'v.' + version + '\n',
    'CONCRETE'
  );

  printer.print(
    '               __/\n\n',
    'TURQUOISE'
  );
}

function printCommand (command) {
  printer.print(
    '  ' + command.name + pad(command.name, 16),
    'EMERLAND'
  );
  printer.print(
    command.description,
    'CONCRETE'
  );
  if (command.default)
    printer.print(' (default)', 'ORANGE');
  printer.print('\n');
}

function printOption (option) {
  printer.print(
    '  -' + option.name[0] + ', --' + option.name + pad(option.name, 10),
    'EMERLAND'
  );
  printer.print(
    option.description,
    'CONCRETE'
  );
  printer.print('\n');
}

function printHelp (commands, options) {
  printer.print('Usage: ' + basename(argv[1]) + ' <command>\n\n');

  printer.print('Where <command> is one of:\n');
  commands.forEach(function (command) {
    printCommand(command);
  });
  printer.print('\n');

  printer.print('Options:\n');
  options.forEach(function (option) {
    printOption(option);
  });
  printer.print('\n');
}

function pad (text, length) {
  return (new Array(length - text.length)).join(' ');
}

function hasOption (name) {
  return argv.indexOf('--' + name) >= 0 || argv.indexOf('-' + name[0]) >= 0;
}

module.exports = exports = init;
