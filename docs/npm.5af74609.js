// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"cTXQl":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "046297ec5af74609";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && ![
        "localhost",
        "127.0.0.1",
        "0.0.0.0"
    ].includes(hostname) ? "wss" : "ws";
    var ws;
    try {
        ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === "undefined" ? typeof chrome === "undefined" ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                }
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        if (e.message) console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", // $FlowFixMe
    href.split("?")[0] + "?" + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            });
            // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"fLTJ4":[function(require,module,exports) {
// This file is autogenerated via the `commonjs` Grunt task. You can require() this file in a CommonJS environment.
require("65a068d8f22fc313");
require("5bd7970c04112e52");
require("4756d66064f8bc18");
require("e666ccf4ec7a712c");
require("251eccda91a77585");
require("f409a7f92d82df0");
require("85e6f7bd5a7035bb");
require("73131daa8aa1be8a");
require("2e3514ec83b894a8");
require("80db32103ab246db");
require("eb97ce08d32c2795");
require("501b841ddeb5b9e5");

},{"65a068d8f22fc313":"6IJoJ","5bd7970c04112e52":"NzwVV","4756d66064f8bc18":"jXlzs","e666ccf4ec7a712c":"6QUC6","251eccda91a77585":"5O6fk","f409a7f92d82df0":"aCI24","85e6f7bd5a7035bb":"bSdn3","73131daa8aa1be8a":"eEvIy","2e3514ec83b894a8":"ceaOJ","80db32103ab246db":"hgZ5h","eb97ce08d32c2795":"idPaq","501b841ddeb5b9e5":"9K7b1"}],"6IJoJ":[function(require,module,exports) {
/* ========================================================================
 * Bootstrap: transition.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */ (function($) {
    "use strict";
    // CSS TRANSITION SUPPORT (Shoutout: https://modernizr.com/)
    // ============================================================
    function transitionEnd() {
        var el = document.createElement("bootstrap");
        var transEndEventNames = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        for(var name in transEndEventNames){
            if (el.style[name] !== undefined) return {
                end: transEndEventNames[name]
            };
        }
        return false // explicit for ie8 (  ._.)
        ;
    }
    // https://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function(duration) {
        var called = false;
        var $el = this;
        $(this).one("bsTransitionEnd", function() {
            called = true;
        });
        var callback = function() {
            if (!called) $($el).trigger($.support.transition.end);
        };
        setTimeout(callback, duration);
        return this;
    };
    $(function() {
        $.support.transition = transitionEnd();
        if (!$.support.transition) return;
        $.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function(e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
            }
        };
    });
})(jQuery);

},{}],"NzwVV":[function(require,module,exports) {
/* ========================================================================
 * Bootstrap: alert.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */ (function($) {
    "use strict";
    // ALERT CLASS DEFINITION
    // ======================
    var dismiss = '[data-dismiss="alert"]';
    var Alert = function(el) {
        $(el).on("click", dismiss, this.close);
    };
    Alert.VERSION = "3.4.1";
    Alert.TRANSITION_DURATION = 150;
    Alert.prototype.close = function(e) {
        var $this = $(this);
        var selector = $this.attr("data-target");
        if (!selector) {
            selector = $this.attr("href");
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, "") // strip for ie7
            ;
        }
        selector = selector === "#" ? [] : selector;
        var $parent = $(document).find(selector);
        if (e) e.preventDefault();
        if (!$parent.length) $parent = $this.closest(".alert");
        $parent.trigger(e = $.Event("close.bs.alert"));
        if (e.isDefaultPrevented()) return;
        $parent.removeClass("in");
        function removeElement() {
            // detach from parent, fire event then clean up data
            $parent.detach().trigger("closed.bs.alert").remove();
        }
        $.support.transition && $parent.hasClass("fade") ? $parent.one("bsTransitionEnd", removeElement).emulateTransitionEnd(Alert.TRANSITION_DURATION) : removeElement();
    };
    // ALERT PLUGIN DEFINITION
    // =======================
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.alert");
            if (!data) $this.data("bs.alert", data = new Alert(this));
            if (typeof option == "string") data[option].call($this);
        });
    }
    var old = $.fn.alert;
    $.fn.alert = Plugin;
    $.fn.alert.Constructor = Alert;
    // ALERT NO CONFLICT
    // =================
    $.fn.alert.noConflict = function() {
        $.fn.alert = old;
        return this;
    };
    // ALERT DATA-API
    // ==============
    $(document).on("click.bs.alert.data-api", dismiss, Alert.prototype.close);
})(jQuery);

},{}],"jXlzs":[function(require,module,exports) {
/* ========================================================================
 * Bootstrap: button.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */ (function($) {
    "use strict";
    // BUTTON PUBLIC CLASS DEFINITION
    // ==============================
    var Button = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Button.DEFAULTS, options);
        this.isLoading = false;
    };
    Button.VERSION = "3.4.1";
    Button.DEFAULTS = {
        loadingText: "loading..."
    };
    Button.prototype.setState = function(state) {
        var d = "disabled";
        var $el = this.$element;
        var val = $el.is("input") ? "val" : "html";
        var data = $el.data();
        state += "Text";
        if (data.resetText == null) $el.data("resetText", $el[val]());
        // push to event loop to allow forms to submit
        setTimeout($.proxy(function() {
            $el[val](data[state] == null ? this.options[state] : data[state]);
            if (state == "loadingText") {
                this.isLoading = true;
                $el.addClass(d).attr(d, d).prop(d, true);
            } else if (this.isLoading) {
                this.isLoading = false;
                $el.removeClass(d).removeAttr(d).prop(d, false);
            }
        }, this), 0);
    };
    Button.prototype.toggle = function() {
        var changed = true;
        var $parent = this.$element.closest('[data-toggle="buttons"]');
        if ($parent.length) {
            var $input = this.$element.find("input");
            if ($input.prop("type") == "radio") {
                if ($input.prop("checked")) changed = false;
                $parent.find(".active").removeClass("active");
                this.$element.addClass("active");
            } else if ($input.prop("type") == "checkbox") {
                if ($input.prop("checked") !== this.$element.hasClass("active")) changed = false;
                this.$element.toggleClass("active");
            }
            $input.prop("checked", this.$element.hasClass("active"));
            if (changed) $input.trigger("change");
        } else {
            this.$element.attr("aria-pressed", !this.$element.hasClass("active"));
            this.$element.toggleClass("active");
        }
    };
    // BUTTON PLUGIN DEFINITION
    // ========================
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.button");
            var options = typeof option == "object" && option;
            if (!data) $this.data("bs.button", data = new Button(this, options));
            if (option == "toggle") data.toggle();
            else if (option) data.setState(option);
        });
    }
    var old = $.fn.button;
    $.fn.button = Plugin;
    $.fn.button.Constructor = Button;
    // BUTTON NO CONFLICT
    // ==================
    $.fn.button.noConflict = function() {
        $.fn.button = old;
        return this;
    };
    // BUTTON DATA-API
    // ===============
    $(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(e) {
        var $btn = $(e.target).closest(".btn");
        Plugin.call($btn, "toggle");
        if (!$(e.target).is('input[type="radio"], input[type="checkbox"]')) {
            // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
            e.preventDefault();
            // The target component still receive the focus
            if ($btn.is("input,button")) $btn.trigger("focus");
            else $btn.find("input:visible,button:visible").first().trigger("focus");
        }
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function(e) {
        $(e.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(e.type));
    });
})(jQuery);

},{}],"6QUC6":[function(require,module,exports) {
/* ========================================================================
 * Bootstrap: carousel.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */ (function($) {
    "use strict";
    // CAROUSEL CLASS DEFINITION
    // =========================
    var Carousel = function(element, options) {
        this.$element = $(element);
        this.$indicators = this.$element.find(".carousel-indicators");
        this.options = options;
        this.paused = null;
        this.sliding = null;
        this.interval = null;
        this.$active = null;
        this.$items = null;
        this.options.keyboard && this.$element.on("keydown.bs.carousel", $.proxy(this.keydown, this));
        this.options.pause == "hover" && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", $.proxy(this.pause, this)).on("mouseleave.bs.carousel", $.proxy(this.cycle, this));
    };
    Carousel.VERSION = "3.4.1";
    Carousel.TRANSITION_DURATION = 600;
    Carousel.DEFAULTS = {
        interval: 5000,
        pause: "hover",
        wrap: true,
        keyboard: true
    };
    Carousel.prototype.keydown = function(e) {
        if (/input|textarea/i.test(e.target.tagName)) return;
        switch(e.which){
            case 37:
                this.prev();
                break;
            case 39:
                this.next();
                break;
            default:
                return;
        }
        e.preventDefault();
    };
    Carousel.prototype.cycle = function(e) {
        e || (this.paused = false);
        this.interval && clearInterval(this.interval);
        this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));
        return this;
    };
    Carousel.prototype.getItemIndex = function(item) {
        this.$items = item.parent().children(".item");
        return this.$items.index(item || this.$active);
    };
    Carousel.prototype.getItemForDirection = function(direction, active) {
        var activeIndex = this.getItemIndex(active);
        var willWrap = direction == "prev" && activeIndex === 0 || direction == "next" && activeIndex == this.$items.length - 1;
        if (willWrap && !this.options.wrap) return active;
        var delta = direction == "prev" ? -1 : 1;
        var itemIndex = (activeIndex + delta) % this.$items.length;
        return this.$items.eq(itemIndex);
    };
    Carousel.prototype.to = function(pos) {
        var that = this;
        var activeIndex = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        if (pos > this.$items.length - 1 || pos < 0) return;
        if (this.sliding) return this.$element.one("slid.bs.carousel", function() {
            that.to(pos);
        }) // yes, "slid"
        ;
        if (activeIndex == pos) return this.pause().cycle();
        return this.slide(pos > activeIndex ? "next" : "prev", this.$items.eq(pos));
    };
    Carousel.prototype.pause = function(e) {
        e || (this.paused = true);
        if (this.$element.find(".next, .prev").length && $.support.transition) {
            this.$element.trigger($.support.transition.end);
            this.cycle(true);
        }
        this.interval = clearInterval(this.interval);
        return this;
    };
    Carousel.prototype.next = function() {
        if (this.sliding) return;
        return this.slide("next");
    };
    Carousel.prototype.prev = function() {
        if (this.sliding) return;
        return this.slide("prev");
    };
    Carousel.prototype.slide = function(type, next) {
        var $active = this.$element.find(".item.active");
        var $next = next || this.getItemForDirection(type, $active);
        var isCycling = this.interval;
        var direction = type == "next" ? "left" : "right";
        var that = this;
        if ($next.hasClass("active")) return this.sliding = false;
        var relatedTarget = $next[0];
        var slideEvent = $.Event("slide.bs.carousel", {
            relatedTarget: relatedTarget,
            direction: direction
        });
        this.$element.trigger(slideEvent);
        if (slideEvent.isDefaultPrevented()) return;
        this.sliding = true;
        isCycling && this.pause();
        if (this.$indicators.length) {
            this.$indicators.find(".active").removeClass("active");
            var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
            $nextIndicator && $nextIndicator.addClass("active");
        }
        var slidEvent = $.Event("slid.bs.carousel", {
            relatedTarget: relatedTarget,
            direction: direction
        }) // yes, "slid"
        ;
        if ($.support.transition && this.$element.hasClass("slide")) {
            $next.addClass(type);
            if (typeof $next === "object" && $next.length) $next[0].offsetWidth // force reflow
            ;
            $active.addClass(direction);
            $next.addClass(direction);
            $active.one("bsTransitionEnd", function() {
                $next.removeClass([
                    type,
                    direction
                ].join(" ")).addClass("active");
                $active.removeClass([
                    "active",
                    direction
                ].join(" "));
                that.sliding = false;
                setTimeout(function() {
                    that.$element.trigger(slidEvent);
                }, 0);
            }).emulateTransitionEnd(Carousel.TRANSITION_DURATION);
        } else {
            $active.removeClass("active");
            $next.addClass("active");
            this.sliding = false;
            this.$element.trigger(slidEvent);
        }
        isCycling && this.cycle();
        return this;
    };
    // CAROUSEL PLUGIN DEFINITION
    // ==========================
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.carousel");
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == "object" && option);
            var action = typeof option == "string" ? option : options.slide;
            if (!data) $this.data("bs.carousel", data = new Carousel(this, options));
            if (typeof option == "number") data.to(option);
            else if (action) data[action]();
            else if (options.interval) data.pause().cycle();
        });
    }
    var old = $.fn.carousel;
    $.fn.carousel = Plugin;
    $.fn.carousel.Constructor = Carousel;
    // CAROUSEL NO CONFLICT
    // ====================
    $.fn.carousel.noConflict = function() {
        $.fn.carousel = old;
        return this;
    };
    // CAROUSEL DATA-API
    // =================
    var clickHandler = function(e) {
        var $this = $(this);
        var href = $this.attr("href");
        if (href) href = href.replace(/.*(?=#[^\s]+$)/, "") // strip for ie7
        ;
        var target = $this.attr("data-target") || href;
        var $target = $(document).find(target);
        if (!$target.hasClass("carousel")) return;
        var options = $.extend({}, $target.data(), $this.data());
        var slideIndex = $this.attr("data-slide-to");
        if (slideIndex) options.interval = false;
        Plugin.call($target, options);
        if (slideIndex) $target.data("bs.carousel").to(slideIndex);
        e.preventDefault();
    };
    $(document).on("click.bs.carousel.data-api", "[data-slide]", clickHandler).on("click.bs.carousel.data-api", "[data-slide-to]", clickHandler);
    $(window).on("load", function() {
        $('[data-ride="carousel"]').each(function() {
            var $carousel = $(this);
            Plugin.call($carousel, $carousel.data());
        });
    });
})(jQuery);

},{}],"5O6fk":[function(require,module,exports) {
/* ========================================================================
 * Bootstrap: collapse.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */ /* jshint latedef: false */ (function($) {
    "use strict";
    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================
    var Collapse = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Collapse.DEFAULTS, options);
        this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' + '[data-toggle="collapse"][data-target="#' + element.id + '"]');
        this.transitioning = null;
        if (this.options.parent) this.$parent = this.getParent();
        else this.addAriaAndCollapsedClass(this.$element, this.$trigger);
        if (this.options.toggle) this.toggle();
    };
    Collapse.VERSION = "3.4.1";
    Collapse.TRANSITION_DURATION = 350;
    Collapse.DEFAULTS = {
        toggle: true
    };
    Collapse.prototype.dimension = function() {
        var hasWidth = this.$element.hasClass("width");
        return hasWidth ? "width" : "height";
    };
    Collapse.prototype.show = function() {
        if (this.transitioning || this.$element.hasClass("in")) return;
        var activesData;
        var actives = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
        if (actives && actives.length) {
            activesData = actives.data("bs.collapse");
            if (activesData && activesData.transitioning) return;
        }
        var startEvent = $.Event("show.bs.collapse");
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented()) return;
        if (actives && actives.length) {
            Plugin.call(actives, "hide");
            activesData || actives.data("bs.collapse", null);
        }
        var dimension = this.dimension();
        this.$element.removeClass("collapse").addClass("collapsing")[dimension](0).attr("aria-expanded", true);
        this.$trigger.removeClass("collapsed").attr("aria-expanded", true);
        this.transitioning = 1;
        var complete = function() {
            this.$element.removeClass("collapsing").addClass("collapse in")[dimension]("");
            this.transitioning = 0;
            this.$element.trigger("shown.bs.collapse");
        };
        if (!$.support.transition) return complete.call(this);
        var scrollSize = $.camelCase([
            "scroll",
            dimension
        ].join("-"));
        this.$element.one("bsTransitionEnd", $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize]);
    };
    Collapse.prototype.hide = function() {
        if (this.transitioning || !this.$element.hasClass("in")) return;
        var startEvent = $.Event("hide.bs.collapse");
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented()) return;
        var dimension = this.dimension();
        this.$element[dimension](this.$element[dimension]())[0].offsetHeight;
        this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", false);
        this.$trigger.addClass("collapsed").attr("aria-expanded", false);
        this.transitioning = 1;
        var complete = function() {
            this.transitioning = 0;
            this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse");
        };
        if (!$.support.transition) return complete.call(this);
        this.$element[dimension](0).one("bsTransitionEnd", $.proxy(complete, this)).emulateTransitionEnd(Collapse.TRANSITION_DURATION);
    };
    Collapse.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]();
    };
    Collapse.prototype.getParent = function() {
        return $(document).find(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each($.proxy(function(i, element) {
            var $element = $(element);
            this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element);
        }, this)).end();
    };
    Collapse.prototype.addAriaAndCollapsedClass = function($element, $trigger) {
        var isOpen = $element.hasClass("in");
        $element.attr("aria-expanded", isOpen);
        $trigger.toggleClass("collapsed", !isOpen).attr("aria-expanded", isOpen);
    };
    function getTargetFromTrigger($trigger) {
        var href;
        var target = $trigger.attr("data-target") || (href = $trigger.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, "") // strip for ie7
        ;
        return $(document).find(target);
    }
    // COLLAPSE PLUGIN DEFINITION
    // ==========================
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.collapse");
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == "object" && option);
            if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false;
            if (!data) $this.data("bs.collapse", data = new Collapse(this, options));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.collapse;
    $.fn.collapse = Plugin;
    $.fn.collapse.Constructor = Collapse;
    // COLLAPSE NO CONFLICT
    // ====================
    $.fn.collapse.noConflict = function() {
        $.fn.collapse = old;
        return this;
    };
    // COLLAPSE DATA-API
    // =================
    $(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(e) {
        var $this = $(this);
        if (!$this.attr("data-target")) e.preventDefault();
        var $target = getTargetFromTrigger($this);
        var data = $target.data("bs.collapse");
        var option = data ? "toggle" : $this.data();
        Plugin.call($target, option);
    });
})(jQuery);

},{}],"aCI24":[function(require,module,exports) {
/* ========================================================================
 * Bootstrap: dropdown.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */ (function($) {
    "use strict";
    // DROPDOWN CLASS DEFINITION
    // =========================
    var backdrop = ".dropdown-backdrop";
    var toggle = '[data-toggle="dropdown"]';
    var Dropdown = function(element) {
        $(element).on("click.bs.dropdown", this.toggle);
    };
    Dropdown.VERSION = "3.4.1";
    function getParent($this) {
        var selector = $this.attr("data-target");
        if (!selector) {
            selector = $this.attr("href");
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, "") // strip for ie7
            ;
        }
        var $parent = selector !== "#" ? $(document).find(selector) : null;
        return $parent && $parent.length ? $parent : $this.parent();
    }
    function clearMenus(e) {
        if (e && e.which === 3) return;
        $(backdrop).remove();
        $(toggle).each(function() {
            var $this = $(this);
            var $parent = getParent($this);
            var relatedTarget = {
                relatedTarget: this
            };
            if (!$parent.hasClass("open")) return;
            if (e && e.type == "click" && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;
            $parent.trigger(e = $.Event("hide.bs.dropdown", relatedTarget));
            if (e.isDefaultPrevented()) return;
            $this.attr("aria-expanded", "false");
            $parent.removeClass("open").trigger($.Event("hidden.bs.dropdown", relatedTarget));
        });
    }
    Dropdown.prototype.toggle = function(e) {
        var $this = $(this);
        if ($this.is(".disabled, :disabled")) return;
        var $parent = getParent($this);
        var isActive = $parent.hasClass("open");
        clearMenus();
        if (!isActive) {
            if ("ontouchstart" in document.documentElement && !$parent.closest(".navbar-nav").length) // if mobile we use a backdrop because click events don't delegate
            $(document.createElement("div")).addClass("dropdown-backdrop").insertAfter($(this)).on("click", clearMenus);
            var relatedTarget = {
                relatedTarget: this
            };
            $parent.trigger(e = $.Event("show.bs.dropdown", relatedTarget));
            if (e.isDefaultPrevented()) return;
            $this.trigger("focus").attr("aria-expanded", "true");
            $parent.toggleClass("open").trigger($.Event("shown.bs.dropdown", relatedTarget));
        }
        return false;
    };
    Dropdown.prototype.keydown = function(e) {
        if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;
        var $this = $(this);
        e.preventDefault();
        e.stopPropagation();
        if ($this.is(".disabled, :disabled")) return;
        var $parent = getParent($this);
        var isActive = $parent.hasClass("open");
        if (!isActive && e.which != 27 || isActive && e.which == 27) {
            if (e.which == 27) $parent.find(toggle).trigger("focus");
            return $this.trigger("click");
        }
        var desc = " li:not(.disabled):visible a";
        var $items = $parent.find(".dropdown-menu" + desc);
        if (!$items.length) return;
        var index = $items.index(e.target);
        if (e.which == 38 && index > 0) index-- // up
        ;
        if (e.which == 40 && index < $items.length - 1) index++ // down
        ;
        if (!~index) index = 0;
        $items.eq(index).trigger("focus");
    };
    // DROPDOWN PLUGIN DEFINITION
    // ==========================
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.dropdown");
            if (!data) $this.data("bs.dropdown", data = new Dropdown(this));
            if (typeof option == "string") data[option].call($this);
        });
    }
    var old = $.fn.dropdown;
    $.fn.dropdown = Plugin;
    $.fn.dropdown.Constructor = Dropdown;
    // DROPDOWN NO CONFLICT
    // ====================
    $.fn.dropdown.noConflict = function() {
        $.fn.dropdown = old;
        return this;
    };
    // APPLY TO STANDARD DROPDOWN ELEMENTS
    // ===================================
    $(document).on("click.bs.dropdown.data-api", clearMenus).on("click.bs.dropdown.data-api", ".dropdown form", function(e) {
        e.stopPropagation();
    }).on("click.bs.dropdown.data-api", toggle, Dropdown.prototype.toggle).on("keydown.bs.dropdown.data-api", toggle, Dropdown.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", Dropdown.prototype.keydown);
})(jQuery);

},{}],"bSdn3":[function(require,module,exports) {
/* ========================================================================
 * Bootstrap: modal.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#modals
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */ (function($) {
    "use strict";
    // MODAL CLASS DEFINITION
    // ======================
    var Modal = function(element, options) {
        this.options = options;
        this.$body = $(document.body);
        this.$element = $(element);
        this.$dialog = this.$element.find(".modal-dialog");
        this.$backdrop = null;
        this.isShown = null;
        this.originalBodyPad = null;
        this.scrollbarWidth = 0;
        this.ignoreBackdropClick = false;
        this.fixedContent = ".navbar-fixed-top, .navbar-fixed-bottom";
        if (this.options.remote) this.$element.find(".modal-content").load(this.options.remote, $.proxy(function() {
            this.$element.trigger("loaded.bs.modal");
        }, this));
    };
    Modal.VERSION = "3.4.1";
    Modal.TRANSITION_DURATION = 300;
    Modal.BACKDROP_TRANSITION_DURATION = 150;
    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    };
    Modal.prototype.toggle = function(_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget);
    };
    Modal.prototype.show = function(_relatedTarget) {
        var that = this;
        var e = $.Event("show.bs.modal", {
            relatedTarget: _relatedTarget
        });
        this.$element.trigger(e);
        if (this.isShown || e.isDefaultPrevented()) return;
        this.isShown = true;
        this.checkScrollbar();
        this.setScrollbar();
        this.$body.addClass("modal-open");
        this.escape();
        this.resize();
        this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', $.proxy(this.hide, this));
        this.$dialog.on("mousedown.dismiss.bs.modal", function() {
            that.$element.one("mouseup.dismiss.bs.modal", function(e) {
                if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true;
            });
        });
        this.backdrop(function() {
            var transition = $.support.transition && that.$element.hasClass("fade");
            if (!that.$element.parent().length) that.$element.appendTo(that.$body) // don't move modals dom position
            ;
            that.$element.show().scrollTop(0);
            that.adjustDialog();
            if (transition) that.$element[0].offsetWidth // force reflow
            ;
            that.$element.addClass("in");
            that.enforceFocus();
            var e = $.Event("shown.bs.modal", {
                relatedTarget: _relatedTarget
            });
            transition ? that.$dialog // wait for modal to slide in
            .one("bsTransitionEnd", function() {
                that.$element.trigger("focus").trigger(e);
            }).emulateTransitionEnd(Modal.TRANSITION_DURATION) : that.$element.trigger("focus").trigger(e);
        });
    };
    Modal.prototype.hide = function(e) {
        if (e) e.preventDefault();
        e = $.Event("hide.bs.modal");
        this.$element.trigger(e);
        if (!this.isShown || e.isDefaultPrevented()) return;
        this.isShown = false;
        this.escape();
        this.resize();
        $(document).off("focusin.bs.modal");
        this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal");
        this.$dialog.off("mousedown.dismiss.bs.modal");
        $.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", $.proxy(this.hideModal, this)).emulateTransitionEnd(Modal.TRANSITION_DURATION) : this.hideModal();
    };
    Modal.prototype.enforceFocus = function() {
        $(document).off("focusin.bs.modal") // guard against infinite focus loop
        .on("focusin.bs.modal", $.proxy(function(e) {
            if (document !== e.target && this.$element[0] !== e.target && !this.$element.has(e.target).length) this.$element.trigger("focus");
        }, this));
    };
    Modal.prototype.escape = function() {
        if (this.isShown && this.options.keyboard) this.$element.on("keydown.dismiss.bs.modal", $.proxy(function(e) {
            e.which == 27 && this.hide();
        }, this));
        else if (!this.isShown) this.$element.off("keydown.dismiss.bs.modal");
    };
    Modal.prototype.resize = function() {
        if (this.isShown) $(window).on("resize.bs.modal", $.proxy(this.handleUpdate, this));
        else $(window).off("resize.bs.modal");
    };
    Modal.prototype.hideModal = function() {
        var that = this;
        this.$element.hide();
        this.backdrop(function() {
            that.$body.removeClass("modal-open");
            that.resetAdjustments();
            that.resetScrollbar();
            that.$element.trigger("hidden.bs.modal");
        });
    };
    Modal.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
    };
    Modal.prototype.backdrop = function(callback) {
        var that = this;
        var animate = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate;
            this.$backdrop = $(document.createElement("div")).addClass("modal-backdrop " + animate).appendTo(this.$body);
            this.$element.on("click.dismiss.bs.modal", $.proxy(function(e) {
                if (this.ignoreBackdropClick) {
                    this.ignoreBackdropClick = false;
                    return;
                }
                if (e.target !== e.currentTarget) return;
                this.options.backdrop == "static" ? this.$element[0].focus() : this.hide();
            }, this));
            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow
            ;
            this.$backdrop.addClass("in");
            if (!callback) return;
            doAnimate ? this.$backdrop.one("bsTransitionEnd", callback).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callback();
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var callbackRemove = function() {
                that.removeBackdrop();
                callback && callback();
            };
            $.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", callbackRemove).emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) : callbackRemove();
        } else if (callback) callback();
    };
    // these following methods are used to handle overflowing modals
    Modal.prototype.handleUpdate = function() {
        this.adjustDialog();
    };
    Modal.prototype.adjustDialog = function() {
        var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : "",
            paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ""
        });
    };
    Modal.prototype.resetAdjustments = function() {
        this.$element.css({
            paddingLeft: "",
            paddingRight: ""
        });
    };
    Modal.prototype.checkScrollbar = function() {
        var fullWindowWidth = window.innerWidth;
        if (!fullWindowWidth) {
            var documentElementRect = document.documentElement.getBoundingClientRect();
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
        }
        this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
        this.scrollbarWidth = this.measureScrollbar();
    };
    Modal.prototype.setScrollbar = function() {
        var bodyPad = parseInt(this.$body.css("padding-right") || 0, 10);
        this.originalBodyPad = document.body.style.paddingRight || "";
        var scrollbarWidth = this.scrollbarWidth;
        if (this.bodyIsOverflowing) {
            this.$body.css("padding-right", bodyPad + scrollbarWidth);
            $(this.fixedContent).each(function(index, element) {
                var actualPadding = element.style.paddingRight;
                var calculatedPadding = $(element).css("padding-right");
                $(element).data("padding-right", actualPadding).css("padding-right", parseFloat(calculatedPadding) + scrollbarWidth + "px");
            });
        }
    };
    Modal.prototype.resetScrollbar = function() {
        this.$body.css("padding-right", this.originalBodyPad);
        $(this.fixedContent).each(function(index, element) {
            var padding = $(element).data("padding-right");
            $(element).removeData("padding-right");
            element.style.paddingRight = padding ? padding : "";
        });
    };
    Modal.prototype.measureScrollbar = function() {
        var scrollDiv = document.createElement("div");
        scrollDiv.className = "modal-scrollbar-measure";
        this.$body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.$body[0].removeChild(scrollDiv);
        return scrollbarWidth;
    };
    // MODAL PLUGIN DEFINITION
    // =======================
    function Plugin(option, _relatedTarget) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.modal");
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == "object" && option);
            if (!data) $this.data("bs.modal", data = new Modal(this, options));
            if (typeof option == "string") data[option](_relatedTarget);
            else if (options.show) data.show(_relatedTarget);
        });
    }
    var old = $.fn.modal;
    $.fn.modal = Plugin;
    $.fn.modal.Constructor = Modal;
    // MODAL NO CONFLICT
    // =================
    $.fn.modal.noConflict = function() {
        $.fn.modal = old;
        return this;
    };
    // MODAL DATA-API
    // ==============
    $(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(e) {
        var $this = $(this);
        var href = $this.attr("href");
        var target = $this.attr("data-target") || href && href.replace(/.*(?=#[^\s]+$)/, "") // strip for ie7
        ;
        var $target = $(document).find(target);
        var option = $target.data("bs.modal") ? "toggle" : $.extend({
            remote: !/#/.test(href) && href
        }, $target.data(), $this.data());
        if ($this.is("a")) e.preventDefault();
        $target.one("show.bs.modal", function(showEvent) {
            if (showEvent.isDefaultPrevented()) return; // only register focus restorer if modal will actually get shown
            $target.one("hidden.bs.modal", function() {
                $this.is(":visible") && $this.trigger("focus");
            });
        });
        Plugin.call($target, option, this);
    });
})(jQuery);

},{}],"eEvIy":[function(require,module,exports) {
/* ========================================================================
 * Bootstrap: tooltip.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */ (function($) {
    "use strict";
    var DISALLOWED_ATTRIBUTES = [
        "sanitize",
        "whiteList",
        "sanitizeFn"
    ];
    var uriAttrs = [
        "background",
        "cite",
        "href",
        "itemtype",
        "longdesc",
        "poster",
        "src",
        "xlink:href"
    ];
    var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
    var DefaultWhitelist = {
        // Global attributes allowed on any supplied element below.
        "*": [
            "class",
            "dir",
            "id",
            "lang",
            "role",
            ARIA_ATTRIBUTE_PATTERN
        ],
        a: [
            "target",
            "href",
            "title",
            "rel"
        ],
        area: [],
        b: [],
        br: [],
        col: [],
        code: [],
        div: [],
        em: [],
        hr: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        i: [],
        img: [
            "src",
            "alt",
            "title",
            "width",
            "height"
        ],
        li: [],
        ol: [],
        p: [],
        pre: [],
        s: [],
        small: [],
        span: [],
        sub: [],
        sup: [],
        strong: [],
        u: [],
        ul: []
    };
    /**
   * A pattern that recognizes a commonly useful subset of URLs that are safe.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */ var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;
    /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */ var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;
    function allowedAttribute(attr, allowedAttributeList) {
        var attrName = attr.nodeName.toLowerCase();
        if ($.inArray(attrName, allowedAttributeList) !== -1) {
            if ($.inArray(attrName, uriAttrs) !== -1) return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN));
            return true;
        }
        var regExp = $(allowedAttributeList).filter(function(index, value) {
            return value instanceof RegExp;
        });
        // Check if a regular expression validates the attribute.
        for(var i = 0, l = regExp.length; i < l; i++){
            if (attrName.match(regExp[i])) return true;
        }
        return false;
    }
    function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
        if (unsafeHtml.length === 0) return unsafeHtml;
        if (sanitizeFn && typeof sanitizeFn === "function") return sanitizeFn(unsafeHtml);
        // IE 8 and below don't support createHTMLDocument
        if (!document.implementation || !document.implementation.createHTMLDocument) return unsafeHtml;
        var createdDocument = document.implementation.createHTMLDocument("sanitization");
        createdDocument.body.innerHTML = unsafeHtml;
        var whitelistKeys = $.map(whiteList, function(el, i) {
            return i;
        });
        var elements = $(createdDocument.body).find("*");
        for(var i = 0, len = elements.length; i < len; i++){
            var el = elements[i];
            var elName = el.nodeName.toLowerCase();
            if ($.inArray(elName, whitelistKeys) === -1) {
                el.parentNode.removeChild(el);
                continue;
            }
            var attributeList = $.map(el.attributes, function(el) {
                return el;
            });
            var whitelistedAttributes = [].concat(whiteList["*"] || [], whiteList[elName] || []);
            for(var j = 0, len2 = attributeList.length; j < len2; j++)if (!allowedAttribute(attributeList[j], whitelistedAttributes)) el.removeAttribute(attributeList[j].nodeName);
        }
        return createdDocument.body.innerHTML;
    }
    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================
    var Tooltip = function(element, options) {
        this.type = null;
        this.options = null;
        this.enabled = null;
        this.timeout = null;
        this.hoverState = null;
        this.$element = null;
        this.inState = null;
        this.init("tooltip", element, options);
    };
    Tooltip.VERSION = "3.4.1";
    Tooltip.TRANSITION_DURATION = 150;
    Tooltip.DEFAULTS = {
        animation: true,
        placement: "top",
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: "body",
            padding: 0
        },
        sanitize: true,
        sanitizeFn: null,
        whiteList: DefaultWhitelist
    };
    Tooltip.prototype.init = function(type, element, options) {
        this.enabled = true;
        this.type = type;
        this.$element = $(element);
        this.options = this.getOptions(options);
        this.$viewport = this.options.viewport && $(document).find($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport);
        this.inState = {
            click: false,
            hover: false,
            focus: false
        };
        if (this.$element[0] instanceof document.constructor && !this.options.selector) throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
        var triggers = this.options.trigger.split(" ");
        for(var i = triggers.length; i--;){
            var trigger = triggers[i];
            if (trigger == "click") this.$element.on("click." + this.type, this.options.selector, $.proxy(this.toggle, this));
            else if (trigger != "manual") {
                var eventIn = trigger == "hover" ? "mouseenter" : "focusin";
                var eventOut = trigger == "hover" ? "mouseleave" : "focusout";
                this.$element.on(eventIn + "." + this.type, this.options.selector, $.proxy(this.enter, this));
                this.$element.on(eventOut + "." + this.type, this.options.selector, $.proxy(this.leave, this));
            }
        }
        this.options.selector ? this._options = $.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle();
    };
    Tooltip.prototype.getDefaults = function() {
        return Tooltip.DEFAULTS;
    };
    Tooltip.prototype.getOptions = function(options) {
        var dataAttributes = this.$element.data();
        for(var dataAttr in dataAttributes)if (dataAttributes.hasOwnProperty(dataAttr) && $.inArray(dataAttr, DISALLOWED_ATTRIBUTES) !== -1) delete dataAttributes[dataAttr];
        options = $.extend({}, this.getDefaults(), dataAttributes, options);
        if (options.delay && typeof options.delay == "number") options.delay = {
            show: options.delay,
            hide: options.delay
        };
        if (options.sanitize) options.template = sanitizeHtml(options.template, options.whiteList, options.sanitizeFn);
        return options;
    };
    Tooltip.prototype.getDelegateOptions = function() {
        var options = {};
        var defaults = this.getDefaults();
        this._options && $.each(this._options, function(key, value) {
            if (defaults[key] != value) options[key] = value;
        });
        return options;
    };
    Tooltip.prototype.enter = function(obj) {
        var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data("bs." + this.type);
        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data("bs." + this.type, self);
        }
        if (obj instanceof $.Event) self.inState[obj.type == "focusin" ? "focus" : "hover"] = true;
        if (self.tip().hasClass("in") || self.hoverState == "in") {
            self.hoverState = "in";
            return;
        }
        clearTimeout(self.timeout);
        self.hoverState = "in";
        if (!self.options.delay || !self.options.delay.show) return self.show();
        self.timeout = setTimeout(function() {
            if (self.hoverState == "in") self.show();
        }, self.options.delay.show);
    };
    Tooltip.prototype.isInStateTrue = function() {
        for(var key in this.inState){
            if (this.inState[key]) return true;
        }
        return false;
    };
    Tooltip.prototype.leave = function(obj) {
        var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data("bs." + this.type);
        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data("bs." + this.type, self);
        }
        if (obj instanceof $.Event) self.inState[obj.type == "focusout" ? "focus" : "hover"] = false;
        if (self.isInStateTrue()) return;
        clearTimeout(self.timeout);
        self.hoverState = "out";
        if (!self.options.delay || !self.options.delay.hide) return self.hide();
        self.timeout = setTimeout(function() {
            if (self.hoverState == "out") self.hide();
        }, self.options.delay.hide);
    };
    Tooltip.prototype.show = function() {
        var e = $.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e);
            var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (e.isDefaultPrevented() || !inDom) return;
            var that = this;
            var $tip = this.tip();
            var tipId = this.getUID(this.type);
            this.setContent();
            $tip.attr("id", tipId);
            this.$element.attr("aria-describedby", tipId);
            if (this.options.animation) $tip.addClass("fade");
            var placement = typeof this.options.placement == "function" ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;
            var autoToken = /\s?auto?\s?/i;
            var autoPlace = autoToken.test(placement);
            if (autoPlace) placement = placement.replace(autoToken, "") || "top";
            $tip.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(placement).data("bs." + this.type, this);
            this.options.container ? $tip.appendTo($(document).find(this.options.container)) : $tip.insertAfter(this.$element);
            this.$element.trigger("inserted.bs." + this.type);
            var pos = this.getPosition();
            var actualWidth = $tip[0].offsetWidth;
            var actualHeight = $tip[0].offsetHeight;
            if (autoPlace) {
                var orgPlacement = placement;
                var viewportDim = this.getPosition(this.$viewport);
                placement = placement == "bottom" && pos.bottom + actualHeight > viewportDim.bottom ? "top" : placement == "top" && pos.top - actualHeight < viewportDim.top ? "bottom" : placement == "right" && pos.right + actualWidth > viewportDim.width ? "left" : placement == "left" && pos.left - actualWidth < viewportDim.left ? "right" : placement;
                $tip.removeClass(orgPlacement).addClass(placement);
            }
            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
            this.applyPlacement(calculatedOffset, placement);
            var complete = function() {
                var prevHoverState = that.hoverState;
                that.$element.trigger("shown.bs." + that.type);
                that.hoverState = null;
                if (prevHoverState == "out") that.leave(that);
            };
            $.support.transition && this.$tip.hasClass("fade") ? $tip.one("bsTransitionEnd", complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();
        }
    };
    Tooltip.prototype.applyPlacement = function(offset, placement) {
        var $tip = this.tip();
        var width = $tip[0].offsetWidth;
        var height = $tip[0].offsetHeight;
        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css("margin-top"), 10);
        var marginLeft = parseInt($tip.css("margin-left"), 10);
        // we must check for NaN for ie 8/9
        if (isNaN(marginTop)) marginTop = 0;
        if (isNaN(marginLeft)) marginLeft = 0;
        offset.top += marginTop;
        offset.left += marginLeft;
        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
            using: function(props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                });
            }
        }, offset), 0);
        $tip.addClass("in");
        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth = $tip[0].offsetWidth;
        var actualHeight = $tip[0].offsetHeight;
        if (placement == "top" && actualHeight != height) offset.top = offset.top + height - actualHeight;
        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);
        if (delta.left) offset.left += delta.left;
        else offset.top += delta.top;
        var isVertical = /top|bottom/.test(placement);
        var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
        var arrowOffsetPosition = isVertical ? "offsetWidth" : "offsetHeight";
        $tip.offset(offset);
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical);
    };
    Tooltip.prototype.replaceArrow = function(delta, dimension, isVertical) {
        this.arrow().css(isVertical ? "left" : "top", 50 * (1 - delta / dimension) + "%").css(isVertical ? "top" : "left", "");
    };
    Tooltip.prototype.setContent = function() {
        var $tip = this.tip();
        var title = this.getTitle();
        if (this.options.html) {
            if (this.options.sanitize) title = sanitizeHtml(title, this.options.whiteList, this.options.sanitizeFn);
            $tip.find(".tooltip-inner").html(title);
        } else $tip.find(".tooltip-inner").text(title);
        $tip.removeClass("fade in top bottom left right");
    };
    Tooltip.prototype.hide = function(callback) {
        var that = this;
        var $tip = $(this.$tip);
        var e = $.Event("hide.bs." + this.type);
        function complete() {
            if (that.hoverState != "in") $tip.detach();
            if (that.$element) that.$element.removeAttr("aria-describedby").trigger("hidden.bs." + that.type);
            callback && callback();
        }
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;
        $tip.removeClass("in");
        $.support.transition && $tip.hasClass("fade") ? $tip.one("bsTransitionEnd", complete).emulateTransitionEnd(Tooltip.TRANSITION_DURATION) : complete();
        this.hoverState = null;
        return this;
    };
    Tooltip.prototype.fixTitle = function() {
        var $e = this.$element;
        if ($e.attr("title") || typeof $e.attr("data-original-title") != "string") $e.attr("data-original-title", $e.attr("title") || "").attr("title", "");
    };
    Tooltip.prototype.hasContent = function() {
        return this.getTitle();
    };
    Tooltip.prototype.getPosition = function($element) {
        $element = $element || this.$element;
        var el = $element[0];
        var isBody = el.tagName == "BODY";
        var elRect = el.getBoundingClientRect();
        if (elRect.width == null) // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
        elRect = $.extend({}, elRect, {
            width: elRect.right - elRect.left,
            height: elRect.bottom - elRect.top
        });
        var isSvg = window.SVGElement && el instanceof window.SVGElement;
        // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
        // See https://github.com/twbs/bootstrap/issues/20280
        var elOffset = isBody ? {
            top: 0,
            left: 0
        } : isSvg ? null : $element.offset();
        var scroll = {
            scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop()
        };
        var outerDims = isBody ? {
            width: $(window).width(),
            height: $(window).height()
        } : null;
        return $.extend({}, elRect, scroll, outerDims, elOffset);
    };
    Tooltip.prototype.getCalculatedOffset = function(placement, pos, actualWidth, actualHeight) {
        return placement == "bottom" ? {
            top: pos.top + pos.height,
            left: pos.left + pos.width / 2 - actualWidth / 2
        } : placement == "top" ? {
            top: pos.top - actualHeight,
            left: pos.left + pos.width / 2 - actualWidth / 2
        } : placement == "left" ? {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left - actualWidth
        } : /* placement == 'right' */ {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left + pos.width
        };
    };
    Tooltip.prototype.getViewportAdjustedDelta = function(placement, pos, actualWidth, actualHeight) {
        var delta = {
            top: 0,
            left: 0
        };
        if (!this.$viewport) return delta;
        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
        var viewportDimensions = this.getPosition(this.$viewport);
        if (/right|left/.test(placement)) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
            if (topEdgeOffset < viewportDimensions.top) delta.top = viewportDimensions.top - topEdgeOffset;
            else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
        } else {
            var leftEdgeOffset = pos.left - viewportPadding;
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
            if (leftEdgeOffset < viewportDimensions.left) delta.left = viewportDimensions.left - leftEdgeOffset;
            else if (rightEdgeOffset > viewportDimensions.right) delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
        }
        return delta;
    };
    Tooltip.prototype.getTitle = function() {
        var title;
        var $e = this.$element;
        var o = this.options;
        title = $e.attr("data-original-title") || (typeof o.title == "function" ? o.title.call($e[0]) : o.title);
        return title;
    };
    Tooltip.prototype.getUID = function(prefix) {
        do prefix += ~~(Math.random() * 1000000);
        while (document.getElementById(prefix));
        return prefix;
    };
    Tooltip.prototype.tip = function() {
        if (!this.$tip) {
            this.$tip = $(this.options.template);
            if (this.$tip.length != 1) throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
        }
        return this.$tip;
    };
    Tooltip.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow");
    };
    Tooltip.prototype.enable = function() {
        this.enabled = true;
    };
    Tooltip.prototype.disable = function() {
        this.enabled = false;
    };
    Tooltip.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled;
    };
    Tooltip.prototype.toggle = function(e) {
        var self = this;
        if (e) {
            self = $(e.currentTarget).data("bs." + this.type);
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions());
                $(e.currentTarget).data("bs." + this.type, self);
            }
        }
        if (e) {
            self.inState.click = !self.inState.click;
            if (self.isInStateTrue()) self.enter(self);
            else self.leave(self);
        } else self.tip().hasClass("in") ? self.leave(self) : self.enter(self);
    };
    Tooltip.prototype.destroy = function() {
        var that = this;
        clearTimeout(this.timeout);
        this.hide(function() {
            that.$element.off("." + that.type).removeData("bs." + that.type);
            if (that.$tip) that.$tip.detach();
            that.$tip = null;
            that.$arrow = null;
            that.$viewport = null;
            that.$element = null;
        });
    };
    Tooltip.prototype.sanitizeHtml = function(unsafeHtml) {
        return sanitizeHtml(unsafeHtml, this.options.whiteList, this.options.sanitizeFn);
    };
    // TOOLTIP PLUGIN DEFINITION
    // =========================
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.tooltip");
            var options = typeof option == "object" && option;
            if (!data && /destroy|hide/.test(option)) return;
            if (!data) $this.data("bs.tooltip", data = new Tooltip(this, options));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.tooltip;
    $.fn.tooltip = Plugin;
    $.fn.tooltip.Constructor = Tooltip;
    // TOOLTIP NO CONFLICT
    // ===================
    $.fn.tooltip.noConflict = function() {
        $.fn.tooltip = old;
        return this;
    };
})(jQuery);

},{}],"ceaOJ":[function(require,module,exports) {
/* ========================================================================
 * Bootstrap: popover.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */ (function($) {
    "use strict";
    // POPOVER PUBLIC CLASS DEFINITION
    // ===============================
    var Popover = function(element, options) {
        this.init("popover", element, options);
    };
    if (!$.fn.tooltip) throw new Error("Popover requires tooltip.js");
    Popover.VERSION = "3.4.1";
    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });
    // NOTE: POPOVER EXTENDS tooltip.js
    // ================================
    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);
    Popover.prototype.constructor = Popover;
    Popover.prototype.getDefaults = function() {
        return Popover.DEFAULTS;
    };
    Popover.prototype.setContent = function() {
        var $tip = this.tip();
        var title = this.getTitle();
        var content = this.getContent();
        if (this.options.html) {
            var typeContent = typeof content;
            if (this.options.sanitize) {
                title = this.sanitizeHtml(title);
                if (typeContent === "string") content = this.sanitizeHtml(content);
            }
            $tip.find(".popover-title").html(title);
            $tip.find(".popover-content").children().detach().end()[typeContent === "string" ? "html" : "append"](content);
        } else {
            $tip.find(".popover-title").text(title);
            $tip.find(".popover-content").children().detach().end().text(content);
        }
        $tip.removeClass("fade top bottom left right in");
        // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
        // this manually by checking the contents.
        if (!$tip.find(".popover-title").html()) $tip.find(".popover-title").hide();
    };
    Popover.prototype.hasContent = function() {
        return this.getTitle() || this.getContent();
    };
    Popover.prototype.getContent = function() {
        var $e = this.$element;
        var o = this.options;
        return $e.attr("data-content") || (typeof o.content == "function" ? o.content.call($e[0]) : o.content);
    };
    Popover.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow");
    };
    // POPOVER PLUGIN DEFINITION
    // =========================
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.popover");
            var options = typeof option == "object" && option;
            if (!data && /destroy|hide/.test(option)) return;
            if (!data) $this.data("bs.popover", data = new Popover(this, options));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.popover;
    $.fn.popover = Plugin;
    $.fn.popover.Constructor = Popover;
    // POPOVER NO CONFLICT
    // ===================
    $.fn.popover.noConflict = function() {
        $.fn.popover = old;
        return this;
    };
})(jQuery);

},{}],"hgZ5h":[function(require,module,exports) {
/* ========================================================================
 * Bootstrap: scrollspy.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */ (function($) {
    "use strict";
    // SCROLLSPY CLASS DEFINITION
    // ==========================
    function ScrollSpy(element, options) {
        this.$body = $(document.body);
        this.$scrollElement = $(element).is(document.body) ? $(window) : $(element);
        this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
        this.selector = (this.options.target || "") + " .nav li > a";
        this.offsets = [];
        this.targets = [];
        this.activeTarget = null;
        this.scrollHeight = 0;
        this.$scrollElement.on("scroll.bs.scrollspy", $.proxy(this.process, this));
        this.refresh();
        this.process();
    }
    ScrollSpy.VERSION = "3.4.1";
    ScrollSpy.DEFAULTS = {
        offset: 10
    };
    ScrollSpy.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
    };
    ScrollSpy.prototype.refresh = function() {
        var that = this;
        var offsetMethod = "offset";
        var offsetBase = 0;
        this.offsets = [];
        this.targets = [];
        this.scrollHeight = this.getScrollHeight();
        if (!$.isWindow(this.$scrollElement[0])) {
            offsetMethod = "position";
            offsetBase = this.$scrollElement.scrollTop();
        }
        this.$body.find(this.selector).map(function() {
            var $el = $(this);
            var href = $el.data("target") || $el.attr("href");
            var $href = /^#./.test(href) && $(href);
            return $href && $href.length && $href.is(":visible") && [
                [
                    $href[offsetMethod]().top + offsetBase,
                    href
                ]
            ] || null;
        }).sort(function(a, b) {
            return a[0] - b[0];
        }).each(function() {
            that.offsets.push(this[0]);
            that.targets.push(this[1]);
        });
    };
    ScrollSpy.prototype.process = function() {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
        var scrollHeight = this.getScrollHeight();
        var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height();
        var offsets = this.offsets;
        var targets = this.targets;
        var activeTarget = this.activeTarget;
        var i;
        if (this.scrollHeight != scrollHeight) this.refresh();
        if (scrollTop >= maxScroll) return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
        if (activeTarget && scrollTop < offsets[0]) {
            this.activeTarget = null;
            return this.clear();
        }
        for(i = offsets.length; i--;)activeTarget != targets[i] && scrollTop >= offsets[i] && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1]) && this.activate(targets[i]);
    };
    ScrollSpy.prototype.activate = function(target) {
        this.activeTarget = target;
        this.clear();
        var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';
        var active = $(selector).parents("li").addClass("active");
        if (active.parent(".dropdown-menu").length) active = active.closest("li.dropdown").addClass("active");
        active.trigger("activate.bs.scrollspy");
    };
    ScrollSpy.prototype.clear = function() {
        $(this.selector).parentsUntil(this.options.target, ".active").removeClass("active");
    };
    // SCROLLSPY PLUGIN DEFINITION
    // ===========================
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.scrollspy");
            var options = typeof option == "object" && option;
            if (!data) $this.data("bs.scrollspy", data = new ScrollSpy(this, options));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.scrollspy;
    $.fn.scrollspy = Plugin;
    $.fn.scrollspy.Constructor = ScrollSpy;
    // SCROLLSPY NO CONFLICT
    // =====================
    $.fn.scrollspy.noConflict = function() {
        $.fn.scrollspy = old;
        return this;
    };
    // SCROLLSPY DATA-API
    // ==================
    $(window).on("load.bs.scrollspy.data-api", function() {
        $('[data-spy="scroll"]').each(function() {
            var $spy = $(this);
            Plugin.call($spy, $spy.data());
        });
    });
})(jQuery);

},{}],"idPaq":[function(require,module,exports) {
/* ========================================================================
 * Bootstrap: tab.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */ (function($) {
    "use strict";
    // TAB CLASS DEFINITION
    // ====================
    var Tab = function(element) {
        // jscs:disable requireDollarBeforejQueryAssignment
        this.element = $(element);
    // jscs:enable requireDollarBeforejQueryAssignment
    };
    Tab.VERSION = "3.4.1";
    Tab.TRANSITION_DURATION = 150;
    Tab.prototype.show = function() {
        var $this = this.element;
        var $ul = $this.closest("ul:not(.dropdown-menu)");
        var selector = $this.data("target");
        if (!selector) {
            selector = $this.attr("href");
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, "") // strip for ie7
            ;
        }
        if ($this.parent("li").hasClass("active")) return;
        var $previous = $ul.find(".active:last a");
        var hideEvent = $.Event("hide.bs.tab", {
            relatedTarget: $this[0]
        });
        var showEvent = $.Event("show.bs.tab", {
            relatedTarget: $previous[0]
        });
        $previous.trigger(hideEvent);
        $this.trigger(showEvent);
        if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return;
        var $target = $(document).find(selector);
        this.activate($this.closest("li"), $ul);
        this.activate($target, $target.parent(), function() {
            $previous.trigger({
                type: "hidden.bs.tab",
                relatedTarget: $this[0]
            });
            $this.trigger({
                type: "shown.bs.tab",
                relatedTarget: $previous[0]
            });
        });
    };
    Tab.prototype.activate = function(element, container, callback) {
        var $active = container.find("> .active");
        var transition = callback && $.support.transition && ($active.length && $active.hasClass("fade") || !!container.find("> .fade").length);
        function next() {
            $active.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", false);
            element.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", true);
            if (transition) {
                element[0].offsetWidth // reflow for transition
                ;
                element.addClass("in");
            } else element.removeClass("fade");
            if (element.parent(".dropdown-menu").length) element.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", true);
            callback && callback();
        }
        $active.length && transition ? $active.one("bsTransitionEnd", next).emulateTransitionEnd(Tab.TRANSITION_DURATION) : next();
        $active.removeClass("in");
    };
    // TAB PLUGIN DEFINITION
    // =====================
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.tab");
            if (!data) $this.data("bs.tab", data = new Tab(this));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.tab;
    $.fn.tab = Plugin;
    $.fn.tab.Constructor = Tab;
    // TAB NO CONFLICT
    // ===============
    $.fn.tab.noConflict = function() {
        $.fn.tab = old;
        return this;
    };
    // TAB DATA-API
    // ============
    var clickHandler = function(e) {
        e.preventDefault();
        Plugin.call($(this), "show");
    };
    $(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', clickHandler).on("click.bs.tab.data-api", '[data-toggle="pill"]', clickHandler);
})(jQuery);

},{}],"9K7b1":[function(require,module,exports) {
/* ========================================================================
 * Bootstrap: affix.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#affix
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */ (function($) {
    "use strict";
    // AFFIX CLASS DEFINITION
    // ======================
    var Affix = function(element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options);
        var target = this.options.target === Affix.DEFAULTS.target ? $(this.options.target) : $(document).find(this.options.target);
        this.$target = target.on("scroll.bs.affix.data-api", $.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", $.proxy(this.checkPositionWithEventLoop, this));
        this.$element = $(element);
        this.affixed = null;
        this.unpin = null;
        this.pinnedOffset = null;
        this.checkPosition();
    };
    Affix.VERSION = "3.4.1";
    Affix.RESET = "affix affix-top affix-bottom";
    Affix.DEFAULTS = {
        offset: 0,
        target: window
    };
    Affix.prototype.getState = function(scrollHeight, height, offsetTop, offsetBottom) {
        var scrollTop = this.$target.scrollTop();
        var position = this.$element.offset();
        var targetHeight = this.$target.height();
        if (offsetTop != null && this.affixed == "top") return scrollTop < offsetTop ? "top" : false;
        if (this.affixed == "bottom") {
            if (offsetTop != null) return scrollTop + this.unpin <= position.top ? false : "bottom";
            return scrollTop + targetHeight <= scrollHeight - offsetBottom ? false : "bottom";
        }
        var initializing = this.affixed == null;
        var colliderTop = initializing ? scrollTop : position.top;
        var colliderHeight = initializing ? targetHeight : height;
        if (offsetTop != null && scrollTop <= offsetTop) return "top";
        if (offsetBottom != null && colliderTop + colliderHeight >= scrollHeight - offsetBottom) return "bottom";
        return false;
    };
    Affix.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(Affix.RESET).addClass("affix");
        var scrollTop = this.$target.scrollTop();
        var position = this.$element.offset();
        return this.pinnedOffset = position.top - scrollTop;
    };
    Affix.prototype.checkPositionWithEventLoop = function() {
        setTimeout($.proxy(this.checkPosition, this), 1);
    };
    Affix.prototype.checkPosition = function() {
        if (!this.$element.is(":visible")) return;
        var height = this.$element.height();
        var offset = this.options.offset;
        var offsetTop = offset.top;
        var offsetBottom = offset.bottom;
        var scrollHeight = Math.max($(document).height(), $(document.body).height());
        if (typeof offset != "object") offsetBottom = offsetTop = offset;
        if (typeof offsetTop == "function") offsetTop = offset.top(this.$element);
        if (typeof offsetBottom == "function") offsetBottom = offset.bottom(this.$element);
        var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);
        if (this.affixed != affix) {
            if (this.unpin != null) this.$element.css("top", "");
            var affixType = "affix" + (affix ? "-" + affix : "");
            var e = $.Event(affixType + ".bs.affix");
            this.$element.trigger(e);
            if (e.isDefaultPrevented()) return;
            this.affixed = affix;
            this.unpin = affix == "bottom" ? this.getPinnedOffset() : null;
            this.$element.removeClass(Affix.RESET).addClass(affixType).trigger(affixType.replace("affix", "affixed") + ".bs.affix");
        }
        if (affix == "bottom") this.$element.offset({
            top: scrollHeight - height - offsetBottom
        });
    };
    // AFFIX PLUGIN DEFINITION
    // =======================
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.affix");
            var options = typeof option == "object" && option;
            if (!data) $this.data("bs.affix", data = new Affix(this, options));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.affix;
    $.fn.affix = Plugin;
    $.fn.affix.Constructor = Affix;
    // AFFIX NO CONFLICT
    // =================
    $.fn.affix.noConflict = function() {
        $.fn.affix = old;
        return this;
    };
    // AFFIX DATA-API
    // ==============
    $(window).on("load", function() {
        $('[data-spy="affix"]').each(function() {
            var $spy = $(this);
            var data = $spy.data();
            data.offset = data.offset || {};
            if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom;
            if (data.offsetTop != null) data.offset.top = data.offsetTop;
            Plugin.call($spy, data);
        });
    });
})(jQuery);

},{}]},["cTXQl"], null, "parcelRequire2073")

//# sourceMappingURL=npm.5af74609.js.map
