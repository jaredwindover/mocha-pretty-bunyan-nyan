'use strict';

const bunyan = require('bunyan');
const mocha = require('mocha');
const PrettyStream = require('bunyan-prettystream');

let mute = false,
    level = 'trace';

let exp = function(runner, options) {
	let reporter = mocha.reporters.nyan;
  if (options.reporter){
    if (mocha.reporters[options.reporter]!==undefined){
			// default mocha reporter ?
			reporter = mocha.reporters[options.reporter];
    } else {
			// try to require it
			reporter = require(options.reporter);
    }
  }

  mute = options.mute || mute;
  level = options.level || level;

	let prettyStdOut = new PrettyStream();
	prettyStdOut.pipe(process.stdout);

	var _createLogger = bunyan.createLogger;
	bunyan.createLogger = function(options) {
    options.streams = [{
      level: mute ? 99 : level,
      type: 'raw',
      stream: prettyStdOut
    }];

    return _createLogger(options);
	};

	return reporter(runner, options);
};

module.exports = exp;
