(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SDK"] = factory();
	else
		root["RingCentral"] = root["RingCentral"] || {}, root["RingCentral"]["SDK"] = factory();
})(this, function() {
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

__webpack_require__(1);
module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    // This invoke function is written in a style that assumes some
    // calling function (or Promise) will handle exceptions.
    function invoke(method, arg) {
      var result = generator[method](arg);
      var value = result.value;
      return value instanceof AwaitArgument
        ? Promise.resolve(value.arg).then(invokeNext, invokeThrow)
        : Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration. If the Promise is rejected, however, the
            // result for this iteration will be rejected with the same
            // reason. Note that rejections of yielded Promises are not
            // thrown back into the generator function, as is the case
            // when an awaited Promise is rejected. This difference in
            // behavior between yield and await is important, because it
            // allows the consumer to decide what to do with the yielded
            // rejection (swallow it and continue, manually .throw it back
            // into the generator, abandon iteration, whatever). With
            // await, by contrast, there is no opportunity to examine the
            // rejection reason outside the generator function, so the
            // only option is to throw it from the await expression, and
            // let the generator function handle the exception.
            result.value = unwrapped;
            return result;
          });
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var invokeNext = invoke.bind(generator, "next");
    var invokeThrow = invoke.bind(generator, "throw");
    var invokeReturn = invoke.bind(generator, "return");
    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return invoke(method, arg);
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : new Promise(function (resolve) {
          resolve(callInvokeWithMethodAndArg());
        });
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          context._sent = arg;

          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }
        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

var _Utils = __webpack_require__(3);

var Utils = _interopRequireWildcard(_Utils);

var _Cache = __webpack_require__(12);

var _Cache2 = _interopRequireDefault(_Cache);

var _Externals = __webpack_require__(4);

var Externals = _interopRequireWildcard(_Externals);

var _Observable = __webpack_require__(13);

var _Observable2 = _interopRequireDefault(_Observable);

var _Queue = __webpack_require__(14);

var _Queue2 = _interopRequireDefault(_Queue);

var _Client = __webpack_require__(15);

var _Client2 = _interopRequireDefault(_Client);

var _ApiResponse = __webpack_require__(17);

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _Utils2 = __webpack_require__(16);

var HttpUtils = _interopRequireWildcard(_Utils2);

var _ClientMock = __webpack_require__(18);

var _ClientMock2 = _interopRequireDefault(_ClientMock);

var _Mock = __webpack_require__(20);

var _Mock2 = _interopRequireDefault(_Mock);

var _Registry = __webpack_require__(19);

var _Registry2 = _interopRequireDefault(_Registry);

var _Platform = __webpack_require__(21);

var _Platform2 = _interopRequireDefault(_Platform);

var _Auth = __webpack_require__(22);

var _Auth2 = _interopRequireDefault(_Auth);

var _PubnubFactory = __webpack_require__(23);

var _PubnubFactory2 = _interopRequireDefault(_PubnubFactory);

var _Subscription = __webpack_require__(25);

var _Subscription2 = _interopRequireDefault(_Subscription);

var _CachedSubscription = __webpack_require__(26);

var _CachedSubscription2 = _interopRequireDefault(_CachedSubscription);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SDK = (function () {

    /**
     * @constructor
     * @param {object} [options]
     * @param {string} [options.server]
     * @param {string} [options.cachePrefix]
     * @param {string} [options.appSecret]
     * @param {string} [options.appKey]
     * @param {string} [options.appName]
     * @param {string} [options.appVersion]
     * @param {string} [options.pubnubFactory]
     * @param {string} [options.client]
     */

    function SDK(options) {
        _classCallCheck(this, SDK);

        options = options || {};

        this._cache = new _Cache2.default(Externals.localStorage, options.cachePrefix);

        this._client = options.client || new _Client2.default();

        this._platform = new _Platform2.default(this._client, this._cache, options.server, options.appKey, options.appSecret);

        this._pubnubFactory = options.pubnubFactory || Externals.PUBNUB;
    }

    /**
     * @return {Platform}
     */

    SDK.prototype.platform = function platform() {
        return this._platform;
    };

    /**
     * @return {Subscription}
     */

    SDK.prototype.createSubscription = function createSubscription() {
        return new _Subscription2.default(this._pubnubFactory, this._platform);
    };

    /**
     * @return {CachedSubscription}
     */

    SDK.prototype.createCachedSubscription = function createCachedSubscription(cacheKey) {
        return new _CachedSubscription2.default(this._pubnubFactory, this._platform, this._cache, cacheKey);
    };

    /**
     * @return {Cache}
     */

    SDK.prototype.cache = function cache() {
        return this._cache;
    };

    return SDK;
})();

SDK.version = '2.0.4';
SDK.server = {
    sandbox: 'https://platform.devtest.ringcentral.com',
    production: 'https://platform.ringcentral.com'
};
SDK.core = {
    Cache: _Cache2.default,
    Observable: _Observable2.default,
    Utils: Utils,
    Externals: Externals,
    Queue: _Queue2.default
};
SDK.http = {
    Client: _Client2.default,
    ApiResponse: _ApiResponse2.default,
    Utils: HttpUtils
};
SDK.platform = {
    Auth: _Auth2.default,
    Platform: _Platform2.default
};
SDK.subscription = {
    Subscription: _Subscription2.default
};
SDK.mocks = {
    Client: _ClientMock2.default,
    Registry: _Registry2.default,
    Mock: _Mock2.default
};
SDK.pubnub = {
    PubnubMockFactory: _PubnubFactory2.default
};

module.exports = SDK;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;
exports.queryStringify = queryStringify;
exports.parseQueryString = parseQueryString;
exports.isFunction = isFunction;
exports.isArray = isArray;
exports.poll = poll;
exports.stopPolling = stopPolling;
exports.isNodeJS = isNodeJS;
exports.isBrowser = isBrowser;
exports.delay = delay;

var _Externals = __webpack_require__(4);

/**
 * TODO Replace with something better
 * @see https://github.com/joyent/node/blob/master/lib/querystring.js
 * @param {object} parameters
 * @returns {string}
 */
function queryStringify(parameters) {

    var array = [];

    parameters = parameters || {};

    Object.keys(parameters).forEach(function (k) {

        var v = parameters[k];

        if (isArray(v)) {
            v.forEach(function (vv) {
                array.push(encodeURIComponent(k) + '=' + encodeURIComponent(vv));
            });
        } else {
            array.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }
    });

    return array.join('&');
}

/**
 * TODO Replace with something better
 * @see https://github.com/joyent/node/blob/master/lib/querystring.js
 * @param {string} queryString
 * @returns {object}
 */
function parseQueryString(queryString) {

    var argsParsed = {};

    queryString.split('&').forEach(function (arg) {

        arg = decodeURIComponent(arg);

        if (arg.indexOf('=') == -1) {

            argsParsed[arg.trim()] = true;
        } else {

            var pair = arg.split('='),
                key = pair[0].trim(),
                value = pair[1].trim();

            if (key in argsParsed) {
                if (key in argsParsed && !isArray(argsParsed[key])) argsParsed[key] = [argsParsed[key]];
                argsParsed[key].push(value);
            } else {
                argsParsed[key] = value;
            }
        }
    });

    return argsParsed;
}

/**
 * @param obj
 * @return {boolean}
 */
function isFunction(obj) {
    return typeof obj === "function";
}

/**
 * @param obj
 * @return {boolean}
 */
function isArray(obj) {
    return Array.isArray ? Array.isArray(obj) : typeof obj === "array";
}

/**
 * @param fn
 * @param interval
 * @param timeout
 */
function poll(fn, interval, timeout) {
    //NodeJS.Timer|number

    module.exports.stopPolling(timeout);

    interval = interval || 1000;

    var next = function next(delay) {

        delay = delay || interval;

        interval = delay;

        return setTimeout(function () {

            fn(next, delay);
        }, delay);
    };

    return next();
}

function stopPolling(timeout) {
    if (timeout) clearTimeout(timeout);
}

function isNodeJS() {
    return typeof process !== 'undefined';
}

function isBrowser() {
    return typeof window !== 'undefined';
}

function delay(timeout) {
    return new _Externals.Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(null);
        }, timeout);
    });
}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;
exports.localStorage = exports.PUBNUB = exports.Headers = exports.Response = exports.Request = exports.fetch = exports.Promise = undefined;

var _es6Promise = __webpack_require__(5);

var _es6Promise2 = _interopRequireDefault(_es6Promise);

var _nodeFetch = __webpack_require__(10);

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _pubnub = __webpack_require__(11);

var _pubnub2 = _interopRequireDefault(_pubnub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var root = new Function('return this')();

var Promise = exports.Promise = _es6Promise2.default && _es6Promise2.default.Promise || root.Promise;

var fetch = exports.fetch = root.fetch || _nodeFetch2.default;
var Request = exports.Request = root.Request || fetch.Request;
var Response = exports.Response = root.Response || fetch.Response;
var Headers = exports.Headers = root.Headers || fetch.Headers;

var PUBNUB = exports.PUBNUB = root.PUBNUB || _pubnub2.default;

var localStorage = exports.localStorage = typeof root.localStorage !== 'undefined' ? root.localStorage : {};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

var require;var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(setImmediate, global, module) {/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.2.0
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$toString = {}.toString;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    function lib$es6$promise$asap$$asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    var lib$es6$promise$asap$$default = lib$es6$promise$asap$$asap;
    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"vertx\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && "function" === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertex();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$default(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$es6$promise$$internal$$getThen(maybeThenable);

        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$es6$promise$utils$$isArray(input);
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var enumerator = this;

      var length  = enumerator.length;
      var promise = enumerator.promise;
      var input   = enumerator._input;

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;

      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
          entry._onerror = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = entry;
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        enumerator._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          enumerator._result[i] = value;
        }
      }

      if (enumerator._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise’s eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        if (!lib$es6$promise$utils$$isFunction(resolver)) {
          lib$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
          lib$es6$promise$promise$$needsNew();
        }

        lib$es6$promise$$internal$$initializePromise(this, resolver);
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$default;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;

        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor(lib$es6$promise$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          lib$es6$promise$asap$$default(function(){
            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if ("function" === 'function' && __webpack_require__(9)['amd']) {
      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return lib$es6$promise$umd$$ES6Promise; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6).setImmediate, (function() { return this; }()), __webpack_require__(8)(module)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(7).nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6).setImmediate, __webpack_require__(6).clearImmediate))

/***/ },
/* 7 */
/***/ function(module, exports) {

// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ },
/* 8 */
/***/ function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		module.children = [];
		module.webpackPolyfill = 1;
	}
	return module;
}


