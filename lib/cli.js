
var argv = process.argv,
    basename = require('path').basename,
    extend = require('./extend'),
    printer = require('./printer'),
    pkg = require('../package.json'),
    q = require('q'),
    rl = require('readline').createInterface(process.stdin, printer.cursor);

rl.pause();

var builtInOptions = [
  {name: 'help', description: 'Show this usage information'},
  {name: 'version', description: 'Show version information'}
];

/**
 * Initializes the cli
 *
 * Gets command and options from process arguments
 *
 * @param {Array} commands Available commands
 * @param {Array} options Available options
 * @returns {Object}
 */
exports.init = function (commands, options) {

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

  return {
    command: command,
    options: opts
  };
};

/**
 * Ask the user a question
 *
 * @param {String} question
 * @param {Object} options
 * @returns {Promise}
 */
exports.ask = function (question, options) {
  options = options || {};
  var deferred = q.defer();
  function doAsk () {
    printer.print(question + ' ');
    printer.print(
      (options.default ? '[' + options.default + ']' : ''),
      'CONCRETE'
    );
    rl.question(' ', function (answer) {
      answer = answer.trim();
      if (!answer && !options.default && !options.allowEmpty) {
        printer.info('Try again...\n');
        doAsk();
        return;
      }
      answer = answer || options.default;
      if (options.type === 'boolean') {
        answer = ['y', 'yes', 'yeah', 'true', 'j', 'ja'].indexOf(answer.toLowerCase()) >= 0;
      }
      deferred.resolve(answer);
      rl.pause();
    });
  }
  doAsk();
  return deferred.promise;
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
