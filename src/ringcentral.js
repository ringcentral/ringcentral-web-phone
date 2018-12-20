(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require(undefined), require(undefined), require(undefined));
	else if(typeof define === 'function' && define.amd)
		define(["pubnub", "es6-promise", "fetch-ponyfill"], factory);
	else if(typeof exports === 'object')
		exports["SDK"] = factory(require(undefined), require(undefined), require(undefined));
	else
		root["RingCentral"] = root["RingCentral"] || {}, root["RingCentral"]["SDK"] = factory(root[undefined], root[undefined], root[undefined]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_12__, __WEBPACK_EXTERNAL_MODULE_13__, __WEBPACK_EXTERNAL_MODULE_14__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

/**
 * @namespace RingCentral
 */
var objectAssign = __webpack_require__(1);
var Cache = __webpack_require__(2);
var Client = __webpack_require__(3);
var Externals = __webpack_require__(11);
var Platform = __webpack_require__(15);
var Subscription = __webpack_require__(18);
var CachedSubscription = __webpack_require__(19);
var Constants = __webpack_require__(17);

/**
 * @constructor
 * @param {string} options.server
 * @param {string} options.appSecret
 * @param {string} options.appKey
 * @param {string} [options.cachePrefix]
 * @param {string} [options.appName]
 * @param {string} [options.appVersion]
 * @param {string} [options.redirectUri]
 * @param {PubNub} [options.PubNub]
 * @param {function(new:Promise)} [options.Promise]
 * @param {Storage} [options.localStorage]
 * @param {fetch} [options.fetch]
 * @param {function(new:Request)} [options.Request]
 * @param {function(new:Response)} [options.Response]
 * @param {function(new:Headers)} [options.Headers]
 * @param {int} [options.refreshDelayMs]
 * @param {int} [options.refreshHandicapMs]
 * @param {boolean} [options.clearCacheOnRefreshError]
 * @property {Externals} _externals
 * @property {Cache} _cache
 * @property {Client} _client
 * @property {Platform} _platform
 */
function SDK(options) {

    /** @private */
    this._externals = new Externals(options);

    /** @private */
    this._cache = new Cache({
        externals: this._externals,
        prefix: options.cachePrefix
    });

    /** @private */
    this._client = new Client(this._externals);

    /** @private */
    this._platform = new Platform(objectAssign({}, options, {
        externals: this._externals,
        client: this._client,
        cache: this._cache
    }));

}

SDK.version = Constants.version;

SDK.server = {
    sandbox: 'https://platform.devtest.ringcentral.com',
    production: 'https://platform.ringcentral.com'
};

/**
 * @return {Platform}
 */
SDK.prototype.platform = function() {
    return this._platform;
};

/**
 * @return {Cache}
 */
SDK.prototype.cache = function() {
    return this._cache;
};

/**
 * @param {int} [options.pollInterval]
 * @param {int} [options.renewHandicapMs]
 * @return {Subscription}
 */
SDK.prototype.createSubscription = function(options) {
    return new Subscription(objectAssign({}, options, {
        externals: this._externals,
        platform: this._platform
    }));
};

/**
 * @param {string} options.cacheKey
 * @param {int} [options.pollInterval]
 * @param {int} [options.renewHandicapMs]
 * @return {CachedSubscription}
 */
SDK.prototype.createCachedSubscription = function(options) {

    if (typeof arguments[0] == 'string') {
        options = {cacheKey: arguments[0].toString()};
    } else {
        options = options || {};
    }

    return new CachedSubscription(objectAssign({}, options, {
        externals: this._externals,
        platform: this._platform,
        cache: this._cache
    }));

};

SDK.handleLoginRedirect = function(origin) {

    var response = window.location.hash ? window.location.hash : window.location.search;
    var msg = {};
    msg[Constants.authResponseProperty] = response;
    window.opener.postMessage(msg, origin || window.location.origin);

};

module.exports = SDK;

/***/ },
/* 1 */
/***/ function(module, exports) {

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ },
/* 2 */
/***/ function(module, exports) {

/**
 * @param {Externals} options.externals
 * @param {string} [options.prefix]
 * @property {Externals} _externals
 */
function Cache(options) {

    /** @private */
    this._prefix = options.prefix || Cache.defaultPrefix;

    /** @private */
    this._externals = options.externals;

}

Cache.defaultPrefix = 'rc-';

Cache.prototype.setItem = function(key, data) {
    this._externals.localStorage[this._prefixKey(key)] = JSON.stringify(data);
    return this;
};

Cache.prototype.removeItem = function(key) {
    delete this._externals.localStorage[this._prefixKey(key)];
    return this;
};

Cache.prototype.getItem = function(key) {
    var item = this._externals.localStorage[this._prefixKey(key)];
    if (!item) return null;
    return JSON.parse(item);
};

Cache.prototype.clean = function() {

    for (var key in this._externals.localStorage) {

        if (!this._externals.localStorage.hasOwnProperty(key)) continue;

        if (key.indexOf(this._prefix) === 0) {
            delete this._externals.localStorage[key];
        }

    }

    return this;

};

Cache.prototype._prefixKey = function(key) {
    return this._prefix + key;
};

module.exports = Cache;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

var isPlainObject = __webpack_require__(4);
var EventEmitter = __webpack_require__(6).EventEmitter;
var ApiResponse = __webpack_require__(7);
var qs = __webpack_require__(8);

function findHeaderName(name, headers) {
    name = name.toLowerCase();
    return Object.keys(headers).reduce(function(res, key) {
        if (res) return res;
        if (name == key.toLowerCase()) return key;
        return res;
    }, null);
}

/**
 * @param {Externals} externals
 * @property {Externals} _externals
 */
function Client(externals) {

    EventEmitter.call(this);

    /** @private */
    this._externals = externals;

    this.events = {
        beforeRequest: 'beforeRequest',
        requestSuccess: 'requestSuccess',
        requestError: 'requestError'
    };

}

Client._allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

Client.prototype = Object.create(EventEmitter.prototype);

/**
 * @param {Request} request
 * @return {Promise<ApiResponse>}
 */
Client.prototype.sendRequest = function(request) {

    var apiResponse = new ApiResponse({
        externals: this._externals,
        request: request
    });

    return (new this._externals.Promise(function(resolve) {

        //TODO Stop request if listeners return false
        this.emit(this.events.beforeRequest, apiResponse);

        resolve(this._loadResponse(request));

    }.bind(this))).then(function(response) {

        return apiResponse.receiveResponse(response);

    }).then(function() {

        if (!apiResponse.ok()) throw new Error('Response has unsuccessful status');

        this.emit(this.events.requestSuccess, apiResponse);

        return apiResponse;

    }.bind(this)).catch(function(e) {

        if (!e.apiResponse) e = this.makeError(e, apiResponse);

        this.emit(this.events.requestError, e);

        throw e;

    }.bind(this));

};

/**
 * @param {Request} request
 * @return {Promise<Response>}
 * @private
 */
Client.prototype._loadResponse = function(request) {
    return this._externals.fetch.call(null, request);
};

/**
 * Wraps the JS Error object with transaction information
 * @param {Error|IApiError} e
 * @param {ApiResponse} apiResponse
 * @return {IApiError}
 */
Client.prototype.makeError = function(e, apiResponse) {

    // Wrap only if regular error
    if (!e.hasOwnProperty('apiResponse') && !e.hasOwnProperty('originalMessage')) {

        e.apiResponse = apiResponse;
        e.originalMessage = e.message;
        e.message = (apiResponse && apiResponse.error(true)) || e.originalMessage;

    }

    return e;

};

/**
 *
 * @param {object} init
 * @param {object} [init.url]
 * @param {object} [init.body]
 * @param {string} [init.method]
 * @param {object} [init.query]
 * @param {object} [init.headers]
 * @param {object} [init.credentials]
 * @param {object} [init.mode]
 * @return {Request}
 */
Client.prototype.createRequest = function(init) {

    init = init || {};
    init.headers = init.headers || {};

    // Sanity checks
    if (!init.url) throw new Error('Url is not defined');
    if (!init.method) init.method = 'GET';
    init.method = init.method.toUpperCase();
    if (init.method && Client._allowedMethods.indexOf(init.method) < 0) {
        throw new Error('Method has wrong value: ' + init.method);
    }

    // Defaults
    init.credentials = init.credentials || 'include';
    init.mode = init.mode || 'cors';

    // Append Query String
    if (init.query) {
        init.url = init.url + (init.url.indexOf('?') > -1 ? '&' : '?') + qs.stringify(init.query);
    }

    if (!(findHeaderName('Accept', init.headers))) {
        init.headers.Accept = ApiResponse._jsonContentType;
    }

    // Serialize body
    if (isPlainObject(init.body) || !init.body) {

        var contentTypeHeaderName = findHeaderName(ApiResponse._contentType, init.headers);

        if (!contentTypeHeaderName) {
            contentTypeHeaderName = ApiResponse._contentType;
            init.headers[contentTypeHeaderName] = ApiResponse._jsonContentType;
        }

        var contentType = init.headers[contentTypeHeaderName];

        // Assign a new encoded body
        if (contentType.indexOf(ApiResponse._jsonContentType) > -1) {
            if ((init.method === 'GET' || init.method === 'HEAD') && !!init.body) {
                // oddly setting body to null still result in TypeError in phantomjs
                init.body = undefined;
            } else {
                init.body = JSON.stringify(init.body);
            }

        } else if (contentType.indexOf(ApiResponse._urlencodedContentType) > -1) {
            init.body = qs.stringify(init.body);
        }

    }

    // Create a request with encoded body
    var req = new this._externals.Request(init.url, init);

    // Keep the original body accessible directly (for mocks)
    req.originalBody = init.body;

    return req;

};

/**
 * @typedef {object} IApiError
 * @property {string} stack
 * @property {string} originalMessage
 * @property {ApiResponse} apiResponse
 */

module.exports = Client;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isObject = __webpack_require__(5);

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

module.exports = function isPlainObject(o) {
  var ctor,prot;
  
  if (isObjectObject(o) === false) return false;
  
  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;
  
  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;
  
  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }
  
  // Most likely a plain Object
  return true;
};