/***/ },
/* 9 */
/***/ function(module, exports) {

module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 10 */
/***/ function(module, exports) {

(function() {
  'use strict';

  if (self.fetch) {
    return
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    reader.readAsArrayBuffer(blob)
    return fileReaderReady(reader)
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    reader.readAsText(blob)
    return fileReaderReady(reader)
  }

  var support = {
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self
  }

  function Body() {
    this.bodyUsed = false


    this._initBody = function(body) {
      this._bodyInit = body
      if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (!body) {
        this._bodyText = ''
      } else {
        throw new Error('unsupported BodyInit type')
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer)
      }

      this.text = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob)
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text')
        } else {
          return Promise.resolve(this._bodyText)
        }
      }
    } else {
      this.text = function() {
        var rejected = consumed(this)
        return rejected ? rejected : Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body
    if (Request.prototype.isPrototypeOf(input)) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = input
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function headers(xhr) {
    var head = new Headers()
    var pairs = xhr.getAllResponseHeaders().trim().split('\n')
    pairs.forEach(function(header) {
      var split = header.trim().split(':')
      var key = split.shift().trim()
      var value = split.join(':').trim()
      head.append(key, value)
    })
    return head
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this._initBody(bodyInit)
    this.type = 'default'
    this.url = null
    this.status = options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = options.statusText
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers)
    this.url = options.url || ''
  }

  Body.call(Response.prototype)

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
    var request
    if (Request.prototype.isPrototypeOf(input) && !init) {
      request = input
    } else {
      request = new Request(input, init)
    }

    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest()

      function responseURL() {
        if ('responseURL' in xhr) {
          return xhr.responseURL
        }

        // Avoid security warnings on getResponseHeader when not allowed by CORS
        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
          return xhr.getResponseHeader('X-Request-URL')
        }

        return;
      }

      xhr.onload = function() {
        var status = (xhr.status === 1223) ? 204 : xhr.status
        if (status < 100 || status > 599) {
          reject(new TypeError('Network request failed'))
          return
        }
        var options = {
          status: status,
          statusText: xhr.statusText,
          headers: headers(xhr),
          url: responseURL()
        }
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})();


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {// Version: 3.7.16
/* =-====================================================================-= */
/* =-====================================================================-= */
/* =-=========================     JSON     =============================-= */
/* =-====================================================================-= */
/* =-====================================================================-= */

(window['JSON'] && window['JSON']['stringify']) || (function () {
    window['JSON'] || (window['JSON'] = {});

    function toJSON(key) {
        try      { return this.valueOf() }
        catch(e) { return null }
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }

    function str(key, holder) {
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            partial,
            mind  = gap,
            value = holder[key];

        if (value && typeof value === 'object') {
            value = toJSON.call( value, key );
        }

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':
            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':
            return String(value);

        case 'object':

            if (!value) {
                return 'null';
            }

            gap += indent;
            partial = [];

            if (Object.prototype.toString.apply(value) === '[object Array]') {

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }
            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

    if (typeof JSON['stringify'] !== 'function') {
        JSON['stringify'] = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', {'': value});
        };
    }

    if (typeof JSON['parse'] !== 'function') {
        // JSON is parsed on the server for security.
        JSON['parse'] = function (text) {return eval('('+text+')')};
    }
}());
/* =-====================================================================-= */
/* =-====================================================================-= */
/* =-=========================     UTIL     =============================-= */
/* =-====================================================================-= */
/* =-====================================================================-= */

window['PUBNUB'] || (function() {
var NOW             = 1
,   READY           = false
,   READY_BUFFER    = []
,   PRESENCE_SUFFIX = '-pnpres'
,   DEF_WINDOWING   = 10     // MILLISECONDS.
,   DEF_TIMEOUT     = 10000  // MILLISECONDS.
,   DEF_SUB_TIMEOUT = 310    // SECONDS.
,   DEF_KEEPALIVE   = 60     // SECONDS (FOR TIMESYNC).
,   SECOND          = 1000   // A THOUSAND MILLISECONDS.
,   URLBIT          = '/'
,   PARAMSBIT       = '&'
,   PRESENCE_HB_THRESHOLD = 5
,   PRESENCE_HB_DEFAULT  = 30
,   SDK_VER         = '3.7.16'
,   REPL            = /{([\w\-]+)}/g;

/**
 * UTILITIES
 */
function unique() { return'x'+ ++NOW+''+(+new Date) }
function rnow()   { return+new Date }

/**
 * NEXTORIGIN
 * ==========
 * var next_origin = nextorigin();
 */
var nextorigin = (function() {
    var max = 20
    ,   ori = Math.floor(Math.random() * max);
    return function( origin, failover ) {
        return origin.indexOf('pubsub.') > 0
            && origin.replace(
             'pubsub', 'ps' + (
                failover ? generate_uuid().split('-')[0] :
                (++ori < max? ori : ori=1)
            ) ) || origin;
    }
})();


/**
 * Build Url
 * =======
 *
 */
function build_url( url_components, url_params ) {
    var url    = url_components.join(URLBIT)
    ,   params = [];

    if (!url_params) return url;

    each( url_params, function( key, value ) {
        var value_str = (typeof value == 'object')?JSON['stringify'](value):value;
        (typeof value != 'undefined' &&
            value != null && encode(value_str).length > 0
        ) && params.push(key + "=" + encode(value_str));
    } );

    url += "?" + params.join(PARAMSBIT);
    return url;
}

/**
 * UPDATER
 * =======
 * var timestamp = unique();
 */
function updater( fun, rate ) {
    var timeout
    ,   last   = 0
    ,   runnit = function() {
        if (last + rate > rnow()) {
            clearTimeout(timeout);
            timeout = setTimeout( runnit, rate );
        }
        else {
            last = rnow();
            fun();
        }
    };

    return runnit;
}

/**
 * GREP
 * ====
 * var list = grep( [1,2,3], function(item) { return item % 2 } )
 */
function grep( list, fun ) {
    var fin = [];
    each( list || [], function(l) { fun(l) && fin.push(l) } );
    return fin
}

/**
 * SUPPLANT
 * ========
 * var text = supplant( 'Hello {name}!', { name : 'John' } )
 */
function supplant( str, values ) {
    return str.replace( REPL, function( _, match ) {
        return values[match] || _
    } );
}

/**
 * timeout
 * =======
 * timeout( function(){}, 100 );
 */
function timeout( fun, wait ) {
    return setTimeout( fun, wait );
}

/**
 * uuid
 * ====
 * var my_uuid = generate_uuid();
 */
function generate_uuid(callback) {
    var u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    if (callback) callback(u);
    return u;
}

function isArray(arg) {
  return !!arg && typeof arg !== 'string' && (Array.isArray && Array.isArray(arg) || typeof(arg.length) === "number")
  //return !!arg && (Array.isArray && Array.isArray(arg) || typeof(arg.length) === "number")
}

/**
 * EACH
 * ====
 * each( [1,2,3], function(item) { } )
 */
function each( o, f) {
    if ( !o || !f ) return;

    if ( isArray(o) )
        for ( var i = 0, l = o.length; i < l; )
            f.call( o[i], o[i], i++ );
    else
        for ( var i in o )
            o.hasOwnProperty    &&
            o.hasOwnProperty(i) &&
            f.call( o[i], i, o[i] );
}

/**
 * MAP
 * ===
 * var list = map( [1,2,3], function(item) { return item + 1 } )
 */
function map( list, fun ) {
    var fin = [];
    each( list || [], function( k, v ) { fin.push(fun( k, v )) } );
    return fin;
}


function pam_encode(str) {
  return encodeURIComponent(str).replace(/[!'()*~]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * ENCODE
 * ======
 * var encoded_data = encode('path');
 */
function encode(path) { return encodeURIComponent(path) }

/**
 * Generate Subscription Channel List
 * ==================================
 * generate_channel_list(channels_object);
 */
function generate_channel_list(channels, nopresence) {
    var list = [];
    each( channels, function( channel, status ) {
        if (nopresence) {
            if(channel.search('-pnpres') < 0) {
                if (status.subscribed) list.push(channel);
            }
        } else {
            if (status.subscribed) list.push(channel);
        }
    });
    return list.sort();
}

/**
 * Generate Subscription Channel Groups List
 * ==================================
 * generate_channel_group_list(channels_groups object);
 */
function generate_channel_group_list(channel_groups, nopresence) {
    var list = [];
    each(channel_groups, function( channel_group, status ) {
        if (nopresence) {
            if(channel_group.search('-pnpres') < 0) {
                if (status.subscribed) list.push(channel_group);
            }
        } else {
            if (status.subscribed) list.push(channel_group);
        }
    });
    return list.sort();
}

// PUBNUB READY TO CONNECT
function ready() { timeout( function() {
    if (READY) return;
    READY = 1;
    each( READY_BUFFER, function(connect) { connect() } );
}, SECOND ); }

function PNmessage(args) {
    msg = args || {'apns' : {}},
    msg['getPubnubMessage'] = function() {
        var m = {};

        if (Object.keys(msg['apns']).length) {
            m['pn_apns'] = {
                    'aps' : {
                        'alert' : msg['apns']['alert'] ,
                        'badge' : msg['apns']['badge']
                    }
            }
            for (var k in msg['apns']) {
                m['pn_apns'][k] = msg['apns'][k];
            }
            var exclude1 = ['badge','alert'];
            for (var k in exclude1) {
                delete m['pn_apns'][exclude1[k]];
            }
        }



        if (msg['gcm']) {
            m['pn_gcm'] = {
                'data' : msg['gcm']
            }
        }

        for (var k in msg) {
            m[k] = msg[k];
        }
        var exclude = ['apns','gcm','publish', 'channel','callback','error'];
        for (var k in exclude) {
            delete m[exclude[k]];
        }

        return m;
    };
    msg['publish'] = function() {

        var m = msg.getPubnubMessage();

        if (msg['pubnub'] && msg['channel']) {
            msg['pubnub'].publish({
                'message' : m,
                'channel' : msg['channel'],
                'callback' : msg['callback'],
                'error' : msg['error']
            })
        }
    };
    return msg;
}

function PN_API(setup) {
    var SUB_WINDOWING =  +setup['windowing']   || DEF_WINDOWING
    ,   SUB_TIMEOUT   = (+setup['timeout']     || DEF_SUB_TIMEOUT) * SECOND
    ,   KEEPALIVE     = (+setup['keepalive']   || DEF_KEEPALIVE)   * SECOND
    ,   TIME_CHECK    = setup['timecheck']     || 0
    ,   NOLEAVE       = setup['noleave']       || 0
    ,   PUBLISH_KEY   = setup['publish_key']
    ,   SUBSCRIBE_KEY = setup['subscribe_key']
    ,   AUTH_KEY      = setup['auth_key']      || ''
    ,   SECRET_KEY    = setup['secret_key']    || ''
    ,   hmac_SHA256   = setup['hmac_SHA256']
    ,   SSL           = setup['ssl']            ? 's' : ''
    ,   ORIGIN        = 'http'+SSL+'://'+(setup['origin']||'pubsub.pubnub.com')
    ,   STD_ORIGIN    = nextorigin(ORIGIN)
    ,   SUB_ORIGIN    = nextorigin(ORIGIN)
    ,   CONNECT       = function(){}
    ,   PUB_QUEUE     = []
    ,   CLOAK         = true
    ,   TIME_DRIFT    = 0
    ,   SUB_CALLBACK  = 0
    ,   SUB_CHANNEL   = 0
    ,   SUB_RECEIVER  = 0
    ,   SUB_RESTORE   = setup['restore'] || 0
    ,   SUB_BUFF_WAIT = 0
    ,   TIMETOKEN     = 0
    ,   RESUMED       = false
    ,   CHANNELS      = {}
    ,   CHANNEL_GROUPS       = {}
    ,   SUB_ERROR     = function(){}
    ,   STATE         = {}
    ,   PRESENCE_HB_TIMEOUT  = null
    ,   PRESENCE_HB          = validate_presence_heartbeat(
        setup['heartbeat'] || setup['pnexpires'] || 0, setup['error']
    )
    ,   PRESENCE_HB_INTERVAL = setup['heartbeat_interval'] || (PRESENCE_HB / 2) -1
    ,   PRESENCE_HB_RUNNING  = false
    ,   NO_WAIT_FOR_PENDING  = setup['no_wait_for_pending']
    ,   COMPATIBLE_35 = setup['compatible_3.5']  || false
    ,   xdr           = setup['xdr']
    ,   params        = setup['params'] || {}
    ,   error         = setup['error']      || function() {}
    ,   _is_online    = setup['_is_online'] || function() { return 1 }
    ,   jsonp_cb      = setup['jsonp_cb']   || function() { return 0 }
    ,   db            = setup['db']         || {'get': function(){}, 'set': function(){}}
    ,   CIPHER_KEY    = setup['cipher_key']
    ,   UUID          = setup['uuid'] || ( !setup['unique_uuid'] && db && db['get'](SUBSCRIBE_KEY+'uuid') || '')
    ,   USE_INSTANCEID = setup['instance_id'] || false
    ,   INSTANCEID    = ''
    ,   shutdown      = setup['shutdown']
    ,   use_send_beacon = (typeof setup['use_send_beacon'] != 'undefined')?setup['use_send_beacon']:true
    ,   sendBeacon    = (use_send_beacon)?setup['sendBeacon']:null
    ,   _poll_timer
    ,   _poll_timer2;

    if (PRESENCE_HB === 2) PRESENCE_HB_INTERVAL = 1;

    var crypto_obj    = setup['crypto_obj'] ||
        {
            'encrypt' : function(a,key){ return a},
            'decrypt' : function(b,key){return b}
        };

    function _get_url_params(data) {
        if (!data) data = {};
        each( params , function( key, value ) {
            if (!(key in data)) data[key] = value;
        });
        return data;
    }

    function _object_to_key_list(o) {
        var l = []
        each( o , function( key, value ) {
            l.push(key);
        });
        return l;
    }
    function _object_to_key_list_sorted(o) {
        return _object_to_key_list(o).sort();
    }

    function _get_pam_sign_input_from_params(params) {
        var si = "";
        var l = _object_to_key_list_sorted(params);

        for (var i in l) {
            var k = l[i]
            si += k + "=" + pam_encode(params[k]) ;
            if (i != l.length - 1) si += "&"
        }
        return si;
    }

    function validate_presence_heartbeat(heartbeat, cur_heartbeat, error) {
        var err = false;

        if (typeof heartbeat === 'undefined') {
            return cur_heartbeat;
        }

        if (typeof heartbeat === 'number') {
            if (heartbeat > PRESENCE_HB_THRESHOLD || heartbeat == 0)
                err = false;
            else
                err = true;
        } else if(typeof heartbeat === 'boolean'){
            if (!heartbeat) {
                return 0;
            } else {
                return PRESENCE_HB_DEFAULT;
            }
        } else {
            err = true;
        }

        if (err) {
            error && error("Presence Heartbeat value invalid. Valid range ( x > " + PRESENCE_HB_THRESHOLD + " or x = 0). Current Value : " + (cur_heartbeat || PRESENCE_HB_THRESHOLD));
            return cur_heartbeat || PRESENCE_HB_THRESHOLD;
        } else return heartbeat;
    }

    function encrypt(input, key) {
        return crypto_obj['encrypt'](input, key || CIPHER_KEY) || input;
    }
    function decrypt(input, key) {
        return crypto_obj['decrypt'](input, key || CIPHER_KEY) ||
               crypto_obj['decrypt'](input, CIPHER_KEY) ||
               input;
    }

    function error_common(message, callback) {
        callback && callback({ 'error' : message || "error occurred"});
        error && error(message);
    }
    function _presence_heartbeat() {

        clearTimeout(PRESENCE_HB_TIMEOUT);

        if (!PRESENCE_HB_INTERVAL || PRESENCE_HB_INTERVAL >= 500 ||
            PRESENCE_HB_INTERVAL < 1 ||
            (!generate_channel_list(CHANNELS,true).length  && !generate_channel_group_list(CHANNEL_GROUPS, true).length ) )
        {
            PRESENCE_HB_RUNNING = false;
            return;
        }

        PRESENCE_HB_RUNNING = true;
        SELF['presence_heartbeat']({
            'callback' : function(r) {
                PRESENCE_HB_TIMEOUT = timeout( _presence_heartbeat, (PRESENCE_HB_INTERVAL) * SECOND );
            },
            'error' : function(e) {
                error && error("Presence Heartbeat unable to reach Pubnub servers." + JSON.stringify(e));
                PRESENCE_HB_TIMEOUT = timeout( _presence_heartbeat, (PRESENCE_HB_INTERVAL) * SECOND );
            }
        });
    }

    function start_presence_heartbeat() {
        !PRESENCE_HB_RUNNING && _presence_heartbeat();
    }

    function publish(next) {

        if (NO_WAIT_FOR_PENDING) {
            if (!PUB_QUEUE.length) return;
        } else {
            if (next) PUB_QUEUE.sending = 0;
            if ( PUB_QUEUE.sending || !PUB_QUEUE.length ) return;
            PUB_QUEUE.sending = 1;
        }

        xdr(PUB_QUEUE.shift());
    }
    function each_channel_group(callback) {
        var count = 0;

        each( generate_channel_group_list(CHANNEL_GROUPS), function(channel_group) {
            var chang = CHANNEL_GROUPS[channel_group];

            if (!chang) return;

            count++;
            (callback||function(){})(chang);
        } );

        return count;
    }

    function each_channel(callback) {
        var count = 0;

        each( generate_channel_list(CHANNELS), function(channel) {
            var chan = CHANNELS[channel];

            if (!chan) return;

            count++;
            (callback||function(){})(chan);
        } );

        return count;
    }
    function _invoke_callback(response, callback, err) {
        if (typeof response == 'object') {
            if (response['error']) {
                var callback_data = {};

                if (response['message']) {
                    callback_data['message'] = response['message'];
                }

                if (response['payload']) {
                    callback_data['payload'] = response['payload'];
                }

                err && err(callback_data);
                return;

            }
            if (response['payload']) {
                if (response['next_page'])
                    callback && callback(response['payload'], response['next_page']);
                else
                    callback && callback(response['payload']);
                return;
            }
        }
        callback && callback(response);
    }

    function _invoke_error(response,err) {

        if (typeof response == 'object' && response['error']) {
                var callback_data = {};

                if (response['message']) {
                    callback_data['message'] = response['message'];
                }

                if (response['payload']) {
                    callback_data['payload'] = response['payload'];
                }
                
                err && err(callback_data);
                return;
        } else {
            err && err(response);
        }
    }
    function CR(args, callback, url1, data) {
            var callback        = args['callback']      || callback
            ,   err             = args['error']         || error
            ,   jsonp           = jsonp_cb();

            data = data || {};
            
            if (!data['auth']) {
                data['auth'] = args['auth_key'] || AUTH_KEY;
            }
            
            var url = [
                    STD_ORIGIN, 'v1', 'channel-registration',
                    'sub-key', SUBSCRIBE_KEY
                ];

            url.push.apply(url,url1);
            
            if (jsonp) data['callback']              = jsonp;
            
            xdr({
                callback : jsonp,
                data     : _get_url_params(data),
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : url
            });

    }

    // Announce Leave Event
    var SELF = {
        'LEAVE' : function( channel, blocking, auth_key, callback, error ) {

            var data   = { 'uuid' : UUID, 'auth' : auth_key || AUTH_KEY }
            ,   origin = nextorigin(ORIGIN)
            ,   callback = callback || function(){}
            ,   err      = error    || function(){}
            ,   url
            ,   params
            ,   jsonp  = jsonp_cb();

            // Prevent Leaving a Presence Channel
            if (channel.indexOf(PRESENCE_SUFFIX) > 0) return true;


            if (COMPATIBLE_35) {
                if (!SSL)         return false;
                if (jsonp == '0') return false;
            }

            if (NOLEAVE)  return false;

            if (jsonp != '0') data['callback'] = jsonp;

            if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

            url = [
                    origin, 'v2', 'presence', 'sub_key',
                    SUBSCRIBE_KEY, 'channel', encode(channel), 'leave'
                ];

            params = _get_url_params(data);


            if (sendBeacon) {
                url_string = build_url(url, params);
                if (sendBeacon(url_string)) {
                    callback && callback({"status": 200, "action": "leave", "message": "OK", "service": "Presence"});
                    return true;
                }
            }


            xdr({
                blocking : blocking || SSL,
                timeout  : 2000,
                callback : jsonp,
                data     : params,
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : url
            });
            return true;
        },
        'LEAVE_GROUP' : function( channel_group, blocking, auth_key, callback, error ) {

            var data   = { 'uuid' : UUID, 'auth' : auth_key || AUTH_KEY }
            ,   origin = nextorigin(ORIGIN)
            ,   url
            ,   params
            ,   callback = callback || function(){}
            ,   err      = error    || function(){}
            ,   jsonp  = jsonp_cb();

            // Prevent Leaving a Presence Channel Group
            if (channel_group.indexOf(PRESENCE_SUFFIX) > 0) return true;

            if (COMPATIBLE_35) {
                if (!SSL)         return false;
                if (jsonp == '0') return false;
            }

            if (NOLEAVE)  return false;

            if (jsonp != '0') data['callback'] = jsonp;

            if (channel_group && channel_group.length > 0) data['channel-group'] = channel_group;

            if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

            url = [
                    origin, 'v2', 'presence', 'sub_key',
                    SUBSCRIBE_KEY, 'channel', encode(','), 'leave'
            ];

            params = _get_url_params(data);

            if (sendBeacon) {
                url_string = build_url(url, params);
                if (sendBeacon(url_string)) {
                    callback && callback({"status": 200, "action": "leave", "message": "OK", "service": "Presence"});
                    return true;
                }
            }

            xdr({
                blocking : blocking || SSL,
                timeout  : 5000,
                callback : jsonp,
                data     : params,
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : url
            });
            return true;
        },
        'set_resumed' : function(resumed) {
                RESUMED = resumed;
        },
        'get_cipher_key' : function() {
            return CIPHER_KEY;
        },
        'set_cipher_key' : function(key) {
            CIPHER_KEY = key;
        },
        'raw_encrypt' : function(input, key) {
            return encrypt(input, key);
        },
        'raw_decrypt' : function(input, key) {
            return decrypt(input, key);
        },
        'get_heartbeat' : function() {
            return PRESENCE_HB;
        },
        
        'set_heartbeat' : function(heartbeat, heartbeat_interval) {
            PRESENCE_HB = validate_presence_heartbeat(heartbeat, PRESENCE_HB, error);
            PRESENCE_HB_INTERVAL = heartbeat_interval || (PRESENCE_HB / 2) - 1;
            if (PRESENCE_HB == 2) {
                PRESENCE_HB_INTERVAL = 1;
            }
            CONNECT();
            _presence_heartbeat();
        },
        
        'get_heartbeat_interval' : function() {
            return PRESENCE_HB_INTERVAL;
        },
        
        'set_heartbeat_interval' : function(heartbeat_interval) {
            PRESENCE_HB_INTERVAL = heartbeat_interval;
            _presence_heartbeat();
        },
        
        'get_version' : function() {
            return SDK_VER;
        },
        'getGcmMessageObject' : function(obj) {
            return {
                'data' : obj
            }
        },
        'getApnsMessageObject' : function(obj) {
            var x =  {
                'aps' : { 'badge' : 1, 'alert' : ''}
            }
            for (k in obj) {
                k[x] = obj[k];
            }
            return x;
        },
        'newPnMessage' : function() {
            var x = {};
            if (gcm) x['pn_gcm'] = gcm;
            if (apns) x['pn_apns'] = apns;
            for ( k in n ) {
                x[k] = n[k];
            }
            return x;
        },

        '_add_param' : function(key,val) {
            params[key] = val;
        },

        'channel_group' : function(args, callback) {
            var ns_ch       = args['channel_group']
            ,   callback    = callback         || args['callback']
            ,   channels    = args['channels'] || args['channel']
            ,   cloak       = args['cloak']
            ,   namespace
            ,   channel_group
            ,   url = []
            ,   data = {}
            ,   mode = args['mode'] || 'add';


            if (ns_ch) {
                var ns_ch_a = ns_ch.split(':');

                if (ns_ch_a.length > 1) {
                    namespace = (ns_ch_a[0] === '*')?null:ns_ch_a[0];

                    channel_group = ns_ch_a[1];
                } else {
                    channel_group = ns_ch_a[0];
                }
            }

            namespace && url.push('namespace') && url.push(encode(namespace));

            url.push('channel-group');

            if (channel_group && channel_group !== '*') {
                url.push(channel_group);
            }

            if (channels ) {
                if (isArray(channels)) {
                    channels = channels.join(',');
                }
                data[mode] = channels;
                data['cloak'] = (CLOAK)?'true':'false';
            } else {
                if (mode === 'remove') url.push('remove');
            }

            if (typeof cloak != 'undefined') data['cloak'] = (cloak)?'true':'false';

            CR(args, callback, url, data);
        },

        'channel_group_list_groups' : function(args, callback) {
            var namespace;

            namespace = args['namespace'] || args['ns'] || args['channel_group'] || null;
            if (namespace) {
                args["channel_group"] = namespace + ":*";
            }

            SELF['channel_group'](args, callback);
        },

        'channel_group_list_channels' : function(args, callback) {
            if (!args['channel_group']) return error('Missing Channel Group');
            SELF['channel_group'](args, callback);
        },

        'channel_group_remove_channel' : function(args, callback) {
            if (!args['channel_group']) return error('Missing Channel Group');
            if (!args['channel'] && !args['channels'] ) return error('Missing Channel');

            args['mode'] = 'remove';
            SELF['channel_group'](args,callback);
        },

        'channel_group_remove_group' : function(args, callback) {
            if (!args['channel_group']) return error('Missing Channel Group');
            if (args['channel']) return error('Use channel_group_remove_channel if you want to remove a channel from a group.');

            args['mode'] = 'remove';
            SELF['channel_group'](args,callback);
        },

        'channel_group_add_channel' : function(args, callback) {
           if (!args['channel_group']) return error('Missing Channel Group');
           if (!args['channel'] && !args['channels'] ) return error('Missing Channel');
            SELF['channel_group'](args,callback);
        },

        'channel_group_cloak' : function(args, callback) {
            if (typeof args['cloak'] == 'undefined') {
                callback(CLOAK);
                return;
            }
            CLOAK = args['cloak'];
            SELF['channel_group'](args,callback);
        },

        'channel_group_list_namespaces' : function(args, callback) {
            var url = ['namespace'];
            CR(args, callback, url);
        },
        'channel_group_remove_namespace' : function(args, callback) {
            var url = ['namespace',args['namespace'],'remove'];
            CR(args, callback, url);
        },

        /*
            PUBNUB.history({
                channel  : 'my_chat_channel',
                limit    : 100,
                callback : function(history) { }
            });
        */
        'history' : function( args, callback ) {
            var callback         = args['callback'] || callback
            ,   count            = args['count']    || args['limit'] || 100
            ,   reverse          = args['reverse']  || "false"
            ,   err              = args['error']    || function(){}
            ,   auth_key         = args['auth_key'] || AUTH_KEY
            ,   cipher_key       = args['cipher_key']
            ,   channel          = args['channel']
            ,   channel_group    = args['channel_group']
            ,   start            = args['start']
            ,   end              = args['end']
            ,   include_token    = args['include_token']
            ,   string_msg_token = args['string_message_token'] || false
            ,   params           = {}
            ,   jsonp            = jsonp_cb();

            // Make sure we have a Channel
            if (!channel && !channel_group) return error('Missing Channel');
            if (!callback)      return error('Missing Callback');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            params['stringtoken'] = 'true';
            params['count']       = count;
            params['reverse']     = reverse;
            params['auth']        = auth_key;

            if (channel_group) {
                params['channel-group'] = channel_group;
                if (!channel) {
                    channel = ','; 
                }
            }
            if (jsonp) params['callback']              = jsonp;
            if (start) params['start']                 = start;
            if (end)   params['end']                   = end;
            if (include_token) params['include_token'] = 'true';
            if (string_msg_token) params['string_message_token'] = 'true';

            // Send Message
            xdr({
                callback : jsonp,
                data     : _get_url_params(params),
                success  : function(response) {
                    if (typeof response == 'object' && response['error']) {
                        err({'message' : response['message'], 'payload' : response['payload']});
                        return;
                    }
                    var messages = response[0];
                    var decrypted_messages = [];
                    for (var a = 0; a < messages.length; a++) {
                        if (include_token) {
                            var new_message = decrypt(messages[a]['message'],cipher_key);
                            var timetoken = messages[a]['timetoken'];
                            try {
                                decrypted_messages['push']({"message" : JSON['parse'](new_message), "timetoken" : timetoken});
                            } catch (e) {
                                decrypted_messages['push'](({"message" : new_message, "timetoken" : timetoken}));
                            }
                        } else {
                            var new_message = decrypt(messages[a],cipher_key);
                            try {
                                decrypted_messages['push'](JSON['parse'](new_message));
                            } catch (e) {
                                decrypted_messages['push']((new_message));
                            }     
                        }
                    }
                    callback([decrypted_messages, response[1], response[2]]);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : [
                    STD_ORIGIN, 'v2', 'history', 'sub-key',
                    SUBSCRIBE_KEY, 'channel', encode(channel)
                ]
            });
        },

        /*
            PUBNUB.replay({
                source      : 'my_channel',
                destination : 'new_channel'
            });
        */
        'replay' : function(args, callback) {
            var callback    = callback || args['callback'] || function(){}
            ,   auth_key    = args['auth_key'] || AUTH_KEY
            ,   source      = args['source']
            ,   destination = args['destination']
            ,   stop        = args['stop']
            ,   start       = args['start']
            ,   end         = args['end']
            ,   reverse     = args['reverse']
            ,   limit       = args['limit']
            ,   jsonp       = jsonp_cb()
            ,   data        = {}
            ,   url;

            // Check User Input
            if (!source)        return error('Missing Source Channel');
            if (!destination)   return error('Missing Destination Channel');
            if (!PUBLISH_KEY)   return error('Missing Publish Key');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            // Setup URL Params
            if (jsonp != '0') data['callback'] = jsonp;
            if (stop)         data['stop']     = 'all';
            if (reverse)      data['reverse']  = 'true';
            if (start)        data['start']    = start;
            if (end)          data['end']      = end;
            if (limit)        data['count']    = limit;

            data['auth'] = auth_key;

            // Compose URL Parts
            url = [
                STD_ORIGIN, 'v1', 'replay',
                PUBLISH_KEY, SUBSCRIBE_KEY,
                source, destination
            ];

            // Start (or Stop) Replay!
            xdr({
                callback : jsonp,
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function() { callback([ 0, 'Disconnected' ]) },
                url      : url,
                data     : _get_url_params(data)
            });
        },

        /*
            PUBNUB.auth('AJFLKAJSDKLA');
        */
        'auth' : function(auth) {
            AUTH_KEY = auth;
            CONNECT();
        },

        /*
            PUBNUB.time(function(time){ });
        */
        'time' : function(callback) {
            var jsonp = jsonp_cb();

            var data = { 'uuid' : UUID, 'auth' : AUTH_KEY }

            if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

            xdr({
                callback : jsonp,
                data     : _get_url_params(data),
                timeout  : SECOND * 5,
                url      : [STD_ORIGIN, 'time', jsonp],
                success  : function(response) { callback(response[0]) },
                fail     : function() { callback(0) }
            });
        },

        /*
            PUBNUB.publish({
                channel : 'my_chat_channel',
                message : 'hello!'
            });
        */
        'publish' : function( args, callback ) {
            var msg      = args['message'];
            if (!msg) return error('Missing Message');

            var callback = callback || args['callback'] || msg['callback'] || function(){}
            ,   channel  = args['channel'] || msg['channel']
            ,   auth_key = args['auth_key'] || AUTH_KEY
            ,   cipher_key = args['cipher_key']
            ,   err      = args['error'] || msg['error'] || function() {}
            ,   post     = args['post'] || false
            ,   store    = ('store_in_history' in args) ? args['store_in_history']: true
            ,   jsonp    = jsonp_cb()
            ,   add_msg  = 'push'
            ,   params
            ,   url;

            if (args['prepend']) add_msg = 'unshift'

            if (!channel)       return error('Missing Channel');
            if (!PUBLISH_KEY)   return error('Missing Publish Key');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            if (msg['getPubnubMessage']) {
                msg = msg['getPubnubMessage']();
            }

            // If trying to send Object
            msg = JSON['stringify'](encrypt(msg, cipher_key));

            // Create URL
            url = [
                STD_ORIGIN, 'publish',
                PUBLISH_KEY, SUBSCRIBE_KEY,
                0, encode(channel),
                jsonp, encode(msg)
            ];

            params = { 'uuid' : UUID, 'auth' : auth_key }

            if (!store) params['store'] ="0"

            if (USE_INSTANCEID) params['instanceid'] = INSTANCEID;

            // Queue Message Send
            PUB_QUEUE[add_msg]({
                callback : jsonp,
                timeout  : SECOND * 5,
                url      : url,
                data     : _get_url_params(params),
                fail     : function(response){
                    _invoke_error(response, err);
                    publish(1);
                },
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                    publish(1);
                },
                mode     : (post)?'POST':'GET'
            });

            // Send Message
            publish();
        },

        /*
            PUBNUB.unsubscribe({ channel : 'my_chat' });
        */
        'unsubscribe' : function(args, callback) {
            var channel       = args['channel']
            ,   channel_group = args['channel_group']
            ,   auth_key      = args['auth_key']    || AUTH_KEY
            ,   callback      = callback            || args['callback'] || function(){}
            ,   err           = args['error']       || function(){};

            TIMETOKEN   = 0;
            SUB_RESTORE = 1;   // REVISIT !!!!

            if (channel) {

                // Prepare LeaveChannel(s)
                var leave_c = map( (
                    channel.join ? channel.join(',') : ''+channel
                ).split(','), function(channel) {
                    if (!CHANNELS[channel]) return;
                    return channel;
                } ).join(',');

                // Prepare Channel(s)
                channel = map( (
                    channel.join ? channel.join(',') : ''+channel
                ).split(','), function(channel) {
                    if (!CHANNELS[channel]) return;
                    return channel + ',' + channel + PRESENCE_SUFFIX;
                } ).join(',');

                // Iterate over Channels
                each(channel.split(','), function(ch) {
                    if (!ch) return;
                    CHANNELS[ch] = 0;
                    if (ch in STATE) delete STATE[ch];
                } );

                var CB_CALLED = true;
                if (READY) {
                    CB_CALLED = SELF['LEAVE'](leave_c, 0 , auth_key, callback, err);
                }
                if (!CB_CALLED) callback({action : "leave"});
            }

            if (channel_group) {

                // Prepare channel group(s)
                var leave_gc = map( (
                    channel_group.join ? channel_group.join(',') : ''+channel_group
                ).split(','), function(channel_group) {
                    if (!CHANNEL_GROUPS[channel_group]) return;
                    return channel_group;
                } ).join(',');

                // Prepare channel group(s)
                channel_group = map( (
                    channel_group.join ? channel_group.join(',') : ''+channel_group
                ).split(','), function(channel_group) {
                    if (!CHANNEL_GROUPS[channel_group]) return;
                    return channel_group + ',' + channel_group + PRESENCE_SUFFIX;
                } ).join(',');

                // Iterate over channel groups
                each( channel_group.split(','), function(chg) {
                    if (!chg) return;
                    CHANNEL_GROUPS[chg] = 0;
                    if (chg in STATE) delete STATE[chg];
                } );

                var CB_CALLED = true;
                if (READY) {
                    CB_CALLED = SELF['LEAVE_GROUP'](leave_gc, 0 , auth_key, callback, err);
                }
                if (!CB_CALLED) callback({action : "leave"});
            }

            // Reset Connection if Count Less
            CONNECT();
        },

        /*
            PUBNUB.subscribe({
                channel  : 'my_chat'
                callback : function(message) { }
            });
        */
        'subscribe' : function( args, callback ) {
            var channel         = args['channel']
            ,   channel_group   = args['channel_group']
            ,   callback        = callback            || args['callback']
            ,   callback        = callback            || args['message']
            ,   connect         = args['connect']     || function(){}
            ,   reconnect       = args['reconnect']   || function(){}
            ,   disconnect      = args['disconnect']  || function(){}
            ,   SUB_ERROR       = args['error']       || SUB_ERROR || function(){}
            ,   idlecb          = args['idle']        || function(){}
            ,   presence        = args['presence']    || 0
            ,   noheresync      = args['noheresync']  || 0
            ,   backfill        = args['backfill']    || 0
            ,   timetoken       = args['timetoken']   || 0
            ,   sub_timeout     = args['timeout']     || SUB_TIMEOUT
            ,   windowing       = args['windowing']   || SUB_WINDOWING
            ,   state           = args['state']
            ,   heartbeat       = args['heartbeat'] || args['pnexpires']
            ,   heartbeat_interval = args['heartbeat_interval']
            ,   restore         = args['restore'] || SUB_RESTORE;

            AUTH_KEY            = args['auth_key']    || AUTH_KEY;

            // Restore Enabled?
            SUB_RESTORE = restore;

            // Always Reset the TT
            TIMETOKEN = timetoken;

            // Make sure we have a Channel
            if (!channel && !channel_group) {
                return error('Missing Channel');
            }

            if (!callback)      return error('Missing Callback');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            if (heartbeat || heartbeat === 0 || heartbeat_interval || heartbeat_interval === 0) {
                SELF['set_heartbeat'](heartbeat, heartbeat_interval);
            }

            // Setup Channel(s)
            if (channel) {
                each( (channel.join ? channel.join(',') : ''+channel).split(','),
                function(channel) {
                    var settings = CHANNELS[channel] || {};

                    // Store Channel State
                    CHANNELS[SUB_CHANNEL = channel] = {
                        name         : channel,
                        connected    : settings.connected,
                        disconnected : settings.disconnected,
                        subscribed   : 1,
                        callback     : SUB_CALLBACK = callback,
                        'cipher_key' : args['cipher_key'],
                        connect      : connect,
                        disconnect   : disconnect,
                        reconnect    : reconnect
                    };

                    if (state) {
                        if (channel in state) {
                            STATE[channel] = state[channel];
                        } else {
                            STATE[channel] = state;
                        }
                    }

                    // Presence Enabled?
                    if (!presence) return;

                    // Subscribe Presence Channel
                    SELF['subscribe']({
                        'channel'  : channel + PRESENCE_SUFFIX,
                        'callback' : presence,
                        'restore'  : restore
                    });

                    // Presence Subscribed?
                    if (settings.subscribed) return;

                    // See Who's Here Now?
                    if (noheresync) return;
                    SELF['here_now']({
                        'channel'  : channel,
                        'data'     : _get_url_params({ 'uuid' : UUID, 'auth' : AUTH_KEY }),
                        'callback' : function(here) {
                            each( 'uuids' in here ? here['uuids'] : [],
                            function(uid) { presence( {
                                'action'    : 'join',
                                'uuid'      : uid,
                                'timestamp' : Math.floor(rnow() / 1000),
                                'occupancy' : here['occupancy'] || 1
                            }, here, channel ); } );
                        }
                    });
                } );
            }

            // Setup Channel Groups
            if (channel_group) {
                each( (channel_group.join ? channel_group.join(',') : ''+channel_group).split(','),
                function(channel_group) {
                    var settings = CHANNEL_GROUPS[channel_group] || {};

                    CHANNEL_GROUPS[channel_group] = {
                        name         : channel_group,
                        connected    : settings.connected,
                        disconnected : settings.disconnected,
                        subscribed   : 1,
                        callback     : SUB_CALLBACK = callback,
                        'cipher_key' : args['cipher_key'],
                        connect      : connect,
                        disconnect   : disconnect,
                        reconnect    : reconnect
                    };

                    // Presence Enabled?
                    if (!presence) return;

                    // Subscribe Presence Channel
                    SELF['subscribe']({
                        'channel_group'  : channel_group + PRESENCE_SUFFIX,
                        'callback' : presence,
                        'restore'  : restore,
                        'auth_key' : AUTH_KEY
                    });

                    // Presence Subscribed?
                    if (settings.subscribed) return;

                    // See Who's Here Now?
                    if (noheresync) return;
                    SELF['here_now']({
                        'channel_group'  : channel_group,
                        'data'           : _get_url_params({ 'uuid' : UUID, 'auth' : AUTH_KEY }),
                        'callback' : function(here) {
                            each( 'uuids' in here ? here['uuids'] : [],
                            function(uid) { presence( {
                                'action'    : 'join',
                                'uuid'      : uid,
                                'timestamp' : Math.floor(rnow() / 1000),
                                'occupancy' : here['occupancy'] || 1
                            }, here, channel_group ); } );
                        }
                    });
                } );
            }


            // Test Network Connection
            function _test_connection(success) {
                if (success) {
                    // Begin Next Socket Connection
                    timeout( CONNECT, windowing);
                }
                else {
                    // New Origin on Failed Connection
                    STD_ORIGIN = nextorigin( ORIGIN, 1 );
                    SUB_ORIGIN = nextorigin( ORIGIN, 1 );

                    // Re-test Connection
                    timeout( function() {
                        SELF['time'](_test_connection);
                    }, SECOND );
                }

                // Disconnect & Reconnect
                each_channel(function(channel){
                    // Reconnect
                    if (success && channel.disconnected) {
                        channel.disconnected = 0;
                        return channel.reconnect(channel.name);
                    }

                    // Disconnect
                    if (!success && !channel.disconnected) {
                        channel.disconnected = 1;
                        channel.disconnect(channel.name);
                    }
                });
                
                // Disconnect & Reconnect for channel groups
                each_channel_group(function(channel_group){
                    // Reconnect
                    if (success && channel_group.disconnected) {
                        channel_group.disconnected = 0;
                        return channel_group.reconnect(channel_group.name);
                    }

                    // Disconnect
                    if (!success && !channel_group.disconnected) {
                        channel_group.disconnected = 1;
                        channel_group.disconnect(channel_group.name);
                    }
                });
            }

            // Evented Subscribe
            function _connect() {
                var jsonp           = jsonp_cb()
                ,   channels        = generate_channel_list(CHANNELS).join(',')
                ,   channel_groups  = generate_channel_group_list(CHANNEL_GROUPS).join(',');

                // Stop Connection
                if (!channels && !channel_groups) return;

                if (!channels) channels = ',';

                // Connect to PubNub Subscribe Servers
                _reset_offline();

                var data = _get_url_params({ 'uuid' : UUID, 'auth' : AUTH_KEY });

                if (channel_groups) {
                    data['channel-group'] = channel_groups;
                }


                var st = JSON.stringify(STATE);
                if (st.length > 2) data['state'] = JSON.stringify(STATE);

                if (PRESENCE_HB) data['heartbeat'] = PRESENCE_HB;

                if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

                start_presence_heartbeat();
                SUB_RECEIVER = xdr({
                    timeout  : sub_timeout,
                    callback : jsonp,
                    fail     : function(response) {
                        if (response && response['error'] && response['service']) {
                            _invoke_error(response, SUB_ERROR);
                            _test_connection(1);
                        } else {
                            SELF['time'](function(success){
                                !success && ( _invoke_error(response, SUB_ERROR));
                                _test_connection(success);
                            });
                        }
                    },
                    data     : _get_url_params(data),
                    url      : [
                        SUB_ORIGIN, 'subscribe',
                        SUBSCRIBE_KEY, encode(channels),
                        jsonp, TIMETOKEN
                    ],
                    success : function(messages) {

                        // Check for Errors
                        if (!messages || (
                            typeof messages == 'object' &&
                            'error' in messages         &&
                            messages['error']
                        )) {
                            SUB_ERROR(messages['error']);
                            return timeout( CONNECT, SECOND );
                        }

                        // User Idle Callback
                        idlecb(messages[1]);

                        // Restore Previous Connection Point if Needed
                        TIMETOKEN = !TIMETOKEN               &&
                                    SUB_RESTORE              &&
                                    db['get'](SUBSCRIBE_KEY) || messages[1];

                        /*
                        // Connect
                        each_channel_registry(function(registry){
                            if (registry.connected) return;
                            registry.connected = 1;
                            registry.connect(channel.name);
                        });
                        */

                        // Connect
                        each_channel(function(channel){
                            if (channel.connected) return;
                            channel.connected = 1;
                            channel.connect(channel.name);
                        });

                        // Connect for channel groups
                        each_channel_group(function(channel_group){
                            if (channel_group.connected) return;
                            channel_group.connected = 1;
                            channel_group.connect(channel_group.name);
                        });

                        if (RESUMED && !SUB_RESTORE) {
                                TIMETOKEN = 0;
                                RESUMED = false;
                                // Update Saved Timetoken
                                db['set']( SUBSCRIBE_KEY, 0 );
                                timeout( _connect, windowing );
                                return;
                        }

                        // Invoke Memory Catchup and Receive Up to 100
                        // Previous Messages from the Queue.
                        if (backfill) {
                            TIMETOKEN = 10000;
                            backfill  = 0;
                        }

                        // Update Saved Timetoken
                        db['set']( SUBSCRIBE_KEY, messages[1] );

                        // Route Channel <---> Callback for Message
                        var next_callback = (function() {
                            var channels = '';
                            var channels2 = '';

                            if (messages.length > 3) {
                                channels  = messages[3];
                                channels2 = messages[2];
                            } else if (messages.length > 2) {
                                channels = messages[2];
                            } else {
                                channels =  map(
                                    generate_channel_list(CHANNELS), function(chan) { return map(
                                        Array(messages[0].length)
                                        .join(',').split(','),
                                        function() { return chan; }
                                    ) }).join(',')
                            }

                            var list  = channels.split(',');
                            var list2 = (channels2)?channels2.split(','):[];

                            return function() {
                                var channel  = list.shift()||SUB_CHANNEL;
                                var channel2 = list2.shift();

                                var chobj = {};

                                if (channel2) {
                                    if (channel && channel.indexOf('-pnpres') >= 0 
                                        && channel2.indexOf('-pnpres') < 0) {
                                        channel2 += '-pnpres';
                                    }
                                    chobj = CHANNEL_GROUPS[channel2] || CHANNELS[channel2] || {'callback' : function(){}};
                                } else {
                                    chobj = CHANNELS[channel];
                                }

                                var r = [
                                    chobj
                                    .callback||SUB_CALLBACK,
                                    channel.split(PRESENCE_SUFFIX)[0]
                                ];
                                channel2 && r.push(channel2.split(PRESENCE_SUFFIX)[0]);
                                return r;
                            };
                        })();

                        var latency = detect_latency(+messages[1]);
                        each( messages[0], function(msg) {
                            var next = next_callback();
                            var decrypted_msg = decrypt(msg,
                                (CHANNELS[next[1]])?CHANNELS[next[1]]['cipher_key']:null);
                            next[0] && next[0]( decrypted_msg, messages, next[2] || next[1], latency, next[1]);
                        });

                        timeout( _connect, windowing );
                    }
                });
            }

            CONNECT = function() {
                _reset_offline();
                timeout( _connect, windowing );
            };

            // Reduce Status Flicker
            if (!READY) return READY_BUFFER.push(CONNECT);

            // Connect Now
            CONNECT();
        },

        /*
            PUBNUB.here_now({ channel : 'my_chat', callback : fun });
        */
        'here_now' : function( args, callback ) {
            var callback = args['callback'] || callback
            ,   debug    = args['debug']
            ,   err      = args['error']    || function(){}
            ,   auth_key = args['auth_key'] || AUTH_KEY
            ,   channel  = args['channel']
            ,   channel_group = args['channel_group']
            ,   jsonp    = jsonp_cb()
            ,   uuids    = ('uuids' in args) ? args['uuids'] : true
            ,   state    = args['state']
            ,   data     = { 'uuid' : UUID, 'auth' : auth_key };

            if (!uuids) data['disable_uuids'] = 1;
            if (state) data['state'] = 1;

            // Make sure we have a Channel
            if (!callback)      return error('Missing Callback');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            var url = [
                    STD_ORIGIN, 'v2', 'presence',
                    'sub_key', SUBSCRIBE_KEY
                ];

            channel && url.push('channel') && url.push(encode(channel));

            if (jsonp != '0') { data['callback'] = jsonp; }

            if (channel_group) {
                data['channel-group'] = channel_group;
                !channel && url.push('channel') && url.push(','); 
            }

            if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

            xdr({
                callback : jsonp,
                data     : _get_url_params(data),
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                debug    : debug,
                url      : url
            });
        },

        /*
            PUBNUB.current_channels_by_uuid({ channel : 'my_chat', callback : fun });
        */
        'where_now' : function( args, callback ) {
            var callback = args['callback'] || callback
            ,   err      = args['error']    || function(){}
            ,   auth_key = args['auth_key'] || AUTH_KEY
            ,   jsonp    = jsonp_cb()
            ,   uuid     = args['uuid']     || UUID
            ,   data     = { 'auth' : auth_key };

            // Make sure we have a Channel
            if (!callback)      return error('Missing Callback');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            if (jsonp != '0') { data['callback'] = jsonp; }

            if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

            xdr({
                callback : jsonp,
                data     : _get_url_params(data),
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : [
                    STD_ORIGIN, 'v2', 'presence',
                    'sub_key', SUBSCRIBE_KEY,
                    'uuid', encode(uuid)
                ]
            });
        },

        'state' : function(args, callback) {
            var callback = args['callback'] || callback || function(r) {}
            ,   err      = args['error']    || function(){}
            ,   auth_key = args['auth_key'] || AUTH_KEY
            ,   jsonp    = jsonp_cb()
            ,   state    = args['state']
            ,   uuid     = args['uuid'] || UUID
            ,   channel  = args['channel']
            ,   channel_group = args['channel_group']
            ,   url
            ,   data     = _get_url_params({ 'auth' : auth_key });

            // Make sure we have a Channel
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');
            if (!uuid) return error('Missing UUID');
            if (!channel && !channel_group) return error('Missing Channel');

            if (jsonp != '0') { data['callback'] = jsonp; }

            if (typeof channel != 'undefined'
                && CHANNELS[channel] && CHANNELS[channel].subscribed ) {
                if (state) STATE[channel] = state;
            }

            if (typeof channel_group != 'undefined'
                && CHANNEL_GROUPS[channel_group]
                && CHANNEL_GROUPS[channel_group].subscribed
                ) {
                if (state) STATE[channel_group] = state;
                data['channel-group'] = channel_group;

                if (!channel) {
                    channel = ',';
                }
            }

            data['state'] = JSON.stringify(state);

            if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

            if (state) {
                url      = [
                    STD_ORIGIN, 'v2', 'presence',
                    'sub-key', SUBSCRIBE_KEY,
                    'channel', channel,
                    'uuid', uuid, 'data'
                ]
            } else {
                url      = [
                    STD_ORIGIN, 'v2', 'presence',
                    'sub-key', SUBSCRIBE_KEY,
                    'channel', channel,
                    'uuid', encode(uuid)
                ]
            }

            xdr({
                callback : jsonp,
                data     : _get_url_params(data),
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : url

            });

        },

        /*
            PUBNUB.grant({
                channel  : 'my_chat',
                callback : fun,
                error    : fun,
                ttl      : 24 * 60, // Minutes
                read     : true,
                write    : true,
                auth_key : '3y8uiajdklytowsj'
            });
        */
        'grant' : function( args, callback ) {
            var callback        = args['callback'] || callback
            ,   err             = args['error']    || function(){}
            ,   channel         = args['channel']  || args['channels']
            ,   channel_group   = args['channel_group']
            ,   jsonp           = jsonp_cb()
            ,   ttl             = args['ttl']
            ,   r               = (args['read'] )?"1":"0"
            ,   w               = (args['write'])?"1":"0"
            ,   m               = (args['manage'])?"1":"0"
            ,   auth_key        = args['auth_key'] || args['auth_keys'];

            if (!callback)      return error('Missing Callback');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');
            if (!PUBLISH_KEY)   return error('Missing Publish Key');
            if (!SECRET_KEY)    return error('Missing Secret Key');

            var timestamp  = Math.floor(new Date().getTime() / 1000)
            ,   sign_input = SUBSCRIBE_KEY + "\n" + PUBLISH_KEY + "\n"
                    + "grant" + "\n";

            var data = {
                'w'         : w,
                'r'         : r,
                'timestamp' : timestamp
            };
            if (args['manage']) {
                data['m'] = m;
            }
            if (isArray(channel)) {
                channel = channel['join'](',');
            }
            if (isArray(auth_key)) {
                auth_key = auth_key['join'](',');
            }
            if (typeof channel != 'undefined' && channel != null && channel.length > 0) data['channel'] = channel;
            if (typeof channel_group != 'undefined' && channel_group != null && channel_group.length > 0) {
                data['channel-group'] = channel_group;
            }
            if (jsonp != '0') { data['callback'] = jsonp; }
            if (ttl || ttl === 0) data['ttl'] = ttl;

            if (auth_key) data['auth'] = auth_key;

            data = _get_url_params(data)

            if (!auth_key) delete data['auth'];

            sign_input += _get_pam_sign_input_from_params(data);

            var signature = hmac_SHA256( sign_input, SECRET_KEY );

            signature = signature.replace( /\+/g, "-" );
            signature = signature.replace( /\//g, "_" );

            data['signature'] = signature;

            xdr({
                callback : jsonp,
                data     : data,
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : [
                    STD_ORIGIN, 'v1', 'auth', 'grant' ,
                    'sub-key', SUBSCRIBE_KEY
                ]
            });
        },

        /*
         PUBNUB.mobile_gw_provision ({
         device_id: 'A655FBA9931AB',
         op       : 'add' | 'remove',
         gw_type  : 'apns' | 'gcm',
         channel  : 'my_chat',
         callback : fun,
         error    : fun,
         });
         */

        'mobile_gw_provision' : function( args ) {

            var callback = args['callback'] || function(){}
                ,   auth_key       = args['auth_key'] || AUTH_KEY
                ,   err            = args['error'] || function() {}
                ,   jsonp          = jsonp_cb()
                ,   channel        = args['channel']
                ,   op             = args['op']
                ,   gw_type        = args['gw_type']
                ,   device_id      = args['device_id']
                ,   params
                ,   url;

            if (!device_id)     return error('Missing Device ID (device_id)');
            if (!gw_type)       return error('Missing GW Type (gw_type: gcm or apns)');
            if (!op)            return error('Missing GW Operation (op: add or remove)');
            if (!channel)       return error('Missing gw destination Channel (channel)');
            if (!PUBLISH_KEY)   return error('Missing Publish Key');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');

            // Create URL
            url = [
                STD_ORIGIN, 'v1/push/sub-key',
                SUBSCRIBE_KEY, 'devices', device_id
            ];

            params = { 'uuid' : UUID, 'auth' : auth_key, 'type': gw_type};

            if (op == "add") {
                params['add'] = channel;
            } else if (op == "remove") {
                params['remove'] = channel;
            }

            if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

            xdr({
                callback : jsonp,
                data     : params,
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : url
            });

        },

        /*
            PUBNUB.audit({
                channel  : 'my_chat',
                callback : fun,
                error    : fun,
                read     : true,
                write    : true,
                auth_key : '3y8uiajdklytowsj'
            });
        */
        'audit' : function( args, callback ) {
            var callback        = args['callback'] || callback
            ,   err             = args['error']    || function(){}
            ,   channel         = args['channel']
            ,   channel_group   = args['channel_group']
            ,   auth_key        = args['auth_key']
            ,   jsonp           = jsonp_cb();

            // Make sure we have a Channel
            if (!callback)      return error('Missing Callback');
            if (!SUBSCRIBE_KEY) return error('Missing Subscribe Key');
            if (!PUBLISH_KEY)   return error('Missing Publish Key');
            if (!SECRET_KEY)    return error('Missing Secret Key');

            var timestamp  = Math.floor(new Date().getTime() / 1000)
            ,   sign_input = SUBSCRIBE_KEY + "\n"
                + PUBLISH_KEY + "\n"
                + "audit" + "\n";

            var data = {'timestamp' : timestamp };
            if (jsonp != '0') { data['callback'] = jsonp; }
            if (typeof channel != 'undefined' && channel != null && channel.length > 0) data['channel'] = channel;
            if (typeof channel_group != 'undefined' && channel_group != null && channel_group.length > 0) {
                data['channel-group'] = channel_group;
            }
            if (auth_key) data['auth']    = auth_key;

            data = _get_url_params(data);

            if (!auth_key) delete data['auth'];

            sign_input += _get_pam_sign_input_from_params(data);

            var signature = hmac_SHA256( sign_input, SECRET_KEY );

            signature = signature.replace( /\+/g, "-" );
            signature = signature.replace( /\//g, "_" );

            data['signature'] = signature;
            xdr({
                callback : jsonp,
                data     : data,
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) {
                    _invoke_error(response, err);
                },
                url      : [
                    STD_ORIGIN, 'v1', 'auth', 'audit' ,
                    'sub-key', SUBSCRIBE_KEY
                ]
            });
        },

        /*
            PUBNUB.revoke({
                channel  : 'my_chat',
                callback : fun,
                error    : fun,
                auth_key : '3y8uiajdklytowsj'
            });
        */
        'revoke' : function( args, callback ) {
            args['read']  = false;
            args['write'] = false;
            SELF['grant']( args, callback );
        },
        'set_uuid' : function(uuid) {
            UUID = uuid;
            CONNECT();
        },
        'get_uuid' : function() {
            return UUID;
        },
        'isArray'  : function(arg) {
            return isArray(arg);
        },
        'get_subscibed_channels' : function() {
            return generate_channel_list(CHANNELS, true);
        },
        'presence_heartbeat' : function(args) {
            var callback = args['callback'] || function() {}
            var err      = args['error']    || function() {}
            var jsonp    = jsonp_cb();
            var data     = { 'uuid' : UUID, 'auth' : AUTH_KEY };

            var st = JSON['stringify'](STATE);
            if (st.length > 2) data['state'] = JSON['stringify'](STATE);

            if (PRESENCE_HB > 0 && PRESENCE_HB < 320) data['heartbeat'] = PRESENCE_HB;

            if (jsonp != '0') { data['callback'] = jsonp; }

            var channels        = encode(generate_channel_list(CHANNELS, true)['join'](','));
            var channel_groups  = generate_channel_group_list(CHANNEL_GROUPS, true)['join'](',');

            if (!channels) channels = ',';
            if (channel_groups) data['channel-group'] = channel_groups;

            if (USE_INSTANCEID) data['instanceid'] = INSTANCEID;

            xdr({
                callback : jsonp,
                data     : _get_url_params(data),
                timeout  : SECOND * 5,
                url      : [
                    STD_ORIGIN, 'v2', 'presence',
                    'sub-key', SUBSCRIBE_KEY,
                    'channel' , channels,
                    'heartbeat'
                ],
                success  : function(response) {
                    _invoke_callback(response, callback, err);
                },
                fail     : function(response) { _invoke_error(response, err); }
            });
        },
        'stop_timers': function () {
            clearTimeout(_poll_timer);
            clearTimeout(_poll_timer2);
            clearTimeout(PRESENCE_HB_TIMEOUT);
        },
        'shutdown': function () {
            SELF['stop_timers']();
            shutdown && shutdown();
        },

        // Expose PUBNUB Functions
        'xdr'           : xdr,
        'ready'         : ready,
        'db'            : db,
        'uuid'          : generate_uuid,
        'map'           : map,
        'each'          : each,
        'each-channel'  : each_channel,
        'grep'          : grep,
        'offline'       : function(){ _reset_offline(
            1, { "message" : "Offline. Please check your network settings." })
        },
        'supplant'      : supplant,
        'now'           : rnow,
        'unique'        : unique,
        'updater'       : updater
    };

    function _poll_online() {
        _is_online() || _reset_offline( 1, {
            "error" : "Offline. Please check your network settings. "
        });
        _poll_timer && clearTimeout(_poll_timer);
        _poll_timer = timeout( _poll_online, SECOND );
    }

    function _poll_online2() {
        if (!TIME_CHECK) return;
        SELF['time'](function(success){
            detect_time_detla( function(){}, success );
            success || _reset_offline( 1, {
                "error" : "Heartbeat failed to connect to Pubnub Servers." +
                    "Please check your network settings."
                });
            _poll_timer2 && clearTimeout(_poll_timer2);
            _poll_timer2 = timeout( _poll_online2, KEEPALIVE );
        });
    }

    function _reset_offline(err, msg) {
        SUB_RECEIVER && SUB_RECEIVER(err, msg);
        SUB_RECEIVER = null;

        clearTimeout(_poll_timer);
        clearTimeout(_poll_timer2);
    }
    
    if (!UUID) UUID = SELF['uuid']();
    if (!INSTANCEID) INSTANCEID = SELF['uuid']();
    db['set']( SUBSCRIBE_KEY + 'uuid', UUID );

    _poll_timer  = timeout( _poll_online,  SECOND    );
    _poll_timer2 = timeout( _poll_online2, KEEPALIVE );
    PRESENCE_HB_TIMEOUT = timeout(
        start_presence_heartbeat,
        ( PRESENCE_HB_INTERVAL - 3 ) * SECOND
    );

    // Detect Age of Message
    function detect_latency(tt) {
        var adjusted_time = rnow() - TIME_DRIFT;
        return adjusted_time - tt / 10000;
    }

    detect_time_detla();
    function detect_time_detla( cb, time ) {
        var stime = rnow();

        time && calculate(time) || SELF['time'](calculate);

        function calculate(time) {
            if (!time) return;
            var ptime   = time / 10000
            ,   latency = (rnow() - stime) / 2;
            TIME_DRIFT = rnow() - (ptime + latency);
            cb && cb(TIME_DRIFT);
        }
    }

    return SELF;
}
function crypto_obj() {

    function SHA256(s) {
        return CryptoJS['SHA256'](s)['toString'](CryptoJS['enc']['Hex']);
    }

    var iv = "0123456789012345";

    var allowedKeyEncodings = ['hex', 'utf8', 'base64', 'binary'];
    var allowedKeyLengths = [128, 256];
    var allowedModes = ['ecb', 'cbc'];

    var defaultOptions = {
        'encryptKey': true,
        'keyEncoding': 'utf8',
        'keyLength': 256,
        'mode': 'cbc'
    };

    function parse_options(options) {

        // Defaults
        options = options || {};
        if (!options['hasOwnProperty']('encryptKey')) options['encryptKey'] = defaultOptions['encryptKey'];
        if (!options['hasOwnProperty']('keyEncoding')) options['keyEncoding'] = defaultOptions['keyEncoding'];
        if (!options['hasOwnProperty']('keyLength')) options['keyLength'] = defaultOptions['keyLength'];
        if (!options['hasOwnProperty']('mode')) options['mode'] = defaultOptions['mode'];

        // Validation
        if (allowedKeyEncodings['indexOf'](options['keyEncoding']['toLowerCase']()) == -1) options['keyEncoding'] = defaultOptions['keyEncoding'];
        if (allowedKeyLengths['indexOf'](parseInt(options['keyLength'], 10)) == -1) options['keyLength'] = defaultOptions['keyLength'];
        if (allowedModes['indexOf'](options['mode']['toLowerCase']()) == -1) options['mode'] = defaultOptions['mode'];

        return options;

    }

    function decode_key(key, options) {
        if (options['keyEncoding'] == 'base64') {
            return CryptoJS['enc']['Base64']['parse'](key);
        } else if (options['keyEncoding'] == 'hex') {
            return CryptoJS['enc']['Hex']['parse'](key);
        } else {
            return key;
        }
    }

    function get_padded_key(key, options) {
        key = decode_key(key, options);
        if (options['encryptKey']) {
            return CryptoJS['enc']['Utf8']['parse'](SHA256(key)['slice'](0, 32));
        } else {
            return key;
        }
    }

    function get_mode(options) {
        if (options['mode'] == 'ecb') {
            return CryptoJS['mode']['ECB'];
        } else {
            return CryptoJS['mode']['CBC'];
        }
    }

    function get_iv(options) {
        return (options['mode'] == 'cbc') ? CryptoJS['enc']['Utf8']['parse'](iv) : null;
    }

    return {

        'encrypt': function(data, key, options) {
            if (!key) return data;
            options = parse_options(options);
            var iv = get_iv(options);
            var mode = get_mode(options);
            var cipher_key = get_padded_key(key, options);
            var hex_message = JSON['stringify'](data);
            var encryptedHexArray = CryptoJS['AES']['encrypt'](hex_message, cipher_key, {'iv': iv, 'mode': mode})['ciphertext'];
            var base_64_encrypted = encryptedHexArray['toString'](CryptoJS['enc']['Base64']);
            return base_64_encrypted || data;
        },

        'decrypt': function(data, key, options) {
            if (!key) return data;
            options = parse_options(options);
            var iv = get_iv(options);
            var mode = get_mode(options);
            var cipher_key = get_padded_key(key, options);
            try {
                var binary_enc = CryptoJS['enc']['Base64']['parse'](data);
                var json_plain = CryptoJS['AES']['decrypt']({'ciphertext': binary_enc}, cipher_key, {'iv': iv, 'mode': mode})['toString'](CryptoJS['enc']['Utf8']);
                var plaintext = JSON['parse'](json_plain);
                return plaintext;
            }
            catch (e) {
                return undefined;
            }
        }
    };
}
/**
 * UTIL LOCALS
 */

var SWF             = 'https://pubnub.a.ssl.fastly.net/pubnub.swf'
,   ASYNC           = 'async'
,   UA              = navigator.userAgent
,   PNSDK           = 'PubNub-JS-' + 'Web' + '/' + '3.7.16'
,   XORIGN          = UA.indexOf('MSIE 6') == -1;

/**
 * CONSOLE COMPATIBILITY
 */
window.console || (window.console=window.console||{});
console.log    || (
    console.log   =
    console.error =
    ((window.opera||{}).postError||function(){})
);

/**
 * LOCAL STORAGE OR COOKIE
 */
var db = (function(){
    var store = {};
    var ls = false;
    try {
        ls = window['localStorage'];
    } catch (e) { }
    var cookieGet = function(key) {
        if (document.cookie.indexOf(key) == -1) return null;
        return ((document.cookie||'').match(
            RegExp(key+'=([^;]+)')
        )||[])[1] || null;
    };
    var cookieSet = function( key, value ) {
        document.cookie = key + '=' + value +
            '; expires=Thu, 1 Aug 2030 20:00:00 UTC; path=/';
    };
    var cookieTest = (function() {
        try {
            cookieSet('pnctest', '1');
            return cookieGet('pnctest') === '1';
        } catch (e) {
            return false;
        }
    }());
    return {
        'get' : function(key) {
            try {
                if (ls) return ls.getItem(key);
                if (cookieTest) return cookieGet(key);
                return store[key];
            } catch(e) {
                return store[key];
            }
        },
        'set' : function( key, value ) {
            try {
                if (ls) return ls.setItem( key, value ) && 0;
                if (cookieTest) cookieSet( key, value );
                store[key] = value;
            } catch(e) {
                store[key] = value;
            }
        }
    };
})();

function get_hmac_SHA256(data,key) {
    var hash = CryptoJS['HmacSHA256'](data, key);
    return hash.toString(CryptoJS['enc']['Base64']);
}

/**
 * $
 * =
 * var div = $('divid');
 */
function $(id) { return document.getElementById(id) }

/**
 * ERROR
 * =====
 * error('message');
 */
function error(message) { console['error'](message) }

/**
 * SEARCH
 * ======
 * var elements = search('a div span');
 */
function search( elements, start) {
    var list = [];
    each( elements.split(/\s+/), function(el) {
        each( (start || document).getElementsByTagName(el), function(node) {
            list.push(node);
        } );
    });
    return list;
}

/**
 * BIND
 * ====
 * bind( 'keydown', search('a')[0], function(element) {
 *     ...
 * } );
 */
function bind( type, el, fun ) {
    each( type.split(','), function(etype) {
        var rapfun = function(e) {
            if (!e) e = window.event;
            if (!fun(e)) {
                e.cancelBubble = true;
                e.preventDefault  && e.preventDefault();
                e.stopPropagation && e.stopPropagation();
            }
        };

        if ( el.addEventListener ) el.addEventListener( etype, rapfun, false );
        else if ( el.attachEvent ) el.attachEvent( 'on' + etype, rapfun );
        else  el[ 'on' + etype ] = rapfun;
    } );
}

/**
 * UNBIND
 * ======
 * unbind( 'keydown', search('a')[0] );
 */
function unbind( type, el, fun ) {
    if ( el.removeEventListener ) el.removeEventListener( type, false );
    else if ( el.detachEvent ) el.detachEvent( 'on' + type, false );
    else  el[ 'on' + type ] = null;
}

/**
 * HEAD
 * ====
 * head().appendChild(elm);
 */
function head() { return search('head')[0] }

/**
 * ATTR
 * ====
 * var attribute = attr( node, 'attribute' );
 */
function attr( node, attribute, value ) {
    if (value) node.setAttribute( attribute, value );
    else return node && node.getAttribute && node.getAttribute(attribute);
}

/**
 * CSS
 * ===
 * var obj = create('div');
 */
function css( element, styles ) {
    for (var style in styles) if (styles.hasOwnProperty(style))
        try {element.style[style] = styles[style] + (
            '|width|height|top|left|'.indexOf(style) > 0 &&
            typeof styles[style] == 'number'
            ? 'px' : ''
        )}catch(e){}
}

/**
 * CREATE
 * ======
 * var obj = create('div');
 */
function create(element) { return document.createElement(element) }


/**
 * jsonp_cb
 * ========
 * var callback = jsonp_cb();
 */
function jsonp_cb() { return XORIGN || FDomainRequest() ? 0 : unique() }



/**
 * EVENTS
 * ======
 * PUBNUB.events.bind( 'you-stepped-on-flower', function(message) {
 *     // Do Stuff with message
 * } );
 *
 * PUBNUB.events.fire( 'you-stepped-on-flower', "message-data" );
 * PUBNUB.events.fire( 'you-stepped-on-flower', {message:"data"} );
 * PUBNUB.events.fire( 'you-stepped-on-flower', [1,2,3] );
 *
 */
var events = {
    'list'   : {},
    'unbind' : function( name ) { events.list[name] = [] },
    'bind'   : function( name, fun ) {
        (events.list[name] = events.list[name] || []).push(fun);
    },
    'fire' : function( name, data ) {
        each(
            events.list[name] || [],
            function(fun) { fun(data) }
        );
    }
};

/**
 * XDR Cross Domain Request
 * ========================
 *  xdr({
 *     url     : ['http://www.blah.com/url'],
 *     success : function(response) {},
 *     fail    : function() {}
 *  });
 */
function xdr( setup ) {
    if (XORIGN || FDomainRequest()) return ajax(setup);

    var script    = create('script')
    ,   callback  = setup.callback
    ,   id        = unique()
    ,   finished  = 0
    ,   xhrtme    = setup.timeout || DEF_TIMEOUT
    ,   timer     = timeout( function(){done(1, {"message" : "timeout"})}, xhrtme )
    ,   fail      = setup.fail    || function(){}
    ,   data      = setup.data    || {}
    ,   success   = setup.success || function(){}
    ,   append    = function() { head().appendChild(script) }
    ,   done      = function( failed, response ) {
            if (finished) return;
            finished = 1;

            script.onerror = null;
            clearTimeout(timer);

            (failed || !response) || success(response);

            timeout( function() {
                failed && fail();
                var s = $(id)
                ,   p = s && s.parentNode;
                p && p.removeChild(s);
            }, SECOND );
        };

    window[callback] = function(response) {
        done( 0, response );
    };

    if (!setup.blocking) script[ASYNC] = ASYNC;

    script.onerror = function() { done(1) };
    script.src     = build_url( setup.url, data );

    attr( script, 'id', id );

    append();
    return done;
}

/**
 * CORS XHR Request
 * ================
 *  xdr({
 *     url     : ['http://www.blah.com/url'],
 *     success : function(response) {},
 *     fail    : function() {}
 *  });
 */
function ajax( setup ) {
    var xhr, response
    ,   finished = function() {
            if (loaded) return;
            loaded = 1;

            clearTimeout(timer);

            try       { response = JSON['parse'](xhr.responseText); }
            catch (r) { return done(1); }

            complete = 1;
            success(response);
        }
    ,   complete = 0
    ,   loaded   = 0
    ,   xhrtme   = setup.timeout || DEF_TIMEOUT
    ,   timer    = timeout( function(){done(1, {"message" : "timeout"})}, xhrtme )
    ,   fail     = setup.fail    || function(){}
    ,   data     = setup.data    || {}
    ,   success  = setup.success || function(){}
    ,   async    = !(setup.blocking)
    ,   done     = function(failed,response) {
            if (complete) return;
            complete = 1;

            clearTimeout(timer);

            if (xhr) {
                xhr.onerror = xhr.onload = null;
                xhr.abort && xhr.abort();
                xhr = null;
            }

            failed && fail(response);
        };

    // Send
    try {
        xhr = FDomainRequest()      ||
              window.XDomainRequest &&
              new XDomainRequest()  ||
              new XMLHttpRequest();

        xhr.onerror = xhr.onabort   = function(e){ done(
            1, e || (xhr && xhr.responseText) || { "error" : "Network Connection Error"}
        ) };
        xhr.onload  = xhr.onloadend = finished;
        xhr.onreadystatechange = function() {
            if (xhr && xhr.readyState == 4) {
                switch(xhr.status) {
                    case 200:
                        break;
                    default:
                        try {
                            response = JSON['parse'](xhr.responseText);
                            done(1,response);
                        }
                        catch (r) { return done(1, {status : xhr.status, payload : null, message : xhr.responseText}); }
                        return;
                }
            }
        }

        var url = build_url(setup.url,data);

        xhr.open( 'GET', url, async );
        if (async) xhr.timeout = xhrtme;
        xhr.send();
    }
    catch(eee) {
        done(0);
        XORIGN = 0;
        return xdr(setup);
    }

    // Return 'done'
    return done;
}

// Test Connection State
function _is_online() {
    if (!('onLine' in navigator)) return 1;
    try       { return navigator['onLine'] }
    catch (e) { return true }
}


function sendBeacon(url) {
    if (!('sendBeacon' in navigator)) return false;

    return navigator['sendBeacon'](url);
}

/* =-====================================================================-= */
/* =-====================================================================-= */
/* =-=========================     PUBNUB     ===========================-= */
/* =-====================================================================-= */
/* =-====================================================================-= */

var PDIV          = $('pubnub') || 0
,   CREATE_PUBNUB = function(setup) {

    // Force JSONP if requested from user.
    if (setup['jsonp'])  XORIGN = 0;
    else                 XORIGN = UA.indexOf('MSIE 6') == -1;

    var SUBSCRIBE_KEY = setup['subscribe_key'] || ''
    ,   KEEPALIVE     = (+setup['keepalive']   || DEF_KEEPALIVE)   * SECOND
    ,   UUID          = setup['uuid'] || db['get'](SUBSCRIBE_KEY+'uuid')||'';

    var leave_on_unload = setup['leave_on_unload'] || 0;

    setup['xdr']        = xdr;
    setup['db']         = db;
    setup['error']      = setup['error'] || error;
    setup['_is_online'] = _is_online;
    setup['jsonp_cb']   = jsonp_cb;
    setup['hmac_SHA256']= get_hmac_SHA256;
    setup['crypto_obj'] = crypto_obj();
    setup['sendBeacon'] = sendBeacon;
    setup['params']     = { 'pnsdk' : PNSDK }

    var SELF = function(setup) {
        return CREATE_PUBNUB(setup);
    };

    var PN = PN_API(setup);

    for (var prop in PN) {
        if (PN.hasOwnProperty(prop)) {
            SELF[prop] = PN[prop];
        }
    }
    SELF['css']         = css;
    SELF['$']           = $;
    SELF['create']      = create;
    SELF['bind']        = bind;
    SELF['head']        = head;
    SELF['search']      = search;
    SELF['attr']        = attr;
    SELF['events']      = events;
    SELF['init']        = SELF;
    SELF['secure']      = SELF;
    SELF['crypto_obj']  = crypto_obj(); // export to instance


    // Add Leave Functions
    bind( 'beforeunload', window, function() {
        if (leave_on_unload) SELF['each-channel'](function(ch){ SELF['LEAVE']( ch.name, 0 ) });
        return true;
    } );

    // Return without Testing
    if (setup['notest']) return SELF;

    bind( 'offline', window,   SELF['offline'] );
    bind( 'offline', document, SELF['offline'] );

    // Return PUBNUB Socket Object
    return SELF;
};
CREATE_PUBNUB['init']   = CREATE_PUBNUB;
CREATE_PUBNUB['secure'] = CREATE_PUBNUB;
CREATE_PUBNUB['crypto_obj'] = crypto_obj(); // export to constructor

// Bind for PUBNUB Readiness to Subscribe
if (document.readyState === 'complete') {
    timeout( ready, 0 );
}
else {
    bind( 'load', window, function(){ timeout( ready, 0 ) } );
}

var pdiv = PDIV || {};

// CREATE A PUBNUB GLOBAL OBJECT
PUBNUB = CREATE_PUBNUB({
    'notest'        : 1,
    'publish_key'   : attr( pdiv, 'pub-key' ),
    'subscribe_key' : attr( pdiv, 'sub-key' ),
    'ssl'           : !document.location.href.indexOf('https') ||
                      attr( pdiv, 'ssl' ) == 'on',
    'origin'        : attr( pdiv, 'origin' ),
    'uuid'          : attr( pdiv, 'uuid' )
});

// jQuery Interface
window['jQuery'] && (window['jQuery']['PUBNUB'] = CREATE_PUBNUB);

// For Modern JS + Testling.js - http://testling.com/
typeof(module) !== 'undefined' && (module['exports'] = PUBNUB) && ready();

var pubnubs = $('pubnubs') || 0;

// LEAVE NOW IF NO PDIV.
if (!PDIV) return;

// PUBNUB Flash Socket
css( PDIV, { 'position' : 'absolute', 'top' : -SECOND } );

if ('opera' in window || attr( PDIV, 'flash' )) PDIV['innerHTML'] =
    '<object id=pubnubs data='  + SWF +
    '><param name=movie value=' + SWF +
    '><param name=allowscriptaccess value=always></object>';

// Create Interface for Opera Flash
PUBNUB['rdx'] = function( id, data ) {
    if (!data) return FDomainRequest[id]['onerror']();
    FDomainRequest[id]['responseText'] = unescape(data);
    FDomainRequest[id]['onload']();
};

function FDomainRequest() {
    if (!pubnubs || !pubnubs['get']) return 0;

    var fdomainrequest = {
        'id'    : FDomainRequest['id']++,
        'send'  : function() {},
        'abort' : function() { fdomainrequest['id'] = {} },
        'open'  : function( method, url ) {
            FDomainRequest[fdomainrequest['id']] = fdomainrequest;
            pubnubs['get']( fdomainrequest['id'], url );
        }
    };

    return fdomainrequest;
}
FDomainRequest['id'] = SECOND;

})();
(function(){

// ---------------------------------------------------------------------------
// WEBSOCKET INTERFACE
// ---------------------------------------------------------------------------
var WS = PUBNUB['ws'] = function( url, protocols ) {
    if (!(this instanceof WS)) return new WS( url, protocols );

    var self     = this
    ,   url      = self.url      = url || ''
    ,   protocol = self.protocol = protocols || 'Sec-WebSocket-Protocol'
    ,   bits     = url.split('/')
    ,   setup    = {
         'ssl'           : bits[0] === 'wss:'
        ,'origin'        : bits[2]
        ,'publish_key'   : bits[3]
        ,'subscribe_key' : bits[4]
        ,'channel'       : bits[5]
    };

    // READY STATES
    self['CONNECTING'] = 0; // The connection is not yet open.
    self['OPEN']       = 1; // The connection is open and ready to communicate.
    self['CLOSING']    = 2; // The connection is in the process of closing.
    self['CLOSED']     = 3; // The connection is closed or couldn't be opened.

    // CLOSE STATES
    self['CLOSE_NORMAL']         = 1000; // Normal Intended Close; completed.
    self['CLOSE_GOING_AWAY']     = 1001; // Closed Unexpecttedly.
    self['CLOSE_PROTOCOL_ERROR'] = 1002; // Server: Not Supported.
    self['CLOSE_UNSUPPORTED']    = 1003; // Server: Unsupported Protocol.
    self['CLOSE_TOO_LARGE']      = 1004; // Server: Too Much Data.
    self['CLOSE_NO_STATUS']      = 1005; // Server: No reason.
    self['CLOSE_ABNORMAL']       = 1006; // Abnormal Disconnect.

    // Events Default
    self['onclose']   = self['onerror'] =
    self['onmessage'] = self['onopen']  =
    self['onsend']    =  function(){};

    // Attributes
    self['binaryType']     = '';
    self['extensions']     = '';
    self['bufferedAmount'] = 0;
    self['trasnmitting']   = false;
    self['buffer']         = [];
    self['readyState']     = self['CONNECTING'];

    // Close if no setup.
    if (!url) {
        self['readyState'] = self['CLOSED'];
        self['onclose']({
            'code'     : self['CLOSE_ABNORMAL'],
            'reason'   : 'Missing URL',
            'wasClean' : true
        });
        return self;
    }

    // PubNub WebSocket Emulation
    self.pubnub       = PUBNUB['init'](setup);
    self.pubnub.setup = setup;
    self.setup        = setup;

    self.pubnub['subscribe']({
        'restore'    : false,
        'channel'    : setup['channel'],
        'disconnect' : self['onerror'],
        'reconnect'  : self['onopen'],
        'error'      : function() {
            self['onclose']({
                'code'     : self['CLOSE_ABNORMAL'],
                'reason'   : 'Missing URL',
                'wasClean' : false
            });
        },
        'callback'   : function(message) {
            self['onmessage']({ 'data' : message });
        },
        'connect'    : function() {
            self['readyState'] = self['OPEN'];
            self['onopen']();
        }
    });
};

// ---------------------------------------------------------------------------
// WEBSOCKET SEND
// ---------------------------------------------------------------------------
WS.prototype.send = function(data) {
    var self = this;
    self.pubnub['publish']({
        'channel'  : self.pubnub.setup['channel'],
        'message'  : data,
        'callback' : function(response) {
            self['onsend']({ 'data' : response });
        }
    });
};

// ---------------------------------------------------------------------------
// WEBSOCKET CLOSE
// ---------------------------------------------------------------------------
WS.prototype.close = function() {
    var self = this;
    self.pubnub['unsubscribe']({ 'channel' : self.pubnub.setup['channel'] });
    self['readyState'] = self['CLOSED'];
    self['onclose']({});
};

})();
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(h,s){var f={},g=f.lib={},q=function(){},m=g.Base={extend:function(a){q.prototype=this;var c=new q;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=g.WordArray=m.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=s?c:4*a.length},toString:function(a){return(a||k).stringify(this)},concat:function(a){var c=this.words,d=a.words,b=this.sigBytes;a=a.sigBytes;this.clamp();if(b%4)for(var e=0;e<a;e++)c[b+e>>>2]|=(d[e>>>2]>>>24-8*(e%4)&255)<<24-8*((b+e)%4);else if(65535<d.length)for(e=0;e<a;e+=4)c[b+e>>>2]=d[e>>>2];else c.push.apply(c,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=h.ceil(c/4)},clone:function(){var a=m.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],d=0;d<a;d+=4)c.push(4294967296*h.random()|0);return new r.init(c,a)}}),l=f.enc={},k=l.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++){var e=c[b>>>2]>>>24-8*(b%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b+=2)d[b>>>3]|=parseInt(a.substr(b,
2),16)<<24-4*(b%8);return new r.init(d,c/2)}},n=l.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++)d.push(String.fromCharCode(c[b>>>2]>>>24-8*(b%4)&255));return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b++)d[b>>>2]|=(a.charCodeAt(b)&255)<<24-8*(b%4);return new r.init(d,c)}},j=l.Utf8={stringify:function(a){try{return decodeURIComponent(escape(n.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return n.parse(unescape(encodeURIComponent(a)))}},
u=g.BufferedBlockAlgorithm=m.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=j.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,d=c.words,b=c.sigBytes,e=this.blockSize,f=b/(4*e),f=a?h.ceil(f):h.max((f|0)-this._minBufferSize,0);a=f*e;b=h.min(4*a,b);if(a){for(var g=0;g<a;g+=e)this._doProcessBlock(d,g);g=d.splice(0,a);c.sigBytes-=b}return new r.init(g,b)},clone:function(){var a=m.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});g.Hasher=u.extend({cfg:m.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){u.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,d){return(new a.init(d)).finalize(c)}},_createHmacHelper:function(a){return function(c,d){return(new t.HMAC.init(a,
d)).finalize(c)}}});var t=f.algo={};return f}(Math);

