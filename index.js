'use strict';

const bunyan = require('bunyan');
const mocha = require('mocha');
const PrettyStream = require('bunyan-prettystream');

let prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

let mute = false,
    level = 'trace';

var _createLogger = bunyan.createLogger;
bunyan.createLogger = function(opts) {
  opts.streams = [{
    level: mute ? 99 : level,
    type: 'raw',
    stream: prettyStdOut
  }];

  return _createLogger(opts);
};

let exp = function(runner, options) {
	let reporter = mocha.reporters.nyan;
	const reporterOptions = options.reporterOptions;
  if (reporterOptions.reporter){
    if (mocha.reporters[reporterOptions.reporter]!==undefined){
			// default mocha reporter ?
			reporter = mocha.reporters[reporterOptions.reporter];
    } else {
			// try to require it
			reporter = require(reporterOptions.reporter);
    }
  }

  mute = reporterOptions.mute || mute;
  level = reporterOptions.level || level;

	return new reporter(runner, options);
};

module.exports = exp;