/***/ },
/* 5 */
/***/ function(module, exports) {

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function isObject(val) {
  return val != null && typeof val === 'object'
    && !Array.isArray(val);
};


/***/ },
/* 6 */
/***/ function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ },
/* 7 */
/***/ function(module, exports) {

/**
 * @param {Externals} options.externals
 * @param {Request} [options.request]
 * @param {Response} [options.response]
 * @param {string} [options.responseText]
 * @property {Externals} _externals
 * @property {Request} _request
 * @property {Response} _response
 * @property {string} _text
 * @property {object} _json
 * @property {ApiResponse[]} _multipart
 */
function ApiResponse(options) {

    /** @private */
    this._externals = options.externals;

    /** @private */
    this._request = options.request;

    /** @private */
    this._response = options.response;

    /** @private */
    this._text = options.responseText || '';

    /** @private */
    this._json = null;

    /** @private */
    this._multipart = [];

}

ApiResponse._contentType = 'Content-Type';
ApiResponse._jsonContentType = 'application/json';
ApiResponse._multipartContentType = 'multipart/mixed';
ApiResponse._urlencodedContentType = 'application/x-www-form-urlencoded';
ApiResponse._headerSeparator = ':';
ApiResponse._bodySeparator = '\n\n';
ApiResponse._boundarySeparator = '--';
ApiResponse._unauthorizedStatus = 401;

/**
 * @param {Response} response
 * @return {Promise<ApiResponse>}
 */
ApiResponse.prototype.receiveResponse = function(response) {

    this._response = response;

    return (new this._externals.Promise(function(resolve) {

        // Ignore if not textual type
        if (!this._isMultipart() && !this._isJson()) return resolve('');

        return resolve(this.response().text());

    }.bind(this))).then(function(text) {

        this._text = text;
        return text;

    }.bind(this));

};

/**
 * @return {Response}
 */
ApiResponse.prototype.response = function() {
    return this._response;
};

/**
 * @return {Request}
 */
ApiResponse.prototype.request = function() {
    return this._request;
};

/**
 * @return {boolean}
 */
ApiResponse.prototype.ok = function() {
    return this._response && this._response.ok;
};

/**
 * @return {string}
 */
ApiResponse.prototype.text = function() {
    // Since we read text only in case JSON or Multipart
    if (!this._isJson() && !this._isMultipart()) throw new Error('Response is not text');
    return this._text;
};

/**
 * @return {object}
 */
ApiResponse.prototype.json = function() {
    if (!this._isJson()) throw new Error('Response is not JSON');
    if (!this._json) {
        this._json = this._text ? JSON.parse(this._text) : null;
    }
    return this._json;
};

/**
 * @param [skipOKCheck]
 * @return {string}
 */
ApiResponse.prototype.error = function(skipOKCheck) {

    if (this.ok() && !skipOKCheck) return null;

    var message = (this._response && this._response.status ? this._response.status + ' ' : '') +
                  (this._response && this._response.statusText ? this._response.statusText : '');

    try {

        if (this.json().message) message = this.json().message;
        if (this.json().error_description) message = this.json().error_description;
        if (this.json().description) message = this.json().description;

    } catch (e) {}

    return message;

};

/**
 * If it is not known upfront what would be the response, client code can treat any response as multipart
 * @return {ApiResponse[]}
 */
ApiResponse.prototype.toMultipart = function() {
    if (!this._isMultipart()) return [this];
    return this.multipart();
};

/**
 * @return {ApiResponse[]}
 */
ApiResponse.prototype.multipart = function() {

    if (!this._isMultipart()) throw new Error('Response is not multipart');

    if (!this._multipart.length) {

        // Step 1. Split multipart response

        var text = this.text();

        if (!text) throw new Error('No response body');

        var boundary = this._getContentType().match(/boundary=([^;]+)/i)[1];

        if (!boundary) throw new Error('Cannot find boundary');

        var parts = text.toString().split(ApiResponse._boundarySeparator + boundary);

        if (parts[0].trim() === '') parts.shift();
        if (parts[parts.length - 1].trim() == ApiResponse._boundarySeparator) parts.pop();

        if (parts.length < 1) throw new Error('No parts in body');

        // Step 2. Parse status info

        var statusInfo = this._create(parts.shift(), this._response.status, this._response.statusText).json();

        // Step 3. Parse all other parts

        this._multipart = parts.map(function(part, i) {

            var status = statusInfo.response[i].status;

            return this._create(part, status);

        }.bind(this));

    }

    return this._multipart;

};

/**
 * @private
 */
ApiResponse.prototype._isContentType = function(contentType) {
    return this._getContentType().indexOf(contentType) > -1;
};

/**
 * @private
 */
ApiResponse.prototype._getContentType = function() {
    return this._response.headers.get(ApiResponse._contentType) || '';
};

/**
 * @private
 */
ApiResponse.prototype._isMultipart = function() {
    return this._isContentType(ApiResponse._multipartContentType);
};

/**
 * @private
 */
ApiResponse.prototype._isJson = function() {
    return this._isContentType(ApiResponse._jsonContentType);
};

/**
 * Method is used to create ApiResponse object from string parts of multipart/mixed response
 * @param {string} [text]
 * @param {number} [status]
 * @param {string} [statusText]
 * @private
 * @return {ApiResponse}
 */
ApiResponse.prototype._create = function(text, status, statusText) {

    text = text || '';
    status = status || 200;
    statusText = statusText || 'OK';

    text = text.replace(/\r/g, '');

    var headers = new this._externals.Headers(),
        headersAndBody = text.split(ApiResponse._bodySeparator),
        headersText = (headersAndBody.length > 1) ? headersAndBody.shift() : '';

    text = headersAndBody.length > 0 ? headersAndBody.join(ApiResponse._bodySeparator) : null;

    (headersText || '')
        .split('\n')
        .forEach(function(header) {

            var split = header.trim().split(ApiResponse._headerSeparator),
                key = split.shift().trim(),
                value = split.join(ApiResponse._headerSeparator).trim();

            if (key) headers.append(key, value);

        });

    var response = new this._externals.Response(text, {
        headers: headers,
        status: status,
        statusText: statusText
    });

    return new ApiResponse({
        externals: this._externals,
        request: null,
        response: response,
        responseText: text
    });

};

module.exports = ApiResponse;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.decode = exports.parse = __webpack_require__(9);
exports.encode = exports.stringify = __webpack_require__(10);


/***/ },
/* 9 */
/***/ function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (Array.isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};