// SHA256
(function(h){for(var s=CryptoJS,f=s.lib,g=f.WordArray,q=f.Hasher,f=s.algo,m=[],r=[],l=function(a){return 4294967296*(a-(a|0))|0},k=2,n=0;64>n;){var j;a:{j=k;for(var u=h.sqrt(j),t=2;t<=u;t++)if(!(j%t)){j=!1;break a}j=!0}j&&(8>n&&(m[n]=l(h.pow(k,0.5))),r[n]=l(h.pow(k,1/3)),n++);k++}var a=[],f=f.SHA256=q.extend({_doReset:function(){this._hash=new g.init(m.slice(0))},_doProcessBlock:function(c,d){for(var b=this._hash.words,e=b[0],f=b[1],g=b[2],j=b[3],h=b[4],m=b[5],n=b[6],q=b[7],p=0;64>p;p++){if(16>p)a[p]=
c[d+p]|0;else{var k=a[p-15],l=a[p-2];a[p]=((k<<25|k>>>7)^(k<<14|k>>>18)^k>>>3)+a[p-7]+((l<<15|l>>>17)^(l<<13|l>>>19)^l>>>10)+a[p-16]}k=q+((h<<26|h>>>6)^(h<<21|h>>>11)^(h<<7|h>>>25))+(h&m^~h&n)+r[p]+a[p];l=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&f^e&g^f&g);q=n;n=m;m=h;h=j+k|0;j=g;g=f;f=e;e=k+l|0}b[0]=b[0]+e|0;b[1]=b[1]+f|0;b[2]=b[2]+g|0;b[3]=b[3]+j|0;b[4]=b[4]+h|0;b[5]=b[5]+m|0;b[6]=b[6]+n|0;b[7]=b[7]+q|0},_doFinalize:function(){var a=this._data,d=a.words,b=8*this._nDataBytes,e=8*a.sigBytes;
d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=h.floor(b/4294967296);d[(e+64>>>9<<4)+15]=b;a.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var a=q.clone.call(this);a._hash=this._hash.clone();return a}});s.SHA256=q._createHelper(f);s.HmacSHA256=q._createHmacHelper(f)})(Math);

