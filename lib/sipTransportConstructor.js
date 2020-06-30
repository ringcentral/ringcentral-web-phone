"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportConstructorWrapper = void 0;
exports.TransportConstructorWrapper = function (SipTransportConstructor, webPhoneOptions) {
    return function (logger, options) {
        var transport = new SipTransportConstructor(logger, options);
        transport.nextReconnectInterval = 0;
        transport.sipErrorCodes = webPhoneOptions.sipErrorCodes;
        transport.switchBackInterval = webPhoneOptions.switchBackInterval;
        transport.mainProxy = transport.configuration.wsServers[0];
        transport.computeRandomTimeout = computeRandomTimeout;
        transport.reconnect = reconnect.bind(transport);
        transport.isSipErrorCode = isSipErrorCode.bind(transport);
        transport.scheduleSwitchBackMainProxy = scheduleSwitchBackMainProxy.bind(transport);
        transport.onSipErrorCode = onSipErrorCode.bind(transport);
        transport.__isCurrentMainProxy = __isCurrentMainProxy.bind(transport);
        transport.__afterWSConnected = __afterWSConnected.bind(transport);
        transport.__onConnectedToBackup = __onConnectedToBackup.bind(transport);
        transport.__onConnectedToMain = __onConnectedToMain.bind(transport);
        transport.__clearSwitchBackTimer = __clearSwitchBackTimer.bind(transport);
        transport.__connect = transport.connect;
        transport.connect = __connect.bind(transport);
        transport.on('connected', transport.__afterWSConnected);
        return transport;
    };
};
var C = {
    // Transport status codes
    STATUS_CONNECTING: 0,
    STATUS_OPEN: 1,
    STATUS_CLOSING: 2,
    STATUS_CLOSED: 3
};
var computeRandomTimeout = function (reconnectionAttempts, randomMinInterval, randomMaxInterval) {
    if (reconnectionAttempts === void 0) { reconnectionAttempts = 1; }
    if (randomMinInterval === void 0) { randomMinInterval = 0; }
    if (randomMaxInterval === void 0) { randomMaxInterval = 0; }
    if (randomMinInterval < 0 || randomMaxInterval < 0 || reconnectionAttempts < 1) {
        throw new Error('Arguments must be positive numbers');
    }
    var randomInterval = Math.floor(Math.random() * Math.abs(randomMaxInterval - randomMinInterval)) + randomMinInterval;
    var retryOffset = ((reconnectionAttempts - 1) * (randomMinInterval + randomMaxInterval)) / 2;
    return randomInterval + retryOffset;
};
function __connect(options) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.__connect(options).catch(function (err) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.emit('wsConnectionError', err);
                                    this.logger.warn('Connection Error occured. Trying to reconnect to websocket...');
                                    this.onError(err);
                                    this.disconnect({ force: true });
                                    this.disposeWs();
                                    return [4 /*yield*/, this.reconnect()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function reconnect(forceReconnectToMain) {
    return __awaiter(this, void 0, void 0, function () {
        var randomMinInterval, randomMaxInterval;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (this.reconnectionAttempts > 0) {
                        this.logger.warn('Reconnection attempt ' + this.reconnectionAttempts + ' failed');
                    }
                    if (!forceReconnectToMain) return [3 /*break*/, 3];
                    this.logger.warn('forcing connect to main WS server');
                    return [4 /*yield*/, this.disconnect({ force: true })];
                case 1:
                    _a.sent();
                    this.server = this.getNextWsServer(true);
                    this.reconnectionAttempts = 0;
                    return [4 /*yield*/, this.connect()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3:
                    if (this.noAvailableServers()) {
                        this.logger.warn('no available ws servers left - going to closed state');
                        this.status = C.STATUS_CLOSED;
                        this.emit('closed');
                        this.resetServerErrorStatus();
                        this.server = this.getNextWsServer(true);
                        this.__clearSwitchBackTimer();
                        return [2 /*return*/];
                    }
                    if (!this.isConnected()) return [3 /*break*/, 6];
                    this.logger.warn('attempted to reconnect while connected - forcing disconnect');
                    return [4 /*yield*/, this.disconnect({ force: true })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, this.reconnect()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
                case 6:
                    randomMinInterval = (this.configuration.reconnectionTimeout - 2) * 1000;
                    randomMaxInterval = (this.configuration.reconnectionTimeout + 2) * 1000;
                    this.reconnectionAttempts += 1;
                    this.nextReconnectInterval = this.computeRandomTimeout(this.reconnectionAttempts, randomMinInterval, randomMaxInterval);
                    if (!(this.reconnectionAttempts > this.configuration.maxReconnectionAttempts)) return [3 /*break*/, 8];
                    this.logger.warn('maximum reconnection attempts for WebSocket ' + this.server.wsUri);
                    this.logger.warn('transport ' + this.server.wsUri + " failed | connection state set to 'error'");
                    this.server.isError = true;
                    this.emit('transportError');
                    this.server = this.getNextWsServer();
                    this.reconnectionAttempts = 0;
                    return [4 /*yield*/, this.reconnect()];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    this.logger.warn('trying to reconnect to WebSocket ' +
                        this.server.wsUri +
                        ' (reconnection attempt ' +
                        this.reconnectionAttempts +
                        ')');
                    this.reconnectTimer = setTimeout(function () {
                        _this.connect();
                        _this.reconnectTimer = undefined;
                    }, this.nextReconnectInterval);
                    this.logger.warn('next reconnection attempt in:' + Math.round(this.nextReconnectInterval / 1000) + ' seconds.');
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
function isSipErrorCode(message) {
    var statusLine = message.substring(0, message.indexOf('\r\n'));
    var statusCode = statusLine.split(' ')[1];
    return statusCode && this.sipErrorCodes && this.sipErrorCodes.length && this.sipErrorCodes.includes(statusCode);
}
function scheduleSwitchBackMainProxy() {
    var _this = this;
    var randomInterval = 15 * 60 * 1000; //15 min
    var switchBackInterval = this.switchBackInterval ? this.switchBackInterval * 1000 : null;
    // Add random time to expand clients connections in time;
    if (switchBackInterval) {
        switchBackInterval += this.computeRandomTimeout(1, 0, randomInterval);
        this.logger.warn('Try to switch back to main proxy after ' + Math.round(switchBackInterval / 1000 / 60) + ' min');
        this.mainProxy.switchBackTimer = setTimeout(function () {
            _this.mainProxy.isError = false;
            _this.mainProxy.switchBackTimer = null;
            _this.logger.warn('switchBack initiated');
            _this.emit('switchBackProxy');
        }, switchBackInterval);
    }
    else {
        this.logger.warn('switchBackInterval is not set. Will be switched with next provision update ');
    }
}
function onSipErrorCode() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.logger.warn('Error received from the server. Disconnecting from the proxy');
                    this.server.isError = true;
                    this.emit('transportError');
                    return [4 /*yield*/, this.disconnect({ force: true })];
                case 1:
                    _a.sent();
                    this.server = this.getNextWsServer();
                    this.reconnectionAttempts = 0;
                    return [2 /*return*/, this.reconnect()];
            }
        });
    });
}
function __isCurrentMainProxy() {
    return this.server === this.configuration.wsServers[0];
}
function __clearSwitchBackTimer() {
    if (this.mainProxy.switchBackTimer) {
        clearTimeout(this.mainProxy.switchBackTimer);
        this.mainProxy.switchBackTimer = null;
    }
}
function __onConnectedToMain() {
    this.__clearSwitchBackTimer();
}
function __onConnectedToBackup() {
    if (!this.mainProxy.switchBackTimer) {
        this.scheduleSwitchBackMainProxy();
    }
}
function __afterWSConnected() {
    this.__isCurrentMainProxy() ? this.__onConnectedToMain() : this.__onConnectedToBackup();
}
//# sourceMappingURL=sipTransportConstructor.js.map