/***/ },
/* 10 */
/***/ function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return Object.keys(obj).map(function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (Array.isArray(obj[k])) {
        return obj[k].map(function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var pubnub = __webpack_require__(12);
var es6Promise = __webpack_require__(13);
var FetchPonyfill = __webpack_require__(14);

var root = (typeof window !== "undefined" && window) ||
           (typeof global !== "undefined" && global) ||
           (function(){ return this; })();

/**
 * @constructor
 * @param {PubNub} [options.PubNub]
 * @param {function(new:Promise)} [options.Promise]
 * @param {Storage} [options.localStorage]
 * @param {fetch} [options.fetch]
 * @param {function(new:Request)} [options.Request]
 * @param {function(new:Response)} [options.Response]
 * @param {function(new:Headers)} [options.Headers]
 * @property {PubNub} PubNub
 * @property {Storage} localStorage
 * @property {function(new:Promise)} Promise
 * @property {fetch} fetch
 * @property {function(new:Request)} Request
 * @property {function(new:Response)} Response
 * @property {function(new:Headers)} Headers
 */
function Externals(options) {

    options = options || {};

    this.PubNub = options.PubNub || root.PubNub || pubnub;
    this.localStorage = options.localStorage || ((typeof root.localStorage !== 'undefined') ? root.localStorage : {});
    this.Promise = options.Promise || root.Promise || (es6Promise && es6Promise.Promise);

    var fetchPonyfill = FetchPonyfill ? FetchPonyfill({Promise: this.Promise}) : {};

    this.fetch = options.fetch || root.fetch || fetchPonyfill.fetch;
    this.Request = options.Request || root.Request || fetchPonyfill.Request;
    this.Response = options.Response || root.Response || fetchPonyfill.Response;
    this.Headers = options.Headers || root.Headers || fetchPonyfill.Headers;

    if (!this.fetch || !this.Response || !this.Request || !this.Headers) {
        throw new Error('Fetch API is missing');
    }

    if (!this.Promise) {
        throw new Error('Promise is missing');
    }

    if (!this.localStorage) {
        throw new Error('LocalStorage is missing');
    }

    if (!this.PubNub) {
        throw new Error('PubNub is missing');
    }

}

module.exports = Externals;

/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 12 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ },
/* 13 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_13__;

/***/ },
/* 14 */
/***/ function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_14__;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(6).EventEmitter;
var qs = __webpack_require__(8);
var objectAssign = __webpack_require__(1);
var Auth = __webpack_require__(16);
var Constants = __webpack_require__(17);
var ApiResponse = __webpack_require__(7);

/**
 * @constructor
 * @param {string} options.server
 * @param {string} options.appSecret
 * @param {string} options.appKey
 * @param {string} [options.appName]
 * @param {string} [options.appVersion]
 * @param {string} [options.redirectUri]
 * @param {int} [options.refreshDelayMs]
 * @param {int} [options.refreshHandicapMs]
 * @param {boolean} [options.clearCacheOnRefreshError]
 * @param {Externals} options.externals
 * @param {Cache} options.cache
 * @param {Client} options.client
 * @property {Externals} _externals
 * @property {Cache} _cache
 * @property {Client} _client
 * @property {Promise<ApiResponse>} _refreshPromise
 * @property {Auth} _auth
 */
function Platform(options) {

    EventEmitter.call(this);

    this.events = {
        beforeLogin: 'beforeLogin',
        loginSuccess: 'loginSuccess',
        loginError: 'loginError',
        beforeRefresh: 'beforeRefresh',
        refreshSuccess: 'refreshSuccess',
        refreshError: 'refreshError',
        beforeLogout: 'beforeLogout',
        logoutSuccess: 'logoutSuccess',
        logoutError: 'logoutError'
    };

    options = options || {};

    /** @private */
    this._server = options.server;

    /** @private */
    this._appKey = options.appKey;

    /** @private */
    this._appSecret = options.appSecret;

    /** @private */
    this._redirectUri = options.redirectUri || '';

    /** @private */
    this._refreshDelayMs = options.refreshDelayMs || 100;

    /** @private */
    this._clearCacheOnRefreshError = typeof options.clearCacheOnRefreshError !== 'undefined' ?
                                     options.clearCacheOnRefreshError :
                                     true;

    /** @private */
    this._userAgent = (options.appName ?
                      (options.appName + (options.appVersion ? '/' + options.appVersion : '')) + ' ' :
                       '') + 'RCJSSDK/' + Constants.version;

    /** @private */
    this._externals = options.externals;

    /** @private */
    this._cache = options.cache;

    /** @private */
    this._client = options.client;

    /** @private */
    this._refreshPromise = null;

    /** @private */
    this._auth = new Auth({
        cache: this._cache,
        cacheId: Platform._cacheId,
        refreshHandicapMs: options.refreshHandicapMs
    });

}

Platform._urlPrefix = '/restapi';
Platform._apiVersion = 'v1.0';
Platform._tokenEndpoint = '/restapi/oauth/token';
Platform._revokeEndpoint = '/restapi/oauth/revoke';
Platform._authorizeEndpoint = '/restapi/oauth/authorize';
Platform._cacheId = 'platform';

Platform.prototype = Object.create(EventEmitter.prototype);

Platform.prototype.delay = function(timeout) {
    return new this._externals.Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(null);
        }, timeout);
    });
};