// HMAC SHA256
(function(){var h=CryptoJS,s=h.enc.Utf8;h.algo.HMAC=h.lib.Base.extend({init:function(f,g){f=this._hasher=new f.init;"string"==typeof g&&(g=s.parse(g));var h=f.blockSize,m=4*h;g.sigBytes>m&&(g=f.finalize(g));g.clamp();for(var r=this._oKey=g.clone(),l=this._iKey=g.clone(),k=r.words,n=l.words,j=0;j<h;j++)k[j]^=1549556828,n[j]^=909522486;r.sigBytes=l.sigBytes=m;this.reset()},reset:function(){var f=this._hasher;f.reset();f.update(this._iKey)},update:function(f){this._hasher.update(f);return this},finalize:function(f){var g=
this._hasher;f=g.finalize(f);g.reset();return g.finalize(this._oKey.clone().concat(f))}})})();

// Base64
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();

// BlockCipher
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
l)}})();

// Cipher
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();

// AES
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();

// Mode ECB
CryptoJS.mode.ECB = (function () {
    var ECB = CryptoJS.lib.BlockCipherMode.extend();

    ECB.Encryptor = ECB.extend({
        processBlock: function (words, offset) {
            this._cipher.encryptBlock(words, offset);
        }
    });

    ECB.Decryptor = ECB.extend({
        processBlock: function (words, offset) {
            this._cipher.decryptBlock(words, offset);
        }
    });

    return ECB;
}());// Moved to hmac-sha-256.js
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)(module)))

