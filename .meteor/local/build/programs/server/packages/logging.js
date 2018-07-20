(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var EJSON = Package.ejson.EJSON;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Log;

var require = meteorInstall({"node_modules":{"meteor":{"logging":{"logging.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/logging/logging.js                                                                                 //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
var _extends = require("@babel/runtime/helpers/builtin/extends");

module.export({
  Log: () => Log
});
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
const hasOwn = Object.prototype.hasOwnProperty;

function Log(...args) {
  Log.info(...args);
} /// FOR TESTING


let intercept = 0;
let interceptedLines = [];
let suppress = 0; // Intercept the next 'count' calls to a Log function. The actual
// lines printed to the console can be cleared and read by calling
// Log._intercepted().

Log._intercept = count => {
  intercept += count;
}; // Suppress the next 'count' calls to a Log function. Use this to stop
// tests from spamming the console, especially with red errors that
// might look like a failing test.


Log._suppress = count => {
  suppress += count;
}; // Returns intercepted lines and resets the intercept counter.


Log._intercepted = () => {
  const lines = interceptedLines;
  interceptedLines = [];
  intercept = 0;
  return lines;
}; // Either 'json' or 'colored-text'.
//
// When this is set to 'json', print JSON documents that are parsed by another
// process ('satellite' or 'meteor run'). This other process should call
// 'Log.format' for nice output.
//
// When this is set to 'colored-text', call 'Log.format' before printing.
// This should be used for logging from within satellite, since there is no
// other process that will be reading its standard output.


Log.outputFormat = 'json';
const LEVEL_COLORS = {
  debug: 'green',
  // leave info as the default color
  warn: 'magenta',
  error: 'red'
};
const META_COLOR = 'blue'; // Default colors cause readability problems on Windows Powershell,
// switch to bright variants. While still capable of millions of
// operations per second, the benchmark showed a 25%+ increase in
// ops per second (on Node 8) by caching "process.platform".

const isWin32 = typeof process === 'object' && process.platform === 'win32';

const platformColor = color => {
  if (isWin32 && typeof color === 'string' && !color.endsWith('Bright')) {
    return `${color}Bright`;
  }

  return color;
}; // XXX package


const RESTRICTED_KEYS = ['time', 'timeInexact', 'level', 'file', 'line', 'program', 'originApp', 'satellite', 'stderr'];
const FORMATTED_KEYS = [...RESTRICTED_KEYS, 'app', 'message'];

const logInBrowser = obj => {
  const str = Log.format(obj); // XXX Some levels should be probably be sent to the server

  const level = obj.level;

  if (typeof console !== 'undefined' && console[level]) {
    console[level](str);
  } else {
    // XXX Uses of Meteor._debug should probably be replaced by Log.debug or
    //     Log.info, and we should have another name for "do your best to
    //     call call console.log".
    Meteor._debug(str);
  }
}; // @returns {Object: { line: Number, file: String }}


Log._getCallerDetails = () => {
  const getStack = () => {
    // We do NOT use Error.prepareStackTrace here (a V8 extension that gets us a
    // pre-parsed stack) since it's impossible to compose it with the use of
    // Error.prepareStackTrace used on the server for source maps.
    const err = new Error();
    const stack = err.stack;
    return stack;
  };

  const stack = getStack();

  if (!stack) {
    return {};
  } // looking for the first line outside the logging package (or an
  // eval if we find that first)


  let line;
  const lines = stack.split('\n').slice(1);

  for (line of lines) {
    if (line.match(/^\s*at eval \(eval/)) {
      return {
        file: "eval"
      };
    }

    if (!line.match(/packages\/(?:local-test[:_])?logging(?:\/|\.js)/)) {
      break;
    }
  }

  const details = {}; // The format for FF is 'functionName@filePath:lineNumber'
  // The format for V8 is 'functionName (packages/logging/logging.js:81)' or
  //                      'packages/logging/logging.js:81'

  const match = /(?:[@(]| at )([^(]+?):([0-9:]+)(?:\)|$)/.exec(line);

  if (!match) {
    return details;
  } // in case the matched block here is line:column


  details.line = match[2].split(':')[0]; // Possible format: https://foo.bar.com/scripts/file.js?random=foobar
  // XXX: if you can write the following in better way, please do it
  // XXX: what about evals?

  details.file = match[1].split('/').slice(-1)[0].split('?')[0];
  return details;
};

['debug', 'info', 'warn', 'error'].forEach(level => {
  // @param arg {String|Object}
  Log[level] = arg => {
    if (suppress) {
      suppress--;
      return;
    }

    let intercepted = false;

    if (intercept) {
      intercept--;
      intercepted = true;
    }

    let obj = arg === Object(arg) && !(arg instanceof RegExp) && !(arg instanceof Date) ? arg : {
      message: new String(arg).toString()
    };
    RESTRICTED_KEYS.forEach(key => {
      if (obj[key]) {
        throw new Error(`Can't set '${key}' in log message`);
      }
    });

    if (hasOwn.call(obj, 'message') && typeof obj.message !== 'string') {
      throw new Error("The 'message' field in log objects must be a string");
    }

    if (!obj.omitCallerDetails) {
      obj = _extends({}, Log._getCallerDetails(), obj);
    }

    obj.time = new Date();
    obj.level = level; // XXX allow you to enable 'debug', probably per-package

    if (level === 'debug') {
      return;
    }

    if (intercepted) {
      interceptedLines.push(EJSON.stringify(obj));
    } else if (Meteor.isServer) {
      if (Log.outputFormat === 'colored-text') {
        console.log(Log.format(obj, {
          color: true
        }));
      } else if (Log.outputFormat === 'json') {
        console.log(EJSON.stringify(obj));
      } else {
        throw new Error(`Unknown logging output format: ${Log.outputFormat}`);
      }
    } else {
      logInBrowser(obj);
    }
  };
}); // tries to parse line as EJSON. returns object if parse is successful, or null if not

Log.parse = line => {
  let obj = null;

  if (line && line.startsWith('{')) {
    // might be json generated from calling 'Log'
    try {
      obj = EJSON.parse(line);
    } catch (e) {}
  } // XXX should probably check fields other than 'time'


  if (obj && obj.time && obj.time instanceof Date) {
    return obj;
  } else {
    return null;
  }
}; // formats a log object into colored human and machine-readable text


Log.format = (obj, options = {}) => {
  obj = _extends({}, obj); // don't mutate the argument

  let {
    time,
    timeInexact,
    level = 'info',
    file,
    line: lineNumber,
    app: appName = '',
    originApp,
    message = '',
    program = '',
    satellite = '',
    stderr = ''
  } = obj;

  if (!(time instanceof Date)) {
    throw new Error("'time' must be a Date object");
  }

  FORMATTED_KEYS.forEach(key => {
    delete obj[key];
  });

  if (Object.keys(obj).length > 0) {
    if (message) {
      message += ' ';
    }

    message += EJSON.stringify(obj);
  }

  const pad2 = n => n.toString().padStart(2, '0');

  const pad3 = n => n.toString().padStart(3, '0');

  const dateStamp = time.getFullYear().toString() + pad2(time.getMonth() + 1
  /*0-based*/
  ) + pad2(time.getDate());
  const timeStamp = pad2(time.getHours()) + ':' + pad2(time.getMinutes()) + ':' + pad2(time.getSeconds()) + '.' + pad3(time.getMilliseconds()); // eg in San Francisco in June this will be '(-7)'

  const utcOffsetStr = `(${-(new Date().getTimezoneOffset() / 60)})`;
  let appInfo = '';

  if (appName) {
    appInfo += appName;
  }

  if (originApp && originApp !== appName) {
    appInfo += ` via ${originApp}`;
  }

  if (appInfo) {
    appInfo = `[${appInfo}] `;
  }

  const sourceInfoParts = [];

  if (program) {
    sourceInfoParts.push(program);
  }

  if (file) {
    sourceInfoParts.push(file);
  }

  if (lineNumber) {
    sourceInfoParts.push(lineNumber);
  }

  let sourceInfo = !sourceInfoParts.length ? '' : `(${sourceInfoParts.join(':')}) `;
  if (satellite) sourceInfo += `[${satellite}]`;
  const stderrIndicator = stderr ? '(STDERR) ' : '';
  const metaPrefix = [level.charAt(0).toUpperCase(), dateStamp, '-', timeStamp, utcOffsetStr, timeInexact ? '? ' : ' ', appInfo, sourceInfo, stderrIndicator].join('');

  const prettify = function (line, color) {
    return options.color && Meteor.isServer && color ? require('cli-color')[color](line) : line;
  };

  return prettify(metaPrefix, platformColor(options.metaColor || META_COLOR)) + prettify(message, platformColor(LEVEL_COLORS[level]));
}; // Turn a line of text into a loggable object.
// @param line {String}
// @param override {Object}


Log.objFromText = (line, override) => {
  return _extends({
    message: line,
    level: 'info',
    time: new Date(),
    timeInexact: true
  }, override);
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"cli-color":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// node_modules/meteor/logging/node_modules/cli-color/package.json                                             //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
exports.name = "cli-color";
exports.version = "0.2.3";
exports.main = "lib";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// node_modules/meteor/logging/node_modules/cli-color/lib/index.js                                             //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
'use strict';

var d       = require('es5-ext/lib/Object/descriptor')
  , extend  = require('es5-ext/lib/Object/extend')
  , map     = require('es5-ext/lib/Object/map')
  , reduce  = require('es5-ext/lib/Object/reduce')
  , repeat  = require('es5-ext/lib/String/prototype/repeat')
  , memoize = require('memoizee')
  , tty     = require('tty')

  , join = Array.prototype.join, defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties, abs = Math.abs
  , floor = Math.floor, max = Math.max, min = Math.min

  , mods, proto, getFn, getMove, xtermMatch
  , up, down, right, left, getHeight, memoized;

mods = extend({
	// Style
	bold:      { _bold: [1, 22] },
	italic:    { _italic: [3, 23] },
	underline: { _underline: [4, 24] },
	blink:     { _blink: [5, 25] },
	inverse:   { _inverse: [7, 27] },
	strike:    { _strike: [9, 29] }
},

	// Color
	['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white']
		.reduce(function (obj, color, index) {
		// foreground
		obj[color] = { _fg: [30 + index, 39] };
		obj[color + 'Bright'] = { _fg: [90 + index, 39] };

		// background
		obj['bg' + color[0].toUpperCase() + color.slice(1)] =
			{ _bg: [40 + index, 49] };
		obj['bg' + color[0].toUpperCase() + color.slice(1) + 'Bright'] =
			{ _bg: [100 + index, 49] };

		return obj;
	}, {}));

// Some use cli-color as: console.log(clc.red('Error!'));
// Which is inefficient as on each call it configures new clc object
// with memoization we reuse once created object
memoized = memoize(function (scope, mod) {
	return defineProperty(getFn(), '_cliColorData',
		d(extend({}, scope._cliColorData, mod)));
});

proto = Object.create(Function.prototype, extend(map(mods, function (mod) {
	return d.gs(function () { return memoized(this, mod); });
}), {
	// xterm (255) color
	xterm: d(memoize(function (code) {
		code = isNaN(code) ? 255 : min(max(code, 0), 255);
		return defineProperty(getFn(), '_cliColorData',
			d(extend({}, this._cliColorData, {
				_fg: [xtermMatch ? xtermMatch[code] : ('38;5;' + code), 39]
			})));
	}, { method: 'xterm' })),
	bgXterm: d(memoize(function (code) {
		code = isNaN(code) ? 255 : min(max(code, 0), 255);
		return defineProperty(getFn(), '_cliColorData',
			d(extend({}, this._cliColorData, {
				_bg: [xtermMatch ? (xtermMatch[code] + 10) : ('48;5;' + code), 49]
			})));
	}, { method: 'bgXterm' }))
}));

if (process.platform === 'win32') {
	xtermMatch = require('./_xterm-match');
}

getFn = function () {
	var fn = function (/*…msg*/) {
		var data = fn._cliColorData, close = '';
		return reduce(data, function (str, mod) {
			close = '\x1b[' + mod[1] + 'm' + close;
			return str + '\x1b[' + mod[0] + 'm';
		}, '', true) + join.call(arguments, ' ') + close;
	};
	fn.__proto__ = proto;
	return fn;
};

getMove = function (control) {
	return function (num) {
		num = isNaN(num) ? 0 : max(floor(num), 0);
		return num ? ('\x1b[' + num + control) : '';
	};
};

module.exports = defineProperties(getFn(), {
	width: d.gs(process.stdout.getWindowSize ? function () {
		return process.stdout.getWindowSize()[0];
	} : function () {
		return tty.getWindowSize ? tty.getWindowSize()[1] : 0;
	}),
	height: d.gs(getHeight = process.stdout.getWindowSize ? function () {
		return process.stdout.getWindowSize()[1];
	} : function () {
		return tty.getWindowSize ? tty.getWindowSize()[0] : 0;
	}),
	reset: d.gs(function () {
		return repeat.call('\n', getHeight() - 1) + '\x1bc';
	}),
	up: d(up = getMove('A')),
	down: d(down = getMove('B')),
	right: d(right = getMove('C')),
	left: d(left = getMove('D')),
	move: d(function (x, y) {
		x = isNaN(x) ? 0 : floor(x);
		y = isNaN(y) ? 0 : floor(y);
		return ((x > 0) ? right(x) : left(-x)) + ((y > 0) ? down(y) : up(-y));
	}),
	moveTo: d(function (x, y) {
		x = isNaN(x) ? 1 : (max(floor(x), 0) + 1);
		y = isNaN(y) ? 1 : (max(floor(y), 0) + 1);
		return '\x1b[' + y + ';' + x + 'H';
	}),
	bol: d(function (n/*, erase*/) {
		var dir;
		n = isNaN(n) ? 0 : Number(n);
		dir = (n >= 0) ? 'E' : 'F';
		n = floor(abs(n));
		return arguments[1] ?
				(((!n || (dir === 'F')) ? '\x1b[0E\x1bK' : '') +
					repeat.call('\x1b[1' + dir + '\x1b[K', n)) : '\x1b[' + n + dir;
	}),
	beep: d('\x07'),
	xtermSupported: d(!xtermMatch),
	_cliColorData: d({})
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("/node_modules/meteor/logging/logging.js");

/* Exports */
Package._define("logging", exports, {
  Log: Log
});

})();

//# sourceURL=meteor://💻app/packages/logging.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbG9nZ2luZy9sb2dnaW5nLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsIkxvZyIsIk1ldGVvciIsIndhdGNoIiwicmVxdWlyZSIsInYiLCJoYXNPd24iLCJPYmplY3QiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImFyZ3MiLCJpbmZvIiwiaW50ZXJjZXB0IiwiaW50ZXJjZXB0ZWRMaW5lcyIsInN1cHByZXNzIiwiX2ludGVyY2VwdCIsImNvdW50IiwiX3N1cHByZXNzIiwiX2ludGVyY2VwdGVkIiwibGluZXMiLCJvdXRwdXRGb3JtYXQiLCJMRVZFTF9DT0xPUlMiLCJkZWJ1ZyIsIndhcm4iLCJlcnJvciIsIk1FVEFfQ09MT1IiLCJpc1dpbjMyIiwicHJvY2VzcyIsInBsYXRmb3JtIiwicGxhdGZvcm1Db2xvciIsImNvbG9yIiwiZW5kc1dpdGgiLCJSRVNUUklDVEVEX0tFWVMiLCJGT1JNQVRURURfS0VZUyIsImxvZ0luQnJvd3NlciIsIm9iaiIsInN0ciIsImZvcm1hdCIsImxldmVsIiwiY29uc29sZSIsIl9kZWJ1ZyIsIl9nZXRDYWxsZXJEZXRhaWxzIiwiZ2V0U3RhY2siLCJlcnIiLCJFcnJvciIsInN0YWNrIiwibGluZSIsInNwbGl0Iiwic2xpY2UiLCJtYXRjaCIsImZpbGUiLCJkZXRhaWxzIiwiZXhlYyIsImZvckVhY2giLCJhcmciLCJpbnRlcmNlcHRlZCIsIlJlZ0V4cCIsIkRhdGUiLCJtZXNzYWdlIiwiU3RyaW5nIiwidG9TdHJpbmciLCJrZXkiLCJjYWxsIiwib21pdENhbGxlckRldGFpbHMiLCJ0aW1lIiwicHVzaCIsIkVKU09OIiwic3RyaW5naWZ5IiwiaXNTZXJ2ZXIiLCJsb2ciLCJwYXJzZSIsInN0YXJ0c1dpdGgiLCJlIiwib3B0aW9ucyIsInRpbWVJbmV4YWN0IiwibGluZU51bWJlciIsImFwcCIsImFwcE5hbWUiLCJvcmlnaW5BcHAiLCJwcm9ncmFtIiwic2F0ZWxsaXRlIiwic3RkZXJyIiwia2V5cyIsImxlbmd0aCIsInBhZDIiLCJuIiwicGFkU3RhcnQiLCJwYWQzIiwiZGF0ZVN0YW1wIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsImdldERhdGUiLCJ0aW1lU3RhbXAiLCJnZXRIb3VycyIsImdldE1pbnV0ZXMiLCJnZXRTZWNvbmRzIiwiZ2V0TWlsbGlzZWNvbmRzIiwidXRjT2Zmc2V0U3RyIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJhcHBJbmZvIiwic291cmNlSW5mb1BhcnRzIiwic291cmNlSW5mbyIsImpvaW4iLCJzdGRlcnJJbmRpY2F0b3IiLCJtZXRhUHJlZml4IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJwcmV0dGlmeSIsIm1ldGFDb2xvciIsIm9iakZyb21UZXh0Iiwib3ZlcnJpZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsT0FBT0MsTUFBUCxDQUFjO0FBQUNDLE9BQUksTUFBSUE7QUFBVCxDQUFkO0FBQTZCLElBQUlDLE1BQUo7QUFBV0gsT0FBT0ksS0FBUCxDQUFhQyxRQUFRLGVBQVIsQ0FBYixFQUFzQztBQUFDRixTQUFPRyxDQUFQLEVBQVM7QUFBQ0gsYUFBT0csQ0FBUDtBQUFTOztBQUFwQixDQUF0QyxFQUE0RCxDQUE1RDtBQUV4QyxNQUFNQyxTQUFTQyxPQUFPQyxTQUFQLENBQWlCQyxjQUFoQzs7QUFFQSxTQUFTUixHQUFULENBQWEsR0FBR1MsSUFBaEIsRUFBc0I7QUFDcEJULE1BQUlVLElBQUosQ0FBUyxHQUFHRCxJQUFaO0FBQ0QsQyxDQUVEOzs7QUFDQSxJQUFJRSxZQUFZLENBQWhCO0FBQ0EsSUFBSUMsbUJBQW1CLEVBQXZCO0FBQ0EsSUFBSUMsV0FBVyxDQUFmLEMsQ0FFQTtBQUNBO0FBQ0E7O0FBQ0FiLElBQUljLFVBQUosR0FBa0JDLEtBQUQsSUFBVztBQUMxQkosZUFBYUksS0FBYjtBQUNELENBRkQsQyxDQUlBO0FBQ0E7QUFDQTs7O0FBQ0FmLElBQUlnQixTQUFKLEdBQWlCRCxLQUFE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Z2VzL2xvZ2dpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcblxuY29uc3QgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuZnVuY3Rpb24gTG9nKC4uLmFyZ3MpIHtcbiAgTG9nLmluZm8oLi4uYXJncyk7XG59XG5cbi8vLyBGT1IgVEVTVElOR1xubGV0IGludGVyY2VwdCA9IDA7XG5sZXQgaW50ZXJjZXB0ZWRMaW5lcyA9IFtdO1xubGV0IHN1cHByZXNzID0gMDtcblxuLy8gSW50ZXJjZXB0IHRoZSBuZXh0ICdjb3VudCcgY2FsbHMgdG8gYSBMb2cgZnVuY3Rpb24uIFRoZSBhY3R1YWxcbi8vIGxpbmVzIHByaW50ZWQgdG8gdGhlIGNvbnNvbGUgY2FuIGJlIGNsZWFyZWQgYW5kIHJlYWQgYnkgY2FsbGluZ1xuLy8gTG9nLl9pbnRlcmNlcHRlZCgpLlxuTG9nLl9pbnRlcmNlcHQgPSAoY291bnQpID0+IHtcbiAgaW50ZXJjZXB0ICs9IGNvdW50O1xufTtcblxuLy8gU3VwcHJlc3MgdGhlIG5leHQgJ2NvdW50JyBjYWxscyB0byBhIExvZyBmdW5jdGlvbi4gVXNlIHRoaXMgdG8gc3RvcFxuLy8gdGVzdHMgZnJvbSBzcGFtbWluZyB0aGUgY29uc29sZSwgZXNwZWNpYWxseSB3aXRoIHJlZCBlcnJvcnMgdGhhdFxuLy8gbWlnaHQgbG9vayBsaWtlIGEgZmFpbGluZyB0ZXN0LlxuTG9nLl9zdXBwcmVzcyA9IChjb3VudCkgPT4ge1xuICBzdXBwcmVzcyArPSBjb3VudDtcbn07XG5cbi8vIFJldHVybnMgaW50ZXJjZXB0ZWQgbGluZXMgYW5kIHJlc2V0cyB0aGUgaW50ZXJjZXB0IGNvdW50ZXIuXG5Mb2cuX2ludGVyY2VwdGVkID0gKCkgPT4ge1xuICBjb25zdCBsaW5lcyA9IGludGVyY2VwdGVkTGluZXM7XG4gIGludGVyY2VwdGVkTGluZXMgPSBbXTtcbiAgaW50ZXJjZXB0ID0gMDtcbiAgcmV0dXJuIGxpbmVzO1xufTtcblxuLy8gRWl0aGVyICdqc29uJyBvciAnY29sb3JlZC10ZXh0Jy5cbi8vXG4vLyBXaGVuIHRoaXMgaXMgc2V0IHRvICdqc29uJywgcHJpbnQgSlNPTiBkb2N1bWVudHMgdGhhdCBhcmUgcGFyc2VkIGJ5IGFub3RoZXJcbi8vIHByb2Nlc3MgKCdzYXRlbGxpdGUnIG9yICdtZXRlb3IgcnVuJykuIFRoaXMgb3RoZXIgcHJvY2VzcyBzaG91bGQgY2FsbFxuLy8gJ0xvZy5mb3JtYXQnIGZvciBuaWNlIG91dHB1dC5cbi8vXG4vLyBXaGVuIHRoaXMgaXMgc2V0IHRvICdjb2xvcmVkLXRleHQnLCBjYWxsICdMb2cuZm9ybWF0JyBiZWZvcmUgcHJpbnRpbmcuXG4vLyBUaGlzIHNob3VsZCBiZSB1c2VkIGZvciBsb2dnaW5nIGZyb20gd2l0aGluIHNhdGVsbGl0ZSwgc2luY2UgdGhlcmUgaXMgbm9cbi8vIG90aGVyIHByb2Nlc3MgdGhhdCB3aWxsIGJlIHJlYWRpbmcgaXRzIHN0YW5kYXJkIG91dHB1dC5cbkxvZy5vdXRwdXRGb3JtYXQgPSAnanNvbic7XG5cbmNvbnN0IExFVkVMX0NPTE9SUyA9IHtcbiAgZGVidWc6ICdncmVlbicsXG4gIC8vIGxlYXZlIGluZm8gYXMgdGhlIGRlZmF1bHQgY29sb3JcbiAgd2FybjogJ21hZ2VudGEnLFxuICBlcnJvcjogJ3JlZCdcbn07XG5cbmNvbnN0IE1FVEFfQ09MT1IgPSAnYmx1ZSc7XG5cbi8vIERlZmF1bHQgY29sb3JzIGNhdXNlIHJlYWRhYmlsaXR5IHByb2JsZW1zIG9uIFdpbmRvd3MgUG93ZXJzaGVsbCxcbi8vIHN3aXRjaCB0byBicmlnaHQgdmFyaWFudHMuIFdoaWxlIHN0aWxsIGNhcGFibGUgb2YgbWlsbGlvbnMgb2Zcbi8vIG9wZXJhdGlvbnMgcGVyIHNlY29uZCwgdGhlIGJlbmNobWFyayBzaG93ZWQgYSAyNSUrIGluY3JlYXNlIGluXG4vLyBvcHMgcGVyIHNlY29uZCAob24gTm9kZSA4KSBieSBjYWNoaW5nIFwicHJvY2Vzcy5wbGF0Zm9ybVwiLlxuY29uc3QgaXNXaW4zMiA9IHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJiBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInO1xuY29uc3QgcGxhdGZvcm1Db2xvciA9IChjb2xvcikgPT4ge1xuICBpZiAoaXNXaW4zMiAmJiB0eXBlb2YgY29sb3IgPT09ICdzdHJpbmcnICYmICFjb2xvci5lbmRzV2l0aCgnQnJpZ2h0JykpIHtcbiAgICByZXR1cm4gYCR7Y29sb3J9QnJpZ2h0YDtcbiAgfVxuICByZXR1cm4gY29sb3I7XG59O1xuXG4vLyBYWFggcGFja2FnZVxuY29uc3QgUkVTVFJJQ1RFRF9LRVlTID0gWyd0aW1lJywgJ3RpbWVJbmV4YWN0JywgJ2xldmVsJywgJ2ZpbGUnLCAnbGluZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAncHJvZ3JhbScsICdvcmlnaW5BcHAnLCAnc2F0ZWxsaXRlJywgJ3N0ZGVyciddO1xuXG5jb25zdCBGT1JNQVRURURfS0VZUyA9IFsuLi5SRVNUUklDVEVEX0tFWVMsICdhcHAnLCAnbWVzc2FnZSddO1xuXG5jb25zdCBsb2dJbkJyb3dzZXIgPSBvYmogPT4ge1xuICBjb25zdCBzdHIgPSBMb2cuZm9ybWF0KG9iaik7XG5cbiAgLy8gWFhYIFNvbWUgbGV2ZWxzIHNob3VsZCBiZSBwcm9iYWJseSBiZSBzZW50IHRvIHRoZSBzZXJ2ZXJcbiAgY29uc3QgbGV2ZWwgPSBvYmoubGV2ZWw7XG5cbiAgaWYgKCh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpICYmIGNvbnNvbGVbbGV2ZWxdKSB7XG4gICAgY29uc29sZVtsZXZlbF0oc3RyKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBYWFggVXNlcyBvZiBNZXRlb3IuX2RlYnVnIHNob3VsZCBwcm9iYWJseSBiZSByZXBsYWNlZCBieSBMb2cuZGVidWcgb3JcbiAgICAvLyAgICAgTG9nLmluZm8sIGFuZCB3ZSBzaG91bGQgaGF2ZSBhbm90aGVyIG5hbWUgZm9yIFwiZG8geW91ciBiZXN0IHRvXG4gICAgLy8gICAgIGNhbGwgY2FsbCBjb25zb2xlLmxvZ1wiLlxuICAgIE1ldGVvci5fZGVidWcoc3RyKTtcbiAgfVxufTtcblxuLy8gQHJldHVybnMge09iamVjdDogeyBsaW5lOiBOdW1iZXIsIGZpbGU6IFN0cmluZyB9fVxuTG9nLl9nZXRDYWxsZXJEZXRhaWxzID0gKCkgPT4ge1xuICBjb25zdCBnZXRTdGFjayA9ICgpID0+IHtcbiAgICAvLyBXZSBkbyBOT1QgdXNlIEVycm9yLnByZXBhcmVTdGFja1RyYWNlIGhlcmUgKGEgVjggZXh0ZW5zaW9uIHRoYXQgZ2V0cyB1cyBhXG4gICAgLy8gcHJlLXBhcnNlZCBzdGFjaykgc2luY2UgaXQncyBpbXBvc3NpYmxlIHRvIGNvbXBvc2UgaXQgd2l0aCB0aGUgdXNlIG9mXG4gICAgLy8gRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgdXNlZCBvbiB0aGUgc2VydmVyIGZvciBzb3VyY2UgbWFwcy5cbiAgICBjb25zdCBlcnIgPSBuZXcgRXJyb3I7XG4gICAgY29uc3Qgc3RhY2sgPSBlcnIuc3RhY2s7XG4gICAgcmV0dXJuIHN0YWNrO1xuICB9O1xuXG4gIGNvbnN0IHN0YWNrID0gZ2V0U3RhY2soKTtcblxuICBpZiAoIXN0YWNrKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLy8gbG9va2luZyBmb3IgdGhlIGZpcnN0IGxpbmUgb3V0c2lkZSB0aGUgbG9nZ2luZyBwYWNrYWdlIChvciBhblxuICAvLyBldmFsIGlmIHdlIGZpbmQgdGhhdCBmaXJzdClcbiAgbGV0IGxpbmU7XG4gIGNvbnN0IGxpbmVzID0gc3RhY2suc3BsaXQoJ1xcbicpLnNsaWNlKDEpO1xuICBmb3IgKGxpbmUgb2YgbGluZXMpIHtcbiAgICBpZiAobGluZS5tYXRjaCgvXlxccyphdCBldmFsIFxcKGV2YWwvKSkge1xuICAgICAgcmV0dXJuIHtmaWxlOiBcImV2YWxcIn07XG4gICAgfVxuXG4gICAgaWYgKCFsaW5lLm1hdGNoKC9wYWNrYWdlc1xcLyg/OmxvY2FsLXRlc3RbOl9dKT9sb2dnaW5nKD86XFwvfFxcLmpzKS8pKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBjb25zdCBkZXRhaWxzID0ge307XG5cbiAgLy8gVGhlIGZvcm1hdCBmb3IgRkYgaXMgJ2Z1bmN0aW9uTmFtZUBmaWxlUGF0aDpsaW5lTnVtYmVyJ1xuICAvLyBUaGUgZm9ybWF0IGZvciBWOCBpcyAnZnVuY3Rpb25OYW1lIChwYWNrYWdlcy9sb2dnaW5nL2xvZ2dpbmcuanM6ODEpJyBvclxuICAvLyAgICAgICAgICAgICAgICAgICAgICAncGFja2FnZXMvbG9nZ2luZy9sb2dnaW5nLmpzOjgxJ1xuICBjb25zdCBtYXRjaCA9IC8oPzpbQChdfCBhdCApKFteKF0rPyk6KFswLTk6XSspKD86XFwpfCQpLy5leGVjKGxpbmUpO1xuICBpZiAoIW1hdGNoKSB7XG4gICAgcmV0dXJuIGRldGFpbHM7XG4gIH1cblxuICAvLyBpbiBjYXNlIHRoZSBtYXRjaGVkIGJsb2NrIGhlcmUgaXMgbGluZTpjb2x1bW5cbiAgZGV0YWlscy5saW5lID0gbWF0Y2hbMl0uc3BsaXQoJzonKVswXTtcblxuICAvLyBQb3NzaWJsZSBmb3JtYXQ6IGh0dHBzOi8vZm9vLmJhci5jb20vc2NyaXB0cy9maWxlLmpzP3JhbmRvbT1mb29iYXJcbiAgLy8gWFhYOiBpZiB5b3UgY2FuIHdyaXRlIHRoZSBmb2xsb3dpbmcgaW4gYmV0dGVyIHdheSwgcGxlYXNlIGRvIGl0XG4gIC8vIFhYWDogd2hhdCBhYm91dCBldmFscz9cbiAgZGV0YWlscy5maWxlID0gbWF0Y2hbMV0uc3BsaXQoJy8nKS5zbGljZSgtMSlbMF0uc3BsaXQoJz8nKVswXTtcblxuICByZXR1cm4gZGV0YWlscztcbn07XG5cblsnZGVidWcnLCAnaW5mbycsICd3YXJuJywgJ2Vycm9yJ10uZm9yRWFjaCgobGV2ZWwpID0+IHtcbiAvLyBAcGFyYW0gYXJnIHtTdHJpbmd8T2JqZWN0fVxuIExvZ1tsZXZlbF0gPSAoYXJnKSA9PiB7XG4gIGlmIChzdXBwcmVzcykge1xuICAgIHN1cHByZXNzLS07XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IGludGVyY2VwdGVkID0gZmFsc2U7XG4gIGlmIChpbnRlcmNlcHQpIHtcbiAgICBpbnRlcmNlcHQtLTtcbiAgICBpbnRlcmNlcHRlZCA9IHRydWU7XG4gIH1cblxuICBsZXQgb2JqID0gKGFyZyA9PT0gT2JqZWN0KGFyZylcbiAgICAmJiAhKGFyZyBpbnN0YW5jZW9mIFJlZ0V4cClcbiAgICAmJiAhKGFyZyBpbnN0YW5jZW9mIERhdGUpKVxuICAgID8gYXJnXG4gICAgOiB7IG1lc3NhZ2U6IG5ldyBTdHJpbmcoYXJnKS50b1N0cmluZygpIH07XG5cbiAgUkVTVFJJQ1RFRF9LRVlTLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAob2JqW2tleV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2FuJ3Qgc2V0ICcke2tleX0nIGluIGxvZyBtZXNzYWdlYCk7XG4gICAgfVxuICB9KTtcblxuICBpZiAoaGFzT3duLmNhbGwob2JqLCAnbWVzc2FnZScpICYmIHR5cGVvZiBvYmoubWVzc2FnZSAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgJ21lc3NhZ2UnIGZpZWxkIGluIGxvZyBvYmplY3RzIG11c3QgYmUgYSBzdHJpbmdcIik7XG4gIH1cblxuICBpZiAoIW9iai5vbWl0Q2FsbGVyRGV0YWlscykge1xuICAgIG9iaiA9IHsgLi4uTG9nLl9nZXRDYWxsZXJEZXRhaWxzKCksIC4uLm9iaiB9O1xuICB9XG5cbiAgb2JqLnRpbWUgPSBuZXcgRGF0ZSgpO1xuICBvYmoubGV2ZWwgPSBsZXZlbDtcblxuICAvLyBYWFggYWxsb3cgeW91IHRvIGVuYWJsZSAnZGVidWcnLCBwcm9iYWJseSBwZXItcGFja2FnZVxuICBpZiAobGV2ZWwgPT09ICdkZWJ1ZycpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoaW50ZXJjZXB0ZWQpIHtcbiAgICBpbnRlcmNlcHRlZExpbmVzLnB1c2goRUpTT04uc3RyaW5naWZ5KG9iaikpO1xuICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmIChMb2cub3V0cHV0Rm9ybWF0ID09PSAnY29sb3JlZC10ZXh0Jykge1xuICAgICAgY29uc29sZS5sb2coTG9nLmZvcm1hdChvYmosIHtjb2xvcjogdHJ1ZX0pKTtcbiAgICB9IGVsc2UgaWYgKExvZy5vdXRwdXRGb3JtYXQgPT09ICdqc29uJykge1xuICAgICAgY29uc29sZS5sb2coRUpTT04uc3RyaW5naWZ5KG9iaikpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gbG9nZ2luZyBvdXRwdXQgZm9ybWF0OiAke0xvZy5vdXRwdXRGb3JtYXR9YCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGxvZ0luQnJvd3NlcihvYmopO1xuICB9XG59O1xufSk7XG5cblxuLy8gdHJpZXMgdG8gcGFyc2UgbGluZSBhcyBFSlNPTi4gcmV0dXJucyBvYmplY3QgaWYgcGFyc2UgaXMgc3VjY2Vzc2Z1bCwgb3IgbnVsbCBpZiBub3RcbkxvZy5wYXJzZSA9IChsaW5lKSA9PiB7XG4gIGxldCBvYmogPSBudWxsO1xuICBpZiAobGluZSAmJiBsaW5lLnN0YXJ0c1dpdGgoJ3snKSkgeyAvLyBtaWdodCBiZSBqc29uIGdlbmVyYXRlZCBmcm9tIGNhbGxpbmcgJ0xvZydcbiAgICB0cnkgeyBvYmogPSBFSlNPTi5wYXJzZShsaW5lKTsgfSBjYXRjaCAoZSkge31cbiAgfVxuXG4gIC8vIFhYWCBzaG91bGQgcHJvYmFibHkgY2hlY2sgZmllbGRzIG90aGVyIHRoYW4gJ3RpbWUnXG4gIGlmIChvYmogJiYgb2JqLnRpbWUgJiYgKG9iai50aW1lIGluc3RhbmNlb2YgRGF0ZSkpIHtcbiAgICByZXR1cm4gb2JqO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59O1xuXG4vLyBmb3JtYXRzIGEgbG9nIG9iamVjdCBpbnRvIGNvbG9yZWQgaHVtYW4gYW5kIG1hY2hpbmUtcmVhZGFibGUgdGV4dFxuTG9nLmZvcm1hdCA9IChvYmosIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBvYmogPSB7IC4uLm9iaiB9OyAvLyBkb24ndCBtdXRhdGUgdGhlIGFyZ3VtZW50XG4gIGxldCB7XG4gICAgdGltZSxcbiAgICB0aW1lSW5leGFjdCxcbiAgICBsZXZlbCA9ICdpbmZvJyxcbiAgICBmaWxlLFxuICAgIGxpbmU6IGxpbmVOdW1iZXIsXG4gICAgYXBwOiBhcHBOYW1lID0gJycsXG4gICAgb3JpZ2luQXBwLFxuICAgIG1lc3NhZ2UgPSAnJyxcbiAgICBwcm9ncmFtID0gJycsXG4gICAgc2F0ZWxsaXRlID0gJycsXG4gICAgc3RkZXJyID0gJycsXG4gIH0gPSBvYmo7XG5cbiAgaWYgKCEodGltZSBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiJ3RpbWUnIG11c3QgYmUgYSBEYXRlIG9iamVjdFwiKTtcbiAgfVxuXG4gIEZPUk1BVFRFRF9LRVlTLmZvckVhY2goKGtleSkgPT4geyBkZWxldGUgb2JqW2tleV07IH0pO1xuXG4gIGlmIChPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA+IDApIHtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgbWVzc2FnZSArPSAnICc7XG4gICAgfVxuICAgIG1lc3NhZ2UgKz0gRUpTT04uc3RyaW5naWZ5KG9iaik7XG4gIH1cblxuICBjb25zdCBwYWQyID0gbiA9PiBuLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbiAgY29uc3QgcGFkMyA9IG4gPT4gbi50b1N0cmluZygpLnBhZFN0YXJ0KDMsICcwJyk7XG5cbiAgY29uc3QgZGF0ZVN0YW1wID0gdGltZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCkgK1xuICAgIHBhZDIodGltZS5nZXRNb250aCgpICsgMSAvKjAtYmFzZWQqLykgK1xuICAgIHBhZDIodGltZS5nZXREYXRlKCkpO1xuICBjb25zdCB0aW1lU3RhbXAgPSBwYWQyKHRpbWUuZ2V0SG91cnMoKSkgK1xuICAgICAgICAnOicgK1xuICAgICAgICBwYWQyKHRpbWUuZ2V0TWludXRlcygpKSArXG4gICAgICAgICc6JyArXG4gICAgICAgIHBhZDIodGltZS5nZXRTZWNvbmRzKCkpICtcbiAgICAgICAgJy4nICtcbiAgICAgICAgcGFkMyh0aW1lLmdldE1pbGxpc2Vjb25kcygpKTtcblxuICAvLyBlZyBpbiBTYW4gRnJhbmNpc2NvIGluIEp1bmUgdGhpcyB3aWxsIGJlICcoLTcpJ1xuICBjb25zdCB1dGNPZmZzZXRTdHIgPSBgKCR7KC0obmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjApKX0pYDtcblxuICBsZXQgYXBwSW5mbyA9ICcnO1xuICBpZiAoYXBwTmFtZSkge1xuICAgIGFwcEluZm8gKz0gYXBwTmFtZTtcbiAgfVxuICBpZiAob3JpZ2luQXBwICYmIG9yaWdpbkFwcCAhPT0gYXBwTmFtZSkge1xuICAgIGFwcEluZm8gKz0gYCB2aWEgJHtvcmlnaW5BcHB9YDtcbiAgfVxuICBpZiAoYXBwSW5mbykge1xuICAgIGFwcEluZm8gPSBgWyR7YXBwSW5mb31dIGA7XG4gIH1cblxuICBjb25zdCBzb3VyY2VJbmZvUGFydHMgPSBbXTtcbiAgaWYgKHByb2dyYW0pIHtcbiAgICBzb3VyY2VJbmZvUGFydHMucHVzaChwcm9ncmFtKTtcbiAgfVxuICBpZiAoZmlsZSkge1xuICAgIHNvdXJjZUluZm9QYXJ0cy5wdXNoKGZpbGUpO1xuICB9XG4gIGlmIChsaW5lTnVtYmVyKSB7XG4gICAgc291cmNlSW5mb1BhcnRzLnB1c2gobGluZU51bWJlcik7XG4gIH1cblxuICBsZXQgc291cmNlSW5mbyA9ICFzb3VyY2VJbmZvUGFydHMubGVuZ3RoID9cbiAgICAnJyA6IGAoJHtzb3VyY2VJbmZvUGFydHMuam9pbignOicpfSkgYDtcblxuICBpZiAoc2F0ZWxsaXRlKVxuICAgIHNvdXJjZUluZm8gKz0gYFske3NhdGVsbGl0ZX1dYDtcblxuICBjb25zdCBzdGRlcnJJbmRpY2F0b3IgPSBzdGRlcnIgPyAnKFNUREVSUikgJyA6ICcnO1xuXG4gIGNvbnN0IG1ldGFQcmVmaXggPSBbXG4gICAgbGV2ZWwuY2hhckF0KDApLnRvVXBwZXJDYXNlKCksXG4gICAgZGF0ZVN0YW1wLFxuICAgICctJyxcbiAgICB0aW1lU3RhbXAsXG4gICAgdXRjT2Zmc2V0U3RyLFxuICAgIHRpbWVJbmV4YWN0ID8gJz8gJyA6ICcgJyxcbiAgICBhcHBJbmZvLFxuICAgIHNvdXJjZUluZm8sXG4gICAgc3RkZXJySW5kaWNhdG9yXS5qb2luKCcnKTtcblxuICBjb25zdCBwcmV0dGlmeSA9IGZ1bmN0aW9uIChsaW5lLCBjb2xvcikge1xuICAgIHJldHVybiAob3B0aW9ucy5jb2xvciAmJiBNZXRlb3IuaXNTZXJ2ZXIgJiYgY29sb3IpID9cbiAgICAgIHJlcXVpcmUoJ2NsaS1jb2xvcicpW2NvbG9yXShsaW5lKSA6IGxpbmU7XG4gIH07XG5cbiAgcmV0dXJuIHByZXR0aWZ5KG1ldGFQcmVmaXgsIHBsYXRmb3JtQ29sb3Iob3B0aW9ucy5tZXRhQ29sb3IgfHwgTUVUQV9DT0xPUikpICtcbiAgICBwcmV0dGlmeShtZXNzYWdlLCBwbGF0Zm9ybUNvbG9yKExFVkVMX0NPTE9SU1tsZXZlbF0pKTtcbn07XG5cbi8vIFR1cm4gYSBsaW5lIG9mIHRleHQgaW50byBhIGxvZ2dhYmxlIG9iamVjdC5cbi8vIEBwYXJhbSBsaW5lIHtTdHJpbmd9XG4vLyBAcGFyYW0gb3ZlcnJpZGUge09iamVjdH1cbkxvZy5vYmpGcm9tVGV4dCA9IChsaW5lLCBvdmVycmlkZSkgPT4ge1xuICByZXR1cm4ge1xuICAgIG1lc3NhZ2U6IGxpbmUsXG4gICAgbGV2ZWw6ICdpbmZvJyxcbiAgICB0aW1lOiBuZXcgRGF0ZSgpLFxuICAgIHRpbWVJbmV4YWN0OiB0cnVlLFxuICAgIC4uLm92ZXJyaWRlXG4gIH07XG59O1xuXG5leHBvcnQgeyBMb2cgfTtcbiJdfQ==