/**
 * @return {Auth}
 */
Platform.prototype.auth = function() {
    return this._auth;
};

/**
 * @return {Client}
 */
Platform.prototype.client = function() {
    return this._client;
};

/**
 * @param {string} path
 * @param {object} [options]
 * @param {boolean} [options.addServer]
 * @param {string} [options.addMethod]
 * @param {boolean} [options.addToken]
 * @return {string}
 */
Platform.prototype.createUrl = function(path, options) {

    path = path || '';
    options = options || {};

    var builtUrl = '',
        hasHttp = path.indexOf('http://') != -1 || path.indexOf('https://') != -1;

    if (options.addServer && !hasHttp) builtUrl += this._server;

    if (path.indexOf(Platform._urlPrefix) == -1 && !hasHttp) builtUrl += Platform._urlPrefix + '/' + Platform._apiVersion;

    builtUrl += path;

    if (options.addMethod || options.addToken) builtUrl += (path.indexOf('?') > -1 ? '&' : '?');

    if (options.addMethod) builtUrl += '_method=' + options.addMethod;
    if (options.addToken) builtUrl += (options.addMethod ? '&' : '') + 'access_token=' + this._auth.accessToken();

    return builtUrl;

};

/**
 * @param {string} [options.redirectUri] Overrides default RedirectURI
 * @param {string} [options.state]
 * @param {string} [options.brandId]
 * @param {string} [options.display]
 * @param {string} [options.prompt]
 * @param {boolean} [options.implicit] Use Implicit Grant flow
 * @return {string}
 */
Platform.prototype.loginUrl = function(options) {

    options = options || {};

    return this.createUrl(Platform._authorizeEndpoint + '?' + qs.stringify({
            'response_type': options.implicit ? 'token' : 'code',
            'redirect_uri': options.redirectUri || this._redirectUri,
            'client_id': this._appKey,
            'state': options.state || '',
            'brand_id': options.brandId || '',
            'display': options.display || '',
            'prompt': options.prompt || ''
        }), {addServer: true});

};

/**
 * @param {string} url
 * @return {Object}
 */
Platform.prototype.parseLoginRedirect = function(url) {

    function getParts(url, separator) {
        return url.split(separator).reverse()[0];
    }

    var response = (url.indexOf('#') === 0 && getParts(url, '#')) ||
                   (url.indexOf('?') === 0 && getParts(url, '?')) ||
                   null;

    if (!response) throw new Error('Unable to parse response');

    var queryString = qs.parse(response);

    if (!queryString) throw new Error('Unable to parse response');

    var error = queryString.error_description || queryString.error;

    if (error) {
        var e = new Error(error);
        e.error = queryString.error;
        throw e;
    }

    return queryString;

};