/***/ },
/* 12 */
/***/ function(module, exports) {

'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cache = (function () {
    function Cache(storage, prefix) {
        _classCallCheck(this, Cache);

        this.setPrefix(prefix);
        this._storage = storage;
    }

    Cache.prototype.setPrefix = function setPrefix(prefix) {
        this._prefix = prefix || Cache.defaultPrefix;
        return this;
    };

    Cache.prototype.setItem = function setItem(key, data) {
        this._storage[this._prefixKey(key)] = JSON.stringify(data);
        return this;
    };

    Cache.prototype.removeItem = function removeItem(key) {
        delete this._storage[this._prefixKey(key)];
        return this;
    };

    Cache.prototype.getItem = function getItem(key) {
        var item = this._storage[this._prefixKey(key)];
        if (!item) return null;
        return JSON.parse(item);
    };

    Cache.prototype.clean = function clean() {

        for (var key in this._storage) {

            if (!this._storage.hasOwnProperty(key)) continue;

            if (key.indexOf(this._prefix) === 0) {
                delete this._storage[key];
            }
        }

        return this;
    };

    Cache.prototype._prefixKey = function _prefixKey(key) {
        return this._prefix + key;
    };

    return Cache;
})();

Cache.defaultPrefix = 'rc-';
exports.default = Cache;