/**
 * Convenience method to handle 3-legged OAuth
 *
 * Attention! This is an experimental method and it's signature and behavior may change without notice.
 *
 * @experimental
 * @param {string} options.url
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {object} [options.login] additional options for login()
 * @param {string} [options.origin]
 * @param {string} [options.property] name of window.postMessage's event data property
 * @param {string} [options.target] target for window.open()
 * @return {Promise}
 */
Platform.prototype.loginWindow = function(options) {

    return new this._externals.Promise(function(resolve, reject) {

        if (typeof window === 'undefined') throw new Error('This method can be used only in browser');

        if (!options.url) throw new Error('Missing mandatory URL parameter');

        options = options || {};
        options.url = options.url || 400;
        options.width = options.width || 400;
        options.height = options.height || 600;
        options.origin = options.origin || window.location.origin;
        options.property = options.property || Constants.authResponseProperty;
        options.target = options.target || '_blank';

        var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (options.width / 2)) + dualScreenLeft;
        var top = ((height / 2) - (options.height / 2)) + dualScreenTop;
        var win = window.open(options.url, '_blank', (options.target == '_blank') ? 'scrollbars=yes, status=yes, width=' + options.width + ', height=' + options.height + ', left=' + left + ', top=' + top : '');

        if(!win) {
            throw new Error('Could not open login window. Please allow popups for this site');
        }

        if (win.focus) win.focus();

        var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
        var eventRemoveMethod = eventMethod == 'addEventListener' ? 'removeEventListener' : 'detachEvent';
        var messageEvent = eventMethod == 'addEventListener' ? 'message' : 'onmessage';

        var eventListener = function(e) {

            try {

                if (e.origin != options.origin) return;
                if (!e.data || !e.data[options.property]) return; // keep waiting

                win.close();
                window[eventRemoveMethod](messageEvent, eventListener);


                var loginOptions = this.parseLoginRedirect(e.data[options.property]);

                if (!loginOptions.code && !loginOptions.access_token) throw new Error('No authorization code or token');

                resolve(loginOptions);

                /* jshint -W002 */
            } catch (e) {
                reject(e);
            }

        }.bind(this);

        window[eventMethod](messageEvent, eventListener, false);

    }.bind(this));

};

/**
 * @return {Promise<boolean>}
 */
Platform.prototype.loggedIn = function() {

    return this.ensureLoggedIn().then(function() {
        return true;
    }).catch(function() {
        return false;
    });

};

/**
 * @param {string} options.username
 * @param {string} options.password
 * @param {string} [options.extension]
 * @param {string} [options.code]
 * @param {string} [options.redirectUri]
 * @param {string} [options.endpointId]
 * @param {string} [options.accessTokenTtl]
 * @param {string} [options.refreshTokenTtl]
 * @param {string} [options.access_token]
 * @returns {Promise<ApiResponse>}
 */
Platform.prototype.login = function(options) {

    return (new this._externals.Promise(function(resolve) {

        options = options || {};

        this.emit(this.events.beforeLogin);

        var body = {};

        if (options.access_token) {

            //TODO Potentially make a request to /oauth/tokeninfo
            return resolve(options);

        }

        if (!options.code) {

            body.grant_type = 'password';
            body.username = options.username;
            body.password = options.password;
            body.extension = options.extension || '';

        } else if (options.code) {

            body.grant_type = 'authorization_code';
            body.code = options.code;
            body.redirect_uri = options.redirectUri || this._redirectUri;
            //body.client_id = this.getCredentials().key; // not needed

        }

        if (options.endpointId) body.endpoint_id = options.endpointId;
        if (options.accessTokenTtl) body.accessTokenTtl = options.accessTokenTtl;
        if (options.refreshTokenTtl) body.refreshTokenTtl = options.refreshTokenTtl;

        resolve(this._tokenRequest(Platform._tokenEndpoint, body));

    }.bind(this))).then(function(res) {

        var apiResponse = res.json ? res : null;
        var json = apiResponse && apiResponse.json() || res;

        this._auth.setData(json);

        this.emit(this.events.loginSuccess, apiResponse);

        return apiResponse;

    }.bind(this)).catch(function(e) {

        if (this._clearCacheOnRefreshError) {
            this._cache.clean();
        }

        this.emit(this.events.loginError, e);

        throw e;

    }.bind(this));

};

/**
 * @returns {Promise<ApiResponse>}
 * @private
 */
Platform.prototype._refresh = function() {

    return this.delay(this._refreshDelayMs).then(function() {

        this.emit(this.events.beforeRefresh);

        // Perform sanity checks
        if (!this._auth.refreshToken()) throw new Error('Refresh token is missing');
        if (!this._auth.refreshTokenValid()) throw new Error('Refresh token has expired');

        return this._tokenRequest(Platform._tokenEndpoint, {
            "grant_type": "refresh_token",
            "refresh_token": this._auth.refreshToken(),
            "access_token_ttl": this._auth.data().expires_in + 1,
            "refresh_token_ttl": this._auth.data().refresh_token_expires_in + 1
        });

    }.bind(this)).then(function(/** @type {ApiResponse} */ res) {

        var json = res.json();

        if (!json.access_token) {
            throw this._client.makeError(new Error('Malformed OAuth response'), res);
        }

        this._auth.setData(json);

        this.emit(this.events.refreshSuccess, res);

        return res;

    }.bind(this)).catch(function(e) {

        e = this._client.makeError(e);

        if (this._clearCacheOnRefreshError) {
            this._cache.clean();
        }

        this.emit(this.events.refreshError, e);

        throw e;

    }.bind(this));

};

/**
 * @returns {Promise<ApiResponse>}
 */
Platform.prototype.refresh = function() {

    if (!this._refreshPromise) {

        this._refreshPromise = this._refresh()
            .then(function(res) {
                this._refreshPromise = null;
                return res;
            }.bind(this))
            .catch(function(e) {
                this._refreshPromise = null;
                throw e;
            }.bind(this));

    }

    return this._refreshPromise;

};

/**
 * @returns {Promise<ApiResponse>}
 */
Platform.prototype.logout = function() {

    return (new this._externals.Promise(function(resolve) {

        this.emit(this.events.beforeLogout);

        resolve(this._tokenRequest(Platform._revokeEndpoint, {
            token: this._auth.accessToken()
        }));

    }.bind(this))).then(function(res) {

        this._cache.clean();

        this.emit(this.events.logoutSuccess, res);

        return res;

    }.bind(this)).catch(function(e) {

        this.emit(this.events.logoutError, e);

        throw e;

    }.bind(this));

};

/**
 * @param {Request} request
 * @param {object} [options]
 * @param {boolean} [options.skipAuthCheck]
 * @return {Promise<Request>}
 */
Platform.prototype.inflateRequest = function(request, options) {

    options = options || {};

    if (options.skipAuthCheck) return this._externals.Promise.resolve(request);

    return this.ensureLoggedIn().then(function() {

        request.headers.set('X-User-Agent', this._userAgent);
        request.headers.set('Client-Id', this._appKey);
        request.headers.set('Authorization', this._authHeader());
        //request.url = this.createUrl(request.url, {addServer: true}); //FIXME Spec prevents this...

        return request;

    }.bind(this));

};

/**
 * @param {Request} request
 * @param {object} [options]
 * @param {boolean} [options.skipAuthCheck]
 * @param {boolean} [options.retry] Will be set by this method if SDK makes second request
 * @return {Promise<ApiResponse>}
 */
Platform.prototype.sendRequest = function(request, options) {

    return this.inflateRequest(request, options).then(function(request) {

        options = options || {};

        return this._client.sendRequest(request);

    }.bind(this)).catch(function(e) {

        // Guard is for errors that come from polling
        if (!e.apiResponse || !e.apiResponse.response() ||
            (e.apiResponse.response().status != ApiResponse._unauthorizedStatus) ||
            options.retry) throw e;

        this._auth.cancelAccessToken();

        options.retry = true;

        return this.sendRequest(request, options);

    }.bind(this));

};

/**
 * General purpose function to send anything to server
 * @param {string} options.url
 * @param {object} [options.body]
 * @param {string} [options.method]
 * @param {object} [options.query]
 * @param {object} [options.headers]
 * @param {boolean} [options.skipAuthCheck]
 * @return {Promise<ApiResponse>}
 */
Platform.prototype.send = function(options) {

    options = options || {};

    //FIXME https://github.com/bitinn/node-fetch/issues/43
    options.url = this.createUrl(options.url, {addServer: true});

    return this.sendRequest(this._client.createRequest(options), options);

};

/**
 * @param {string} url
 * @param {object} [query]
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {boolean} [options.skipAuthCheck]
 * @return {Promise<ApiResponse>}
 */
Platform.prototype.get = function(url, query, options) {
    return this.send(objectAssign({}, {method: 'GET', url: url, query: query}, options));
};

/**
 * @param {string} url
 * @param {object} body
 * @param {object} [query]
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {boolean} [options.skipAuthCheck]
 * @return {Promise<ApiResponse>}
 */
Platform.prototype.post = function(url, body, query, options) {
    return this.send(objectAssign({}, {method: 'POST', url: url, query: query, body: body}, options));
};

/**
 * @param {string} url
 * @param {object} [body]
 * @param {object} [query]
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {boolean} [options.skipAuthCheck]
 * @return {Promise<ApiResponse>}
 */
Platform.prototype.put = function(url, body, query, options) {
    return this.send(objectAssign({}, {method: 'PUT', url: url, query: query, body: body}, options));
};

/**
 * @param {string} url
 * @param {string} [query]
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {boolean} [options.skipAuthCheck]
 * @return {Promise<ApiResponse>}
 */
Platform.prototype['delete'] = function(url, query, options) {
    return this.send(objectAssign({}, {method: 'DELETE', url: url, query: query}, options));
};

Platform.prototype.ensureLoggedIn = function() {
    if (this._isAccessTokenValid()) return this._externals.Promise.resolve();
    return this.refresh();
};

/**
 * @param path
 * @param body
 * @return {Promise.<ApiResponse>}
 * @private
 */
Platform.prototype._tokenRequest = function(path, body) {

    return this.send({
        url: path,
        skipAuthCheck: true,
        body: body,
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + this._apiKey(),
            'Content-Type': ApiResponse._urlencodedContentType
        }
    });

};

/**
 * @return {boolean}
 * @private
 */
Platform.prototype._isAccessTokenValid = function() {
    return this._auth.accessTokenValid();
};

/**
 * @return {string}
 * @private
 */
Platform.prototype._apiKey = function() {
    var apiKey = this._appKey + ':' + this._appSecret;
    return (typeof btoa == 'function') ? btoa(apiKey) : new Buffer(apiKey).toString('base64');
};

/**
 * @return {string}
 * @private
 */
Platform.prototype._authHeader = function() {
    var token = this._auth.accessToken();
    return this._auth.tokenType() + (token ? ' ' + token : '');
};

module.exports = Platform;