/***/ },
/* 13 */
/***/ function(module, exports) {

'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Observable = (function () {
    function Observable() {
        _classCallCheck(this, Observable);

        this.off();
    }

    Observable.prototype.hasListeners = function hasListeners(event) {
        return event in this._listeners;
    };

    Observable.prototype.on = function on(events, callback) {
        var _this = this;

        if (typeof events == 'string') events = [events];
        if (!events) throw new Error('No events to subscribe to');
        if (typeof callback !== 'function') throw new Error('Callback must be a function');

        events.forEach(function (event) {

            if (!_this.hasListeners(event)) _this._listeners[event] = [];

            _this._listeners[event].push(callback);
        });

        return this;
    };

    Observable.prototype.emit = function emit(event) {
        var _this2 = this;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }

        var result = null;

        if (!this.hasListeners(event)) return null;

        this._listeners[event].some(function (callback) {

            result = callback.apply(_this2, args);
            return result === false;
        });

        return result;
    };

    Observable.prototype.off = function off(event, callback) {
        var _this3 = this;

        if (!event) {

            this._listeners = {};
        } else {

            if (!callback) {

                delete this._listeners[event];
            } else {

                if (!this.hasListeners(event)) return this;

                this._listeners[event].forEach(function (cb, i) {

                    if (cb === callback) delete _this3._listeners[event][i];
                });
            }
        }

        return this;
    };

    return Observable;
})();

exports.default = Observable;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _Externals = __webpack_require__(4);

var _Utils = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue = (function () {
    function Queue(cache, cacheId) {
        _classCallCheck(this, Queue);

        this._cache = cache;
        this._cacheId = cacheId;
        this._promise = null;
    }

    Queue.prototype.isPaused = function isPaused() {

        var time = this._cache.getItem(this._cacheId);

        return !!time && Date.now() - parseInt(time) < Queue._releaseTimeout;
    };

    Queue.prototype.pause = function pause() {
        this._cache.setItem(this._cacheId, Date.now());
        return this;
    };

    Queue.prototype.resume = function resume() {
        this._cache.removeItem(this._cacheId);
        return this;
    };

    Queue.prototype.poll = function poll() {
        var _this = this;

        if (this._promise) return this._promise;

        this._promise = new _Externals.Promise(function (resolve, reject) {

            (0, _Utils.poll)(function (next) {

                if (_this.isPaused()) return next();

                _this._promise = null;

                _this.resume(); // this is actually not needed but why not

                resolve(null);
            }, Queue._pollInterval);
        });

        return this._promise;
    };

    return Queue;
})();

Queue._pollInterval = 250;
Queue._releaseTimeout = 5000;
exports.default = Queue;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _Externals = __webpack_require__(4);

var _Utils = __webpack_require__(3);

var _Utils2 = __webpack_require__(16);

var _Observable2 = __webpack_require__(13);

var _Observable3 = _interopRequireDefault(_Observable2);

var _ApiResponse = __webpack_require__(17);

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _Externals.Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { _Externals.Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Client = (function (_Observable) {
    _inherits(Client, _Observable);

    function Client() {
        var _temp, _this, _ret;

        _classCallCheck(this, Client);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Observable.call.apply(_Observable, [this].concat(args))), _this), _this.events = {
            beforeRequest: 'beforeRequest',
            requestSuccess: 'requestSuccess',
            requestError: 'requestError'
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    /**
     * @param {Request} request
     * @return {Promise<ApiResponse>}
     */

    Client.prototype.sendRequest = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request) {
            var apiResponse;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            apiResponse = new _ApiResponse2.default(request);
                            _context.prev = 1;

                            //TODO Stop request if listeners return false
                            this.emit(this.events.beforeRequest, apiResponse);

                            _context.next = 5;
                            return this._loadResponse(request);

                        case 5:
                            apiResponse._response = _context.sent;

                            if (!(apiResponse._isMultipart() || apiResponse._isJson())) {
                                _context.next = 10;
                                break;
                            }

                            _context.next = 9;
                            return apiResponse.response().text();

                        case 9:
                            apiResponse._text = _context.sent;

                        case 10:
                            if (apiResponse.ok()) {
                                _context.next = 12;
                                break;
                            }

                            throw new Error('Response has unsuccessful status');

                        case 12:

                            this.emit(this.events.requestSuccess, apiResponse);

                            return _context.abrupt('return', apiResponse);

                        case 16:
                            _context.prev = 16;
                            _context.t0 = _context['catch'](1);

                            if (!_context.t0.apiResponse) _context.t0 = this.makeError(_context.t0, apiResponse);

                            this.emit(this.events.requestError, _context.t0);

                            throw _context.t0;

                        case 21:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[1, 16]]);
        }));

        return function sendRequest(_x) {
            return ref.apply(this, arguments);
        };
    })();

    /**
     * @param {Request} request
     * @return {Promise<Response>}
     * @private
     */

    Client.prototype._loadResponse = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(request) {
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return _Externals.fetch.call(null, request);

                        case 2:
                            return _context2.abrupt('return', _context2.sent);

                        case 3:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));

        return function _loadResponse(_x2) {
            return ref.apply(this, arguments);
        };
    })();

    /**
     * Wraps the JS Error object with transaction information
     * @param {Error|IApiError} e
     * @param {ApiResponse} apiResponse
     * @return {IApiError}
     */

    Client.prototype.makeError = function makeError(e, apiResponse) {

        // Wrap only if regular error
        if (!e.hasOwnProperty('apiResponse') && !e.hasOwnProperty('originalMessage')) {

            e.apiResponse = apiResponse;
            e.originalMessage = e.message;
            e.message = apiResponse && apiResponse.error(true) || e.originalMessage;
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
     * @return {Request}
     */

    Client.prototype.createRequest = function createRequest(init) {

        init = init || {};
        init.headers = init.headers || {};

        // Sanity checks
        if (!init.url) throw new Error('Url is not defined');
        if (!init.method) init.method = 'GET';
        if (init.method && Client._allowedMethods.indexOf(init.method.toUpperCase()) < 0) {
            throw new Error('Method has wrong value: ' + init.method);
        }

        // Defaults
        init.credentials = init.credentials || 'include';
        init.mode = init.mode || 'cors';

        // Append Query String
        if (init.query) {
            init.url = init.url + (init.url.indexOf('?') > -1 ? '&' : '?') + (0, _Utils.queryStringify)(init.query);
        }

        if (!(0, _Utils2.findHeaderName)('Accept', init.headers)) {
            init.headers['Accept'] = _ApiResponse2.default._jsonContentType;
        }

        // Serialize body
        //TODO Check that body is a plain object
        if (typeof init.body !== 'string' || !init.body) {

            var contentTypeHeaderName = (0, _Utils2.findHeaderName)(_ApiResponse2.default._contentType, init.headers);

            if (!contentTypeHeaderName) {
                contentTypeHeaderName = _ApiResponse2.default._contentType;
                init.headers[contentTypeHeaderName] = _ApiResponse2.default._jsonContentType;
            }

            var contentType = init.headers[contentTypeHeaderName];

            // Assign a new encoded body
            if (contentType.indexOf(_ApiResponse2.default._jsonContentType) > -1) {
                init.body = JSON.stringify(init.body);
            } else if (contentType.indexOf(_ApiResponse2.default._urlencodedContentType) > -1) {
                init.body = (0, _Utils.queryStringify)(init.body);
            }
        }

        // Create a request with encoded body
        var req = new _Externals.Request(init.url, init);

        // Keep the original body accessible directly (for mocks)
        req.originalBody = init.body;

        return req;
    };

    return Client;
})(_Observable3.default);

/**
 * @name IApiError
 * @property {string} stack
 * @property {string} originalMessage
 * @property {ApiResponse} apiResponse
 */

Client._allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
exports.default = Client;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;
exports.createResponse = createResponse;
exports.findHeaderName = findHeaderName;

var _Externals = __webpack_require__(4);

var _Utils = __webpack_require__(3);

var utils = _interopRequireWildcard(_Utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Creates a response
 * @param stringBody
 * @param init
 * @return {Response}
 */
function createResponse(stringBody, init) {

    init = init || {};

    var response = new _Externals.Response(stringBody, init);

    //TODO Wait for https://github.com/bitinn/node-fetch/issues/38
    if (utils.isNodeJS()) {

        response._text = stringBody;
        response._decode = function () {
            return this._text;
        };
    }

    return response;
}

function findHeaderName(name, headers) {
    name = name.toLowerCase();
    return Object.keys(headers).reduce(function (res, key) {
        if (res) return res;
        if (name == key.toLowerCase()) return key;
        return res;
    }, null);
}

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _Externals = __webpack_require__(4);

var _Utils = __webpack_require__(16);

var utils = _interopRequireWildcard(_Utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApiResponse = (function () {

    /**
     * @param {Request} request
     * @param {Response} response
     * @param {string} responseText
     */

    function ApiResponse(request, response, responseText) {
        _classCallCheck(this, ApiResponse);

        /** @type {Request} */
        this._request = request;

        /** @type {Response} */
        this._response = response;

        this._text = responseText;
        this._json = null;
        this._multipart = [];
    }

    /**
     * @return {Response}
     */

    ApiResponse.prototype.response = function response() {
        return this._response;
    };

    /**
     * @return {Request}
     */

    ApiResponse.prototype.request = function request() {
        return this._request;
    };

    /**
     * @return {boolean}
     */

    ApiResponse.prototype.ok = function ok() {
        return this._response && this._response.ok;
    };

    /**
     * @return {string}
     */

    ApiResponse.prototype.text = function text() {
        if (!this._isJson() && !this._isMultipart()) throw new Error('Response is not text');
        return this._text;
    };

    /**
     * @return {object}
     */

    ApiResponse.prototype.json = function json() {
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

    ApiResponse.prototype.error = function error(skipOKCheck) {

        if (this.ok() && !skipOKCheck) return null;

        var message = (this._response && this._response.status ? this._response.status + ' ' : '') + (this._response && this._response.statusText ? this._response.statusText : '');

        try {

            if (this.json().message) message = this.json().message;
            if (this.json().error_description) message = this.json().error_description;
            if (this.json().description) message = this.json().description;
        } catch (e) {}

        return message;
    };

    /**
     * @return {ApiResponse[]}
     */

    ApiResponse.prototype.multipart = function multipart() {

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

            var statusInfo = ApiResponse.create(parts.shift(), this._response.status, this._response.statusText).json();

            // Step 3. Parse all other parts

            this._multipart = parts.map(function (part, i) {

                var status = statusInfo.response[i].status;

                return ApiResponse.create(part, status);
            });
        }

        return this._multipart;
    };

    ApiResponse.prototype._isContentType = function _isContentType(contentType) {
        return this._getContentType().indexOf(contentType) > -1;
    };

    ApiResponse.prototype._getContentType = function _getContentType() {
        return this._response.headers.get(ApiResponse._contentType) || '';
    };

    ApiResponse.prototype._isMultipart = function _isMultipart() {
        return this._isContentType(ApiResponse._multipartContentType);
    };

    ApiResponse.prototype._isUrlEncoded = function _isUrlEncoded() {
        return this._isContentType(ApiResponse._urlencodedContentType);
    };

    ApiResponse.prototype._isJson = function _isJson() {
        return this._isContentType(ApiResponse._jsonContentType);
    };

    /**
     * Method is used to create ApiResponse object from string parts of multipart/mixed response
     * @param {string} [text]
     * @param {number} [status]
     * @param {string} [statusText]
     * @return {ApiResponse}
     */

    ApiResponse.create = function create(text, status, statusText) {

        text = text || '';
        status = status || 200;
        statusText = statusText || 'OK';

        text = text.replace(/\r/g, '');

        var headers = new _Externals.Headers(),
            headersAndBody = text.split(ApiResponse._bodySeparator),
            headersText = headersAndBody.length > 1 ? headersAndBody.shift() : '';

        text = headersAndBody.join(ApiResponse._bodySeparator);

        (headersText || '').split('\n').forEach(function (header) {

            var split = header.trim().split(ApiResponse._headerSeparator),
                key = split.shift().trim(),
                value = split.join(ApiResponse._headerSeparator).trim();

            if (key) headers.append(key, value);
        });

        return new ApiResponse(null, utils.createResponse(text, {
            headers: headers,
            status: status,
            statusText: statusText
        }), text);
    };

    return ApiResponse;
})();

ApiResponse._contentType = 'Content-Type';
ApiResponse._jsonContentType = 'application/json';
ApiResponse._multipartContentType = 'multipart/mixed';
ApiResponse._urlencodedContentType = 'application/x-www-form-urlencoded';
ApiResponse._headerSeparator = ':';
ApiResponse._bodySeparator = '\n\n';
ApiResponse._boundarySeparator = '--';
exports.default = ApiResponse;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _Registry = __webpack_require__(19);

var _Registry2 = _interopRequireDefault(_Registry);

var _Client = __webpack_require__(15);

var _Client2 = _interopRequireDefault(_Client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Client = (function (_HttpClient) {
    _inherits(Client, _HttpClient);

    function Client() {
        _classCallCheck(this, Client);

        var _this = _possibleConstructorReturn(this, _HttpClient.call(this));

        _this._registry = new _Registry2.default();
        return _this;
    }

    Client.prototype.registry = function registry() {
        return this._registry;
    };

    Client.prototype._loadResponse = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request) {
            var mock;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            mock = this._registry.find(request);
                            _context.next = 3;
                            return mock.getResponse(request);

                        case 3:
                            return _context.abrupt('return', _context.sent);

                        case 4:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        return function _loadResponse(_x) {
            return ref.apply(this, arguments);
        };
    })();

    return Client;
})(_Client2.default);

exports.default = Client;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _Mock = __webpack_require__(20);

var _Mock2 = _interopRequireDefault(_Mock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Registry = (function () {
    function Registry() {
        _classCallCheck(this, Registry);

        this._mocks = [];
    }

    Registry.prototype.add = function add(mock) {
        this._mocks.push(mock);
        return this;
    };

    Registry.prototype.clear = function clear() {
        this._mocks = [];
        return this;
    };

    Registry.prototype.find = function find(request) {

        //console.log('Registry is looking for', request);

        var mock = this._mocks.shift();

        if (!mock) throw new Error('No mock in registry for request ' + request.method + ' ' + request.url);

        if (!mock.test(request)) throw new Error('Wrong request ' + request.method + ' ' + request.url + ' for expected mock ' + mock.method() + ' ' + mock.path());

        return mock;
    };

    Registry.prototype.apiCall = function apiCall(method, path, response, status, statusText) {

        this.add(new _Mock2.default(method, path, response, status, statusText));

        return this;
    };

    Registry.prototype.authentication = function authentication() {

        this.apiCall('POST', '/restapi/oauth/token', {
            'access_token': 'ACCESS_TOKEN',
            'token_type': 'bearer',
            'expires_in': 3600,
            'refresh_token': 'REFRESH_TOKEN',
            'refresh_token_expires_in': 60480,
            'scope': 'SMS RCM Foo Boo',
            'expireTime': new Date().getTime() + 3600000
        });

        return this;
    };

    Registry.prototype.logout = function logout() {

        this.apiCall('POST', '/restapi/oauth/revoke', {});

        return this;
    };

    Registry.prototype.presenceLoad = function presenceLoad(id) {

        this.apiCall('GET', '/restapi/v1.0/account/~/extension/' + id + '/presence', {
            "uri": "https://platform.ringcentral.com/restapi/v1.0/account/123/extension/" + id + "/presence",
            "extension": {
                "uri": "https://platform.ringcentral.com/restapi/v1.0/account/123/extension/" + id,
                "id": id,
                "extensionNumber": "101"
            },
            "activeCalls": [],
            "presenceStatus": "Available",
            "telephonyStatus": "Ringing",
            "userStatus": "Available",
            "dndStatus": "TakeAllCalls",
            "extensionId": id
        });

        return this;
    };

    Registry.prototype.subscribeGeneric = function subscribeGeneric(expiresIn) {

        expiresIn = expiresIn || 15 * 60 * 60;

        var date = new Date();

        this.apiCall('POST', '/restapi/v1.0/subscription', {
            'eventFilters': ['/restapi/v1.0/account/~/extension/~/presence'],
            'expirationTime': new Date(date.getTime() + expiresIn * 1000).toISOString(),
            'expiresIn': expiresIn,
            'deliveryMode': {
                'transportType': 'PubNub',
                'encryption': false,
                'address': '123_foo',
                'subscriberKey': 'sub-c-foo',
                'secretKey': 'sec-c-bar'
            },
            'id': 'foo-bar-baz',
            'creationTime': date.toISOString(),
            'status': 'Active',
            'uri': 'https://platform.ringcentral.com/restapi/v1.0/subscription/foo-bar-baz'
        });

        return this;
    };

    Registry.prototype.subscribeOnPresence = function subscribeOnPresence(id, detailed) {

        id = id || '1';

        var date = new Date();

        this.apiCall('POST', '/restapi/v1.0/subscription', {
            'eventFilters': ['/restapi/v1.0/account/~/extension/' + id + '/presence' + (detailed ? '?detailedTelephonyState=true' : '')],
            'expirationTime': new Date(date.getTime() + 15 * 60 * 60 * 1000).toISOString(),
            'deliveryMode': {
                'transportType': 'PubNub',
                'encryption': true,
                'address': '123_foo',
                'subscriberKey': 'sub-c-foo',
                'secretKey': 'sec-c-bar',
                'encryptionAlgorithm': 'AES',
                'encryptionKey': 'VQwb6EVNcQPBhE/JgFZ2zw=='
            },
            'creationTime': date.toISOString(),
            'id': 'foo-bar-baz',
            'status': 'Active',
            'uri': 'https://platform.ringcentral.com/restapi/v1.0/subscription/foo-bar-baz'
        });

        return this;
    };

    Registry.prototype.tokenRefresh = function tokenRefresh(failure) {

        if (!failure) {

            this.apiCall('POST', '/restapi/oauth/token', {
                'access_token': 'ACCESS_TOKEN_FROM_REFRESH',
                'token_type': 'bearer',
                'expires_in': 3600,
                'refresh_token': 'REFRESH_TOKEN_FROM_REFRESH',
                'refresh_token_expires_in': 60480,
                'scope': 'SMS RCM Foo Boo'
            });
        } else {

            this.apiCall('POST', '/restapi/oauth/token', {
                'message': 'Wrong token',
                'error_description': 'Wrong token',
                'description': 'Wrong token'
            }, 400);
        }

        return this;
    };

    return Registry;
})();

exports.default = Registry;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _ApiResponse = __webpack_require__(17);

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _Utils = __webpack_require__(3);

var _Utils2 = __webpack_require__(16);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mock = (function () {
    function Mock(method, path, json, status, statusText, delay) {
        _classCallCheck(this, Mock);

        this._method = method.toUpperCase();
        this._path = path;
        this._json = json || {};
        this._delay = delay || 10;
        this._status = status || 200;
        this._statusText = statusText || 'OK';
    }

    Mock.prototype.path = function path() {
        return this._path;
    };

    Mock.prototype.method = function method() {
        return this._method;
    };

    Mock.prototype.test = function test(request) {

        return request.url.indexOf(this._path) > -1 && request.method.toUpperCase() == this._method;
    };

    Mock.prototype.getResponse = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return (0, _Utils.delay)(this._delay);

                        case 2:
                            return _context.abrupt('return', this.createResponse(this._json));

                        case 3:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        return function getResponse(_x) {
            return ref.apply(this, arguments);
        };
    })();

    Mock.prototype.createResponse = function createResponse(json, init) {

        init = init || {};

        init.status = init.status || this._status;
        init.statusText = init.statusText || this._statusText;

        var str = JSON.stringify(json),
            res = (0, _Utils2.createResponse)(str, init);

        res.headers.set(_ApiResponse2.default._contentType, _ApiResponse2.default._jsonContentType);

        return res;
    };

    return Mock;
})();