/***/ },
/* 16 */
/***/ function(module, exports) {

/**
 * @param {Cache} options.cache
 * @param {string} options.cacheId
 * @param {int} [options.refreshHandicapMs]
 * @constructor
 * @property {Cache} _cache
 * @property {int} _refreshHandicapMs
 * @property {string} _cacheId
 */
function Auth(options) {

    /** @private */
    this._cache = options.cache;

    /** @private */
    this._cacheId = options.cacheId;

    /** @private */
    this._refreshHandicapMs = options.refreshHandicapMs || 60 * 1000; // 1 minute

}

Auth.prototype.accessToken = function() {
    return this.data().access_token;
};

Auth.prototype.refreshToken = function() {
    return this.data().refresh_token;
};

Auth.prototype.tokenType = function() {
    return this.data().token_type;
};

/**
 * @return {{token_type: string, access_token: string, expires_in: number, refresh_token: string, refresh_token_expires_in: number}}
 */
Auth.prototype.data = function() {

    return this._cache.getItem(this._cacheId) || {
            token_type: '',
            access_token: '',
            expires_in: 0,
            refresh_token: '',
            refresh_token_expires_in: 0
        };

};

/**
 * @param {object} newData
 * @return {Auth}
 */
Auth.prototype.setData = function(newData) {

    newData = newData || {};

    var data = this.data();

    Object.keys(newData).forEach(function(key) {
        data[key] = newData[key];
    });

    data.expire_time = Date.now() + (data.expires_in * 1000);
    data.refresh_token_expire_time = Date.now() + (data.refresh_token_expires_in * 1000);

    this._cache.setItem(this._cacheId, data);

    return this;

};

/**
 * Check if there is a valid (not expired) access token
 * @return {boolean}
 */
Auth.prototype.accessTokenValid = function() {

    var authData = this.data();
    return (authData.expire_time - this._refreshHandicapMs > Date.now());

};

/**
 * Check if there is a valid (not expired) access token
 * @return {boolean}
 */
Auth.prototype.refreshTokenValid = function() {

    return (this.data().refresh_token_expire_time > Date.now());

};

/**
 * @return {Auth}
 */
Auth.prototype.cancelAccessToken = function() {

    return this.setData({
        access_token: '',
        expires_in: 0
    });

};

module.exports = Auth;

//export interface IAuthData {
//    remember?:boolean;
//    token_type?:string;
//    access_token?:string;
//    expires_in?:number; // actually it's string
//    expire_time?:number;
//    refresh_token?:string;
//    refresh_token_expires_in?:number; // actually it's string
//    refresh_token_expire_time?:number;
//    scope?:string;
//}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

var version = ("3.1.0");

// This will become false during the Webpack build, so no traces of package.json will be there
if (false) {
    version = require('../../package.json').version;
}

module.exports = {
    version: version,
    authResponseProperty: 'RCAuthorizationResponse'
};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(6).EventEmitter;

/**
 * @param {Platform} options.platform
 * @param {Externals} options.externals
 * @param {int} [options.pollInterval]
 * @param {int} [options.renewHandicapMs]
 * @property {Externals} _externals
 * @property {Platform} _platform
 * @property {int} _pollInterval
 * @property {int} _renewHandicapMs
 * @property {PUBNUB} _pubnub
 * @property {string} _pubnubLastChannel
 * @property {int} _timeout
 * @property {ISubscription} _subscription
 * @constructor
 */
function Subscription(options) {

    EventEmitter.call(this);

    options = options || {};

    this.events = {
        notification: 'notification',
        removeSuccess: 'removeSuccess',
        removeError: 'removeError',
        renewSuccess: 'renewSuccess',
        renewError: 'renewError',
        subscribeSuccess: 'subscribeSuccess',
        subscribeError: 'subscribeError'
    };

    /** @private */
    this._externals = options.externals;

    /** @private */
    this._platform = options.platform;

    /** @private */
    this._pollInterval = options.pollInterval || 10 * 1000;

    /** @private */
    this._renewHandicapMs = options.renewHandicapMs || 2 * 60 * 1000;

    /** @private */
    this._pubnub = null;

    /** @private */
    this._pubnubLastChannel = null;

    /** @private */
    this._timeout = null;

    /** @private */
    this._subscription = null;

}

Subscription.prototype = Object.create(EventEmitter.prototype);

Subscription.prototype.subscribed = function() {

    var subscription = this.subscription();

    return !!(subscription.id &&
              subscription.deliveryMode &&
              subscription.deliveryMode.subscriberKey &&
              subscription.deliveryMode.address);

};

/**
 * @return {boolean}
 */
Subscription.prototype.alive = function() {
    return this.subscribed() && Date.now() < this.expirationTime();
};

/**
 * @return {boolean}
 */
Subscription.prototype.expired = function() {
    if (!this.subscribed()) return true;
    return !this.subscribed() || Date.now() > this.subscription().expirationTime;
};

Subscription.prototype.expirationTime = function() {
    return new Date(this.subscription().expirationTime || 0).getTime() - this._renewHandicapMs;
};

/**
 * @param {ISubscription} subscription
 * @return {Subscription}
 */
Subscription.prototype.setSubscription = function(subscription) {

    subscription = subscription || {};

    this._clearTimeout();
    this._setSubscription(subscription);
    this._subscribeAtPubnub();
    this._setTimeout();

    return this;

};

/**
 * @return {ISubscription}
 */
Subscription.prototype.subscription = function() {
    return this._subscription || {};
};

/**
 * Creates or updates subscription if there is an active one
 * @returns {Promise<ApiResponse>}
 */
Subscription.prototype.register = function() {

    if (this.alive()) {
        return this.renew();
    } else {
        return this.subscribe();
    }

};

/**
 * @return {string[]}
 */
Subscription.prototype.eventFilters = function() {
    return this.subscription().eventFilters || [];
};

/**
 * @param {string[]} events
 * @return {Subscription}
 */
Subscription.prototype.addEventFilters = function(events) {
    this.setEventFilters(this.eventFilters().concat(events));
    return this;
};

/**
 * @param {string[]} events
 * @return {Subscription}
 */
Subscription.prototype.setEventFilters = function(events) {
    var subscription = this.subscription();
    subscription.eventFilters = events;
    this._setSubscription(subscription);
    return this;
};

/**
 * @returns {Promise<ApiResponse>}
 */
Subscription.prototype.subscribe = function() {

    return (new this._externals.Promise(function(resolve) {

        this._clearTimeout();

        if (!this.eventFilters().length) throw new Error('Events are undefined');

        resolve(this._platform.post('/subscription', {
            eventFilters: this._getFullEventFilters(),
            deliveryMode: {
                transportType: 'PubNub'
            }
        }));

    }.bind(this))).then(function(response) {

        var json = response.json();

        this.setSubscription(json)
            .emit(this.events.subscribeSuccess, response);

        return response;

    }.bind(this)).catch(function(e) {

        e = this._platform.client().makeError(e);

        this.reset()
            .emit(this.events.subscribeError, e);

        throw e;

    }.bind(this));

};

/**
 * @returns {Promise<ApiResponse>}
 */
Subscription.prototype.renew = function() {

    return (new this._externals.Promise(function(resolve) {

        this._clearTimeout();

        if (!this.subscribed()) throw new Error('No subscription');

        if (!this.eventFilters().length) throw new Error('Events are undefined');

        resolve(this._platform.put('/subscription/' + this.subscription().id, {
            eventFilters: this._getFullEventFilters()
        }));

    }.bind(this))).then(function(response) {

        var json = response.json();

        this.setSubscription(json)
            .emit(this.events.renewSuccess, response);

        return response;

    }.bind(this)).catch(function(e) {

        e = this._platform.client().makeError(e);

        this.reset()
            .emit(this.events.renewError, e);

        throw e;

    }.bind(this));

};

/**
 * @returns {Promise<ApiResponse>}
 */
Subscription.prototype.remove = function() {

    return (new this._externals.Promise(function(resolve) {

        if (!this.subscribed()) throw new Error('No subscription');

        resolve(this._platform.delete('/subscription/' + this.subscription().id));

    }.bind(this))).then(function(response) {

        this.reset()
            .emit(this.events.removeSuccess, response);

        return response;

    }.bind(this)).catch(function(e) {

        e = this._platform.client().makeError(e);

        this.emit(this.events.removeError, e);

        throw e;

    }.bind(this));

};

/**
 * @returns {Promise<ApiResponse>}
 */
Subscription.prototype.resubscribe = function() {
    var filters = this.eventFilters();
    return this.reset().setEventFilters(filters).subscribe();
};

/**
 * Remove subscription and disconnect from PubNub
 * This method resets subscription at client side but backend is not notified
 * @return {Subscription}
 */
Subscription.prototype.reset = function() {
    this._clearTimeout();
    if (this.subscribed() && this._pubnub) this._pubnub.unsubscribe({channel: this.subscription().deliveryMode.address});
    this._setSubscription(null);
    return this;
};

/**
 * @param subscription
 * @private
 */
Subscription.prototype._setSubscription = function(subscription) {
    this._subscription = subscription;
};

/**
 * @return {string[]}
 * @private
 */
Subscription.prototype._getFullEventFilters = function() {

    return this.eventFilters().map(function(event) {
        return this._platform.createUrl(event);
    }.bind(this));

};

/**
 * @return {Subscription}
 * @private
 */
Subscription.prototype._setTimeout = function() {

    this._clearTimeout();

    if (!this.alive()) throw new Error('Subscription is not alive');

    this._timeout = setInterval(function() {

        if (this.alive()) return;

        if (this.expired()) {
            this.subscribe();
        } else {
            this.renew();
        }

    }.bind(this), this._pollInterval);

    return this;

};

/**
 * @return {Subscription}
 * @private
 */
Subscription.prototype._clearTimeout = function() {
    clearInterval(this._timeout);
    return this;
};

Subscription.prototype._decrypt = function(message) {

    if (!this.subscribed()) throw new Error('No subscription');

    if (this.subscription().deliveryMode.encryptionKey) {

        message = this._pubnub.decrypt(message, this.subscription().deliveryMode.encryptionKey, {
            encryptKey: false,
            keyEncoding: 'base64',
            keyLength: 128,
            mode: 'ecb'
        });

    }

    return message;

};

/**
 * @param message
 * @return {Subscription}
 * @private
 */
Subscription.prototype._notify = function(message) {
    this.emit(this.events.notification, this._decrypt(message));
    return this;
};

/**
 * @return {Subscription}
 * @private
 */
Subscription.prototype._subscribeAtPubnub = function() {

    if (!this.alive()) throw new Error('Subscription is not alive');

    var deliveryMode = this.subscription().deliveryMode;

    if (this._pubnub) {

        if (this._pubnubLastChannel == deliveryMode.address) { // Nothing to update, keep listening to same channel
            return this;
        } else if (this._pubnubLastChannel) { // Need to subscribe to new channel
            this._pubnub.unsubscribe({channel: this._pubnubLastChannel});
        }

        // Re-init for new data
        this._pubnub = this._pubnub.init({
            ssl: true,
            subscribe_key: deliveryMode.subscriberKey
        });

    } else {

        // Init from scratch
        this._pubnub = new this._externals.PubNub({
            ssl: true,
            subscribe_key: deliveryMode.subscriberKey
        });

    }

    this._pubnubLastChannel = deliveryMode.address;

    this._pubnub.subscribe({
        channel: deliveryMode.address,
        message: this._notify.bind(this),
        connect: function() {}
    });

    return this;

};

module.exports = Subscription;

/**
 * The complete Triforce, or one or more components of the Triforce.
 * @typedef {Object} ISubscription
 * @property {string} [id]
 * @property {string} [uri]
 * @property {string[]} [eventFilters]
 * @property {string} [expirationTime] Format: 2014-03-12T19:54:35.613Z
 * @property {int} [expiresIn]
 * @property {string} [deliveryMode.transportType]
 * @property {boolean} [deliveryMode.encryption]
 * @property {string} [deliveryMode.address]
 * @property {string} [deliveryMode.subscriberKey]
 * @property {string} [deliveryMode.encryptionKey]
 * @property {string} [deliveryMode.secretKey]
 * @property {string} [creationTime]
 * @property {string} [status] Active
 */

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

var Subscription = __webpack_require__(18);

/**
 * @param {Platform} options.platform
 * @param {Externals} options.externals
 * @param {Cache} options.cache
 * @param {string} options.cacheKey
 * @param {int} [options.pollInterval]
 * @param {int} [options.renewHandicapMs]
 * @return {CachedSubscription}
 * @constructor
 * @property {Cache} _cache
 * @extends Subscription
 */
function CachedSubscription(options) {

    options = options || {};

    if (!options.cacheKey) throw new Error('Cached Subscription requires cacheKey parameter to be defined');

    /** @private */
    this._cacheKey = options.cacheKey;

    Subscription.call(this, options);

    /** @private */
    this._cache = options.cache;

    // This is not used in this class
    this._subscription = undefined;

}

CachedSubscription.prototype = Object.create(Subscription.prototype);

CachedSubscription.prototype.subscription = function() {
    return this._cache.getItem(this._cacheKey) || {};
};

CachedSubscription.prototype._setSubscription = function(subscription) {
    return this._cache.setItem(this._cacheKey, subscription);
};

/**
 * This function checks whether there are any pre-defined eventFilters in cache and if not -- uses provided as defaults
 * @param {string[]} events
 * @return {CachedSubscription}
 */
CachedSubscription.prototype.restore = function(events) {

    if (!this.eventFilters().length) {
        this.setEventFilters(events);
    }

    return this;

};

module.exports = CachedSubscription;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=ringcentral.js.map