exports.default = Mock;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _Observable2 = __webpack_require__(13);

var _Observable3 = _interopRequireDefault(_Observable2);

var _Queue = __webpack_require__(14);

var _Queue2 = _interopRequireDefault(_Queue);

var _Auth = __webpack_require__(22);

var _Auth2 = _interopRequireDefault(_Auth);

var _Externals = __webpack_require__(4);

var _Utils = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _Externals.Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { _Externals.Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Platform = (function (_Observable) {
    _inherits(Platform, _Observable);

    // 10 hours

    function Platform(client, cache, server, appKey, appSecret) {
        _classCallCheck(this, Platform);

        var _this = _possibleConstructorReturn(this, _Observable.call(this));

        _this.events = {
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

        _this._server = server;
        _this._appKey = appKey;
        _this._appSecret = appSecret;

        /** @type {Cache} */
        _this._cache = cache;

        /** @type {Client} */
        _this._client = client;

        _this._queue = new _Queue2.default(_this._cache, Platform._cacheId + '-refresh');

        _this._auth = new _Auth2.default(_this._cache, Platform._cacheId);

        return _this;
    }

    /**
     * @return {Auth}
     */
    // 1 week
    // Platform server by default sets it to 60 * 60 = 1 hour

    Platform.prototype.auth = function auth() {
        return this._auth;
    };

    /**
     * @return {Client}
     */

    Platform.prototype.client = function client() {
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

    Platform.prototype.createUrl = function createUrl(path, options) {

        path = path || '';
        options = options || {};

        var builtUrl = '',
            hasHttp = path.indexOf('http://') != -1 || path.indexOf('https://') != -1;

        if (options.addServer && !hasHttp) builtUrl += this._server;

        if (path.indexOf(Platform._urlPrefix) == -1 && !hasHttp) builtUrl += Platform._urlPrefix + '/' + Platform._apiVersion;

        builtUrl += path;

        if (options.addMethod || options.addToken) builtUrl += path.indexOf('?') > -1 ? '&' : '?';

        if (options.addMethod) builtUrl += '_method=' + options.addMethod;
        if (options.addToken) builtUrl += (options.addMethod ? '&' : '') + 'access_token=' + this._auth.accessToken();

        return builtUrl;
    };

    /**
     * @param {string} options.redirectUri
     * @param {string} options.state
     * @param {string} options.brandId
     * @param {string} options.display
     * @param {string} options.prompt
     * @return {string}
     */

    Platform.prototype.authUrl = function authUrl(options) {

        options = options || {};

        return this.createUrl(Platform._authorizeEndpoint + '?' + (0, _Utils.queryStringify)({
            'response_type': 'code',
            'redirect_uri': options.redirectUri || '',
            'client_id': this._appKey,
            'state': options.state || '',
            'brand_id': options.brandId || '',
            'display': options.display || '',
            'prompt': options.prompt || ''
        }), { addServer: true });
    };

    /**
     * @param {string} url
     * @return {Object}
     */

    Platform.prototype.parseAuthRedirectUrl = function parseAuthRedirectUrl(url) {

        var qs = (0, _Utils.parseQueryString)(url.split('?').reverse()[0]),
            error = qs.error_description || qs.error;

        if (error) {
            var e = new Error(error);
            e.error = qs.error;
            throw e;
        }

        return qs;
    };

    /**
     * @return {Promise<boolean>}
     */

    Platform.prototype.loggedIn = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return this._ensureAuthentication();

                        case 3:
                            return _context.abrupt('return', true);

                        case 6:
                            _context.prev = 6;
                            _context.t0 = _context['catch'](0);
                            return _context.abrupt('return', false);

                        case 9:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 6]]);
        }));

        return function loggedIn() {
            return ref.apply(this, arguments);
        };
    })();

    /**
     * @param {string} options.username
     * @param {string} options.password
     * @param {string} options.extension
     * @param {string} options.code
     * @param {string} options.redirectUri
     * @param {string} options.endpointId
     * @returns {Promise<ApiResponse>}
     */

    Platform.prototype.login = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(options) {
            var body, apiResponse, json;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;

                            options = options || {};

                            options.remember = options.remember || false;

                            this.emit(this.events.beforeLogin);

                            body = {
                                "access_token_ttl": Platform._accessTokenTtl,
                                "refresh_token_ttl": options.remember ? Platform._refreshTokenTtlRemember : Platform._refreshTokenTtl
                            };

                            if (!options.code) {

                                body.grant_type = 'password';
                                body.username = options.username;
                                body.password = options.password;
                                body.extension = options.extension || '';
                            } else if (options.code) {

                                body.grant_type = 'authorization_code';
                                body.code = options.code;
                                body.redirect_uri = options.redirectUri;
                                //body.client_id = this.getCredentials().key; // not needed
                            }

                            if (options.endpointId) body.endpoint_id = options.endpointId;

                            _context2.next = 9;
                            return this._tokenRequest(Platform._tokenEndpoint, body);

                        case 9:
                            apiResponse = _context2.sent;
                            json = apiResponse.json();

                            this._auth.setData(json).setRemember(options.remember);

                            this.emit(this.events.loginSuccess, apiResponse);

                            return _context2.abrupt('return', apiResponse);

                        case 16:
                            _context2.prev = 16;
                            _context2.t0 = _context2['catch'](0);

                            this._cache.clean();

                            this.emit(this.events.loginError, _context2.t0);

                            throw _context2.t0;

                        case 21:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[0, 16]]);
        }));

        return function login(_x) {
            return ref.apply(this, arguments);
        };
    })();

    /**
     * @returns {Promise<ApiResponse>}
     */

    Platform.prototype.refresh = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var res, json;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;

                            this.emit(this.events.beforeRefresh);

                            if (!this._queue.isPaused()) {
                                _context3.next = 9;
                                break;
                            }

                            _context3.next = 5;
                            return this._queue.poll();

                        case 5:
                            if (this._isAccessTokenValid()) {
                                _context3.next = 7;
                                break;
                            }

                            throw new Error('Automatic authentification timeout');

                        case 7:

                            this.emit(this.events.refreshSuccess, null);

                            return _context3.abrupt('return', null);

                        case 9:

                            this._queue.pause();

                            // Make sure all existing AJAX calls had a chance to reach the server
                            _context3.next = 12;
                            return (0, _Utils.delay)(Platform._refreshDelayMs);

                        case 12:
                            if (this._auth.refreshToken()) {
                                _context3.next = 14;
                                break;
                            }

                            throw new Error('Refresh token is missing');

                        case 14:
                            if (this._auth.refreshTokenValid()) {
                                _context3.next = 16;
                                break;
                            }

                            throw new Error('Refresh token has expired');

                        case 16:
                            if (this._queue.isPaused()) {
                                _context3.next = 18;
                                break;
                            }

                            throw new Error('Queue was resumed before refresh call');

                        case 18:
                            _context3.next = 20;
                            return this._tokenRequest(Platform._tokenEndpoint, {
                                "grant_type": "refresh_token",
                                "refresh_token": this._auth.refreshToken(),
                                "access_token_ttl": Platform._accessTokenTtl,
                                "refresh_token_ttl": this._auth.remember() ? Platform._refreshTokenTtlRemember : Platform._refreshTokenTtl
                            });

                        case 20:
                            res = _context3.sent;
                            json = res.json();

                            if (json.access_token) {
                                _context3.next = 24;
                                break;
                            }

                            throw this._client.makeError(new Error('Malformed OAuth response'), res);

                        case 24:

                            this._auth.setData(json);
                            this._queue.resume();

                            this.emit(this.events.refreshSuccess, res);

                            return _context3.abrupt('return', res);

                        case 30:
                            _context3.prev = 30;
                            _context3.t0 = _context3['catch'](0);

                            _context3.t0 = this._client.makeError(_context3.t0);

                            if (Platform._clearCacheOnRefreshError) {
                                this._cache.clean();
                            }

                            this.emit(this.events.refreshError, _context3.t0);

                            throw _context3.t0;

                        case 36:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this, [[0, 30]]);
        }));

        return function refresh() {
            return ref.apply(this, arguments);
        };
    })();

    /**
     * @returns {Promise<ApiResponse>}
     */

    Platform.prototype.logout = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
            var res;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;

                            this.emit(this.events.beforeLogout);

                            this._queue.pause();

                            _context4.next = 5;
                            return this._tokenRequest(Platform._revokeEndpoint, {
                                token: this._auth.accessToken()
                            });

                        case 5:
                            res = _context4.sent;

                            this._queue.resume();
                            this._cache.clean();

                            this.emit(this.events.logoutSuccess, res);

                            return _context4.abrupt('return', res);

                        case 12:
                            _context4.prev = 12;
                            _context4.t0 = _context4['catch'](0);

                            this._queue.resume();

                            this.emit(this.events.logoutError, _context4.t0);

                            throw _context4.t0;

                        case 17:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this, [[0, 12]]);
        }));

        return function logout() {
            return ref.apply(this, arguments);
        };
    })();

    /**
     * @param {Request} request
     * @param {object} [options]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<Request>}
     */

    Platform.prototype.inflateRequest = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(request, options) {
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:

                            options = options || {};

                            if (!options.skipAuthCheck) {
                                _context5.next = 3;
                                break;
                            }

                            return _context5.abrupt('return', request);

                        case 3:
                            _context5.next = 5;
                            return this._ensureAuthentication();

                        case 5:

                            request.headers.set('Authorization', this._authHeader());
                            //request.url = this.createUrl(request.url, {addServer: true}); //FIXME Spec prevents this...

                            //TODO Add User-Agent here

                            return _context5.abrupt('return', request);

                        case 7:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        return function inflateRequest(_x2, _x3) {
            return ref.apply(this, arguments);
        };
    })();

    /**
     * @param {Request} request
     * @param {object} [options]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */

    Platform.prototype.sendRequest = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(request, options) {
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.prev = 0;
                            _context6.next = 3;
                            return this.inflateRequest(request, options);

                        case 3:
                            request = _context6.sent;
                            _context6.next = 6;
                            return this._client.sendRequest(request);

                        case 6:
                            return _context6.abrupt('return', _context6.sent);

                        case 9:
                            _context6.prev = 9;
                            _context6.t0 = _context6['catch'](0);

                            if (!(!_context6.t0.apiResponse || !_context6.t0.apiResponse.response() || _context6.t0.apiResponse.response().status != 401)) {
                                _context6.next = 13;
                                break;
                            }

                            throw _context6.t0;

                        case 13:

                            this._auth.cancelAccessToken();

                            _context6.next = 16;
                            return this.sendRequest(request, options);

                        case 16:
                            return _context6.abrupt('return', _context6.sent);

                        case 17:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, this, [[0, 9]]);
        }));

        return function sendRequest(_x4, _x5) {
            return ref.apply(this, arguments);
        };
    })();

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

    Platform.prototype.send = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
            var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:

                            //FIXME https://github.com/bitinn/node-fetch/issues/43
                            options.url = this.createUrl(options.url, { addServer: true });

                            _context7.next = 3;
                            return this.sendRequest(this._client.createRequest(options), options);

                        case 3:
                            return _context7.abrupt('return', _context7.sent);

                        case 4:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, this);
        }));

        return function send(_x6) {
            return ref.apply(this, arguments);
        };
    })();

    /**
     * @param {string} url
     * @param {object} [query]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */

    Platform.prototype.get = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(url, query, options) {
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            options = options || {};
                            options.method = 'GET';
                            options.url = url;
                            options.query = query;
                            _context8.next = 6;
                            return this.send(options);

                        case 6:
                            return _context8.abrupt('return', _context8.sent);

                        case 7:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, _callee8, this);
        }));

        return function get(_x8, _x9, _x10) {
            return ref.apply(this, arguments);
        };
    })();

    /**
     * @param {string} url
     * @param {object} body
     * @param {object} [query]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */

    Platform.prototype.post = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(url, body, query, options) {
            return regeneratorRuntime.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            options = options || {};
                            options.method = 'POST';
                            options.url = url;
                            options.query = query;
                            options.body = body;
                            _context9.next = 7;
                            return this.send(options);

                        case 7:
                            return _context9.abrupt('return', _context9.sent);

                        case 8:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, _callee9, this);
        }));

        return function post(_x11, _x12, _x13, _x14) {
            return ref.apply(this, arguments);
        };
    })();

    /**
     * @param {string} url
     * @param {object} [body]
     * @param {object} [query]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */

    Platform.prototype.put = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(url, body, query, options) {
            return regeneratorRuntime.wrap(function _callee10$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            options = options || {};
                            options.method = 'PUT';
                            options.url = url;
                            options.query = query;
                            options.body = body;
                            _context10.next = 7;
                            return this.send(options);

                        case 7:
                            return _context10.abrupt('return', _context10.sent);

                        case 8:
                        case 'end':
                            return _context10.stop();
                    }
                }
            }, _callee10, this);
        }));

        return function put(_x15, _x16, _x17, _x18) {
            return ref.apply(this, arguments);
        };
    })();

    /**
     * @param {string} url
     * @param {string} [query]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */

    Platform.prototype['delete'] = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(url, query, options) {
            return regeneratorRuntime.wrap(function _callee11$(_context11) {
                while (1) {
                    switch (_context11.prev = _context11.next) {
                        case 0:
                            options = options || {};
                            options.method = 'DELETE';
                            options.url = url;
                            options.query = query;
                            _context11.next = 6;
                            return this.send(options);

                        case 6:
                            return _context11.abrupt('return', _context11.sent);

                        case 7:
                        case 'end':
                            return _context11.stop();
                    }
                }
            }, _callee11, this);
        }));

        return function _delete(_x19, _x20, _x21) {
            return ref.apply(this, arguments);
        };
    })();

    Platform.prototype._tokenRequest = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee12(path, body) {
            return regeneratorRuntime.wrap(function _callee12$(_context12) {
                while (1) {
                    switch (_context12.prev = _context12.next) {
                        case 0:
                            _context12.next = 2;
                            return this.send({
                                url: path,
                                skipAuthCheck: true,
                                body: body,
                                method: 'POST',
                                headers: {
                                    'Authorization': 'Basic ' + this._apiKey(),
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            });

                        case 2:
                            return _context12.abrupt('return', _context12.sent);

                        case 3:
                        case 'end':
                            return _context12.stop();
                    }
                }
            }, _callee12, this);
        }));

        return function _tokenRequest(_x22, _x23) {
            return ref.apply(this, arguments);
        };
    })();

    Platform.prototype._ensureAuthentication = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee13() {
            return regeneratorRuntime.wrap(function _callee13$(_context13) {
                while (1) {
                    switch (_context13.prev = _context13.next) {
                        case 0:
                            if (!this._isAccessTokenValid()) {
                                _context13.next = 2;
                                break;
                            }

                            return _context13.abrupt('return', null);

                        case 2:
                            _context13.next = 4;
                            return this.refresh();

                        case 4:
                            return _context13.abrupt('return', _context13.sent);

                        case 5:
                        case 'end':
                            return _context13.stop();
                    }
                }
            }, _callee13, this);
        }));

        return function _ensureAuthentication() {
            return ref.apply(this, arguments);
        };
    })();

    Platform.prototype._isAccessTokenValid = function _isAccessTokenValid() {

        return this._auth.accessTokenValid() && !this._queue.isPaused();
    };

    Platform.prototype._apiKey = function _apiKey() {
        var apiKey = this._appKey + ':' + this._appSecret;
        return typeof btoa == 'function' ? btoa(apiKey) : new Buffer(apiKey).toString('base64');
    };

    Platform.prototype._authHeader = function _authHeader() {
        var token = this._auth.accessToken();
        return this._auth.tokenType() + (token ? ' ' + token : '');
    };

    return Platform;
})(_Observable3.default);

Platform._urlPrefix = '/restapi';
Platform._apiVersion = 'v1.0';
Platform._accessTokenTtl = null;
Platform._refreshTokenTtl = 10 * 60 * 60;
Platform._refreshTokenTtlRemember = 7 * 24 * 60 * 60;
Platform._tokenEndpoint = '/restapi/oauth/token';
Platform._revokeEndpoint = '/restapi/oauth/revoke';
Platform._authorizeEndpoint = '/restapi/oauth/authorize';
Platform._refreshDelayMs = 100;
Platform._cacheId = 'platform';
Platform._clearCacheOnRefreshError = true;
exports.default = Platform;

/***/ },
/* 22 */
/***/ function(module, exports) {

'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Auth = (function () {
    function Auth(cache, cacheId) {
        _classCallCheck(this, Auth);

        /** @type {Cache} */
        this._cache = cache;
        this._cacheId = cacheId;
    } // 1 minute

    Auth.prototype.accessToken = function accessToken() {
        return this.data().access_token;
    };

    Auth.prototype.refreshToken = function refreshToken() {
        return this.data().refresh_token;
    };

    Auth.prototype.tokenType = function tokenType() {
        return this.data().token_type;
    };

    /**
     * @return {{token_type: string, access_token: string, expires_in: number, refresh_token: string, refresh_token_expires_in: number}}
     */

    Auth.prototype.data = function data() {

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

    Auth.prototype.setData = function setData(newData) {

        newData = newData || {};

        var data = this.data();

        Object.keys(newData).forEach(function (key) {
            data[key] = newData[key];
        });

        data.expire_time = Date.now() + data.expires_in * 1000;
        data.refresh_token_expire_time = Date.now() + data.refresh_token_expires_in * 1000;

        this._cache.setItem(this._cacheId, data);

        return this;
    };

    /**
     * Check if there is a valid (not expired) access token
     * @return {boolean}
     */

    Auth.prototype.accessTokenValid = function accessTokenValid() {

        var authData = this.data();
        return authData.token_type === Auth.forcedTokenType || authData.expire_time - Auth.refreshHandicapMs > Date.now();
    };

    /**
     * Check if there is a valid (not expired) access token
     * @return {boolean}
     */

    Auth.prototype.refreshTokenValid = function refreshTokenValid() {

        return this.data().refresh_token_expire_time > Date.now();
    };

    /**
     * @return {Auth}
     */

    Auth.prototype.cancelAccessToken = function cancelAccessToken() {

        return this.setData({
            access_token: '',
            expires_in: 0
        });
    };

    /**
     * This method sets a special authentication mode used in Service Web
     * @return {Auth}
     */

    Auth.prototype.forceAuthentication = function forceAuthentication() {

        this.setData({
            token_type: Auth.forcedTokenType,
            access_token: '',
            expires_in: 0,
            refresh_token: '',
            refresh_token_expires_in: 0
        });

        return this;
    };

    /**
     * @param remember
     * @return {Auth}
     */

    Auth.prototype.setRemember = function setRemember(remember) {

        return this.setData({ remember: remember });
    };

    /**
     * @return {boolean}
     */

    Auth.prototype.remember = function remember() {

        return !!this.data().remember;
    };

    return Auth;
})();

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

Auth.refreshHandicapMs = 60 * 1000;
Auth.forcedTokenType = 'forced';
exports.default = Auth;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _PubnubMock = __webpack_require__(24);

var _PubnubMock2 = _interopRequireDefault(_PubnubMock);

var _Externals = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PubnubMockFactory = (function () {
    function PubnubMockFactory() {
        _classCallCheck(this, PubnubMockFactory);

        this.crypto_obj = _Externals.PUBNUB.crypto_obj;
    }

    PubnubMockFactory.prototype.init = function init(options) {
        return new _PubnubMock2.default(options);
    };

    return PubnubMockFactory;
})();

exports.default = PubnubMockFactory;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _Observable2 = __webpack_require__(13);

var _Observable3 = _interopRequireDefault(_Observable2);

var _Externals = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PubnubMock = (function (_Observable) {
    _inherits(PubnubMock, _Observable);

    function PubnubMock(options) {
        _classCallCheck(this, PubnubMock);

        var _this = _possibleConstructorReturn(this, _Observable.call(this));

        _this.options = options;
        _this.crypto_obj = _Externals.PUBNUB.crypto_obj;
        return _this;
    }

    PubnubMock.prototype.ready = function ready() {};

    PubnubMock.prototype.subscribe = function subscribe(options) {
        this.on('message-' + options.channel, options.message);
    };

    PubnubMock.prototype.unsubscribe = function unsubscribe(options) {
        this.off('message-' + options.channel);
    };

    PubnubMock.prototype.receiveMessage = function receiveMessage(msg, channel) {
        this.emit('message-' + channel, msg, 'env', channel);
    };

    return PubnubMock;
})(_Observable3.default);

exports.default = PubnubMock;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

exports.__esModule = true;

var _Observable2 = __webpack_require__(13);

var _Observable3 = _interopRequireDefault(_Observable2);

var _Client = __webpack_require__(15);

var _Client2 = _interopRequireDefault(_Client);

var _Utils = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Subscription = (function (_Observable) {
    _inherits(Subscription, _Observable);

    function Subscription(pubnubFactory, platform) {
        _classCallCheck(this, Subscription);

        var _this = _possibleConstructorReturn(this, _Observable.call(this));

        _this.events = {
            notification: 'notification',
            removeSuccess: 'removeSuccess',
            removeError: 'removeError',
            renewSuccess: 'renewSuccess',
            renewError: 'renewError',
            subscribeSuccess: 'subscribeSuccess',
            subscribeError: 'subscribeError'
        };

        _this._pubnubFactory = pubnubFactory;
        _this._platform = platform;
        _this._pubnub = null;
        _this._timeout = null;
        _this._subscription = {};

        return _this;
    }

    Subscription.prototype.subscribed = function subscribed() {

        return !!(this._subscription.id && this._subscription.deliveryMode && this._subscription.deliveryMode.subscriberKey && this._subscription.deliveryMode.address);
    };

    /**
     * @return {boolean}
     */

    Subscription.prototype.alive = function alive() {
        return this.subscribed() && Date.now() < this.expirationTime();
    };

    Subscription.prototype.expirationTime = function expirationTime() {
        return new Date(this._subscription.expirationTime || 0).getTime() - Subscription._renewHandicapMs;
    };

    Subscription.prototype.setSubscription = function setSubscription(subscription) {

        subscription = subscription || {};

        this._clearTimeout();

        this._subscription = subscription;

        if (!this._pubnub) this._subscribeAtPubnub();

        this._setTimeout();

        return this;
    };

    Subscription.prototype.subscription = function subscription() {
        return this._subscription;
    };

    /**
     * Creates or updates subscription if there is an active one
     * @returns {Promise<ApiResponse>}
     */

    Subscription.prototype.register = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!this.alive()) {
                                _context.next = 6;
                                break;
                            }

                            _context.next = 3;
                            return this.renew();

                        case 3:
                            return _context.abrupt('return', _context.sent);

                        case 6:
                            _context.next = 8;
                            return this.subscribe();

                        case 8:
                            return _context.abrupt('return', _context.sent);

                        case 9:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        return function register() {
            return ref.apply(this, arguments);
        };
    })();

    Subscription.prototype.eventFilters = function eventFilters() {
        return this._subscription.eventFilters || [];
    };

    /**
     * @param {string[]} events
     * @return {Subscription}
     */

    Subscription.prototype.addEventFilters = function addEventFilters(events) {
        this.setEventFilters(this.eventFilters().concat(events));
        return this;
    };

    /**
     * @param {string[]} events
     * @return {Subscription}
     */

    Subscription.prototype.setEventFilters = function setEventFilters(events) {
        this._subscription.eventFilters = events;
        return this;
    };

    /**
     * @returns {Promise<ApiResponse>}
     */

    Subscription.prototype.subscribe = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
            var response, json;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;

                            this._clearTimeout();

                            if (this.eventFilters().length) {
                                _context2.next = 4;
                                break;
                            }

                            throw new Error('Events are undefined');

                        case 4:
                            _context2.next = 6;
                            return this._platform.post('/restapi/v1.0/subscription', {
                                eventFilters: this._getFullEventFilters(),
                                deliveryMode: {
                                    transportType: 'PubNub'
                                }
                            });

                        case 6:
                            response = _context2.sent;
                            json = response.json();

                            this.setSubscription(json).emit(this.events.subscribeSuccess, response);

                            return _context2.abrupt('return', response);

                        case 12:
                            _context2.prev = 12;
                            _context2.t0 = _context2['catch'](0);

                            _context2.t0 = this._platform.client().makeError(_context2.t0);

                            this.reset().emit(this.events.subscribeError, _context2.t0);

                            throw _context2.t0;

                        case 17:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this, [[0, 12]]);
        }));

        return function subscribe() {
            return ref.apply(this, arguments);
        };
    })();

    /**
     * @returns {Promise<ApiResponse>}
     */

    Subscription.prototype.renew = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
            var response, json;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;

                            this._clearTimeout();

                            if (this.subscribed()) {
                                _context3.next = 4;
                                break;
                            }

                            throw new Error('No subscription');

                        case 4:
                            if (this.eventFilters().length) {
                                _context3.next = 6;
                                break;
                            }

                            throw new Error('Events are undefined');

                        case 6:
                            _context3.next = 8;
                            return this._platform.put('/restapi/v1.0/subscription/' + this._subscription.id, {
                                eventFilters: this._getFullEventFilters()
                            });

                        case 8:
                            response = _context3.sent;
                            json = response.json();

                            this.setSubscription(json).emit(this.events.renewSuccess, response);

                            return _context3.abrupt('return', response);

                        case 14:
                            _context3.prev = 14;
                            _context3.t0 = _context3['catch'](0);

                            _context3.t0 = this._platform.client().makeError(_context3.t0);

                            this.reset().emit(this.events.renewError, _context3.t0);

                            throw _context3.t0;

                        case 19:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this, [[0, 14]]);
        }));

        return function renew() {
            return ref.apply(this, arguments);
        };
    })();

    /**
     * @returns {Promise<ApiResponse>}
     */

    Subscription.prototype.remove = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
            var response;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;

                            if (this.subscribed()) {
                                _context4.next = 3;
                                break;
                            }

                            throw new Error('No subscription');

                        case 3:
                            _context4.next = 5;
                            return this._platform.delete('/restapi/v1.0/subscription/' + this._subscription.id);

                        case 5:
                            response = _context4.sent;

                            this.reset().emit(this.events.removeSuccess, response);

                            return _context4.abrupt('return', response);

                        case 10:
                            _context4.prev = 10;
                            _context4.t0 = _context4['catch'](0);

                            _context4.t0 = this._platform.client().makeError(_context4.t0);

                            this.emit(this.events.removeError, _context4.t0);

                            throw _context4.t0;

                        case 15:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this, [[0, 10]]);
        }));

        return function remove() {
            return ref.apply(this, arguments);
        };
    })();

    /**
     * @returns {Promise<ApiResponse>}
     */

    Subscription.prototype.resubscribe = function resubscribe() {

        return this.reset().setEventFilters(this.eventFilters()).subscribe();
    };

    /**
     * Remove subscription and disconnect from PUBNUB
     * This method resets subscription at client side but backend is not notified
     */

    Subscription.prototype.reset = function reset() {
        this._clearTimeout();
        if (this.subscribed() && this._pubnub) this._pubnub.unsubscribe({ channel: this._subscription.deliveryMode.address });
        this._subscription = {};
        return this;
    };

    Subscription.prototype._getFullEventFilters = function _getFullEventFilters() {
        var _this2 = this;

        return this.eventFilters().map(function (event) {
            return _this2._platform.createUrl(event);
        });
    };

    Subscription.prototype._setTimeout = function _setTimeout() {
        var _this3 = this;

        this._clearTimeout();

        if (!this.alive()) throw new Error('Subscription is not alive');

        (0, _Utils.poll)(function (next) {

            if (_this3.alive()) return next();

            _this3.renew();
        }, Subscription._pollInterval, this._timeout);

        return this;
    };

    Subscription.prototype._clearTimeout = function _clearTimeout() {

        (0, _Utils.stopPolling)(this._timeout);

        return this;
    };

    Subscription.prototype._decrypt = function _decrypt(message) {

        if (!this.subscribed()) throw new Error('No subscription');

        if (this._subscription.deliveryMode.encryptionKey) {

            var PUBNUB = this._pubnubFactory;

            message = PUBNUB.crypto_obj.decrypt(message, this._subscription.deliveryMode.encryptionKey, {
                encryptKey: false,
                keyEncoding: 'base64',
                keyLength: 128,
                mode: 'ecb'
            });
        }

        return message;
    };

    Subscription.prototype._notify = function _notify(message) {

        this.emit(this.events.notification, this._decrypt(message));

        return this;
    };

    Subscription.prototype._subscribeAtPubnub = function _subscribeAtPubnub() {

        if (!this.alive()) throw new Error('Subscription is not alive');

        var PUBNUB = this._pubnubFactory;

        this._pubnub = PUBNUB.init({
            ssl: true,
            subscribe_key: this._subscription.deliveryMode.subscriberKey
        });

        this._pubnub.ready();

        this._pubnub.subscribe({
            channel: this._subscription.deliveryMode.address,
            message: this._notify.bind(this),
            connect: function connect() {}
        });

        return this;
    };

    return Subscription;
})(_Observable3.default);

//export interface ISubscription {
//    id?:string;
//    uri?: string;
//    eventFilters?:string[];
//    expirationTime?:string; // 2014-03-12T19:54:35.613Z
//    expiresIn?:number;
//    deliveryMode?: {
//        transportType?:string;
//        encryption?:boolean;
//        address?:string;
//        subscriberKey?:string;
//        encryptionKey?:string;
//        secretKey?:string;
//    };
//    creationTime?:string; // 2014-03-12T19:54:35.613Z
//    status?:string; // Active
//}

Subscription._renewHandicapMs = 2 * 60 * 1000;
Subscription._pollInterval = 10 * 1000;
exports.default = Subscription;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.__esModule = true;

var _Subscription2 = __webpack_require__(25);

var _Subscription3 = _interopRequireDefault(_Subscription2);

var _Queue = __webpack_require__(14);

var _Queue2 = _interopRequireDefault(_Queue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CachedSubscription = (function (_Subscription) {
    _inherits(CachedSubscription, _Subscription);

    function CachedSubscription(pubnubFactory, platform, cache, cacheKey) {
        _classCallCheck(this, CachedSubscription);

        var _this = _possibleConstructorReturn(this, _Subscription.call(this, pubnubFactory, platform));

        _this._cache = cache;
        _this._cacheKey = cacheKey;
        _this._renewQueue = new _Queue2.default(_this._cache, cacheKey + '-renew');
        _this._resubscribeQueue = new _Queue2.default(_this._cache, cacheKey + '-resubscribe');

        _this.events = _extends({}, _this.events, {
            queuedRenewSuccess: 'queuedRenewSuccess',
            queuedRenewError: 'queuedRenewError',
            queuedResubscribeSuccess: 'queuedResubscribeSuccess',
            queuedResubscribeError: 'queuedResubscribeError'
        });

        _this.on(_this.events.renewError, function () {
            _this.resubscribe();
        });

        _this.on([_this.events.subscribeSuccess, _this.events.renewSuccess], function () {
            _this._cache.setItem(_this._cacheKey, _this.subscription());
        });

        _this.on(_this.events.removeSuccess, function () {
            _this._cache.removeItem(_this._cacheKey);
        });

        return _this;
    }

    /**
     * TODO Combine with Platform.refresh and move elsewhere
     * @param actionCb
     * @param queue
     * @param successEvent
     * @param errorEvent
     * @param errorMessage
     * @return {*}
     * @private
     */

    CachedSubscription.prototype._queue = (function () {
        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(actionCb, queue, successEvent, errorEvent, errorMessage) {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            if (!queue.isPaused()) {
                                _context.next = 8;
                                break;
                            }

                            _context.next = 4;
                            return queue.poll();

                        case 4:
                            if (this.alive()) {
                                _context.next = 6;
                                break;
                            }

                            throw new Error(errorMessage);

                        case 6:

                            this.emit(successEvent, null);

                            return _context.abrupt('return', null);

                        case 8:

                            queue.pause();

                            _context.next = 11;
                            return actionCb.call(this);

                        case 11:
                            res = _context.sent;

                            queue.resume();

                            this.emit(successEvent, res);

                            return _context.abrupt('return', res);

                        case 17:
                            _context.prev = 17;
                            _context.t0 = _context['catch'](0);

                            this.emit(errorEvent, _context.t0);

                            throw _context.t0;

                        case 21:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 17]]);
        }));

        return function _queue(_x, _x2, _x3, _x4, _x5) {
            return ref.apply(this, arguments);
        };
    })();

    /**
     * @returns {Promise<ApiResponse>}
     */

    CachedSubscription.prototype.renew = function renew() {

        return this._queue(_Subscription.prototype.renew, this._renewQueue, this.events.queuedRenewSuccess, this.events.queuedRenewError, 'Subscription is not alive after renew timeout');
    };

    /**
     * @returns {Promise<ApiResponse>}
     */

    CachedSubscription.prototype.resubscribe = function resubscribe() {

        return this._queue(_Subscription.prototype.resubscribe, this._resubscribeQueue, this.events.queuedResubscribeSuccess, this.events.queuedResubscribeError, 'Subscription is not alive after resubscribe timeout');
    };

    /**
     * @param {string[]} events
     * @return {CachedSubscription}
     */

    CachedSubscription.prototype.restore = function restore(events) {

        var cachedSubscriptionData = this._cache.getItem(this._cacheKey);

        if (cachedSubscriptionData) {
            try {
                this.setSubscription(cachedSubscriptionData);
            } catch (e) {}
        } else {
            this.setEventFilters(events);
        }

        return this;
    };

    return CachedSubscription;
})(_Subscription3.default);

exports.default = CachedSubscription;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=ringcentral-bundle.js.map