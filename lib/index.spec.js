"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("./index"));
var ringcentral_1 = __importDefault(require("ringcentral"));
var sip_js_1 = require("sip.js");
var TEST_TIMEOUT = 60000;
var DB_DELAY = 5000; // 5 sec delay to allow records to propagate in DB so that phone will be able to be called
var REGISTRATION_TIMEOUT = 15000;
describe('RingCentral.WebPhone', function () {
    var env = window['__karma__'].config.env; //TODO Autocomplete
    [
        'RC_WP_RECEIVER_USERNAME',
        'RC_WP_RECEIVER_PASSWORD',
        'RC_WP_RECEIVER_APPKEY',
        'RC_WP_RECEIVER_APPSECRET',
        'RC_WP_RECEIVER_SERVER',
        'RC_WP_CALLER_USERNAME',
        'RC_WP_CALLER_PASSWORD',
        'RC_WP_CALLER_APPKEY',
        'RC_WP_CALLER_APPSECRET',
        'RC_WP_CALLER_SERVER'
    ].forEach(function (key) {
        if (!env[key])
            throw new Error('Environment variable ' + key + 'was not set');
    });
    jasmine.DEFAULT_TIMEOUT_INTERVAL = TEST_TIMEOUT;
    var receiver = {
        username: env.RC_WP_RECEIVER_USERNAME,
        password: env.RC_WP_RECEIVER_PASSWORD,
        appKey: env.RC_WP_RECEIVER_APPKEY,
        appSecret: env.RC_WP_RECEIVER_APPSECRET,
        server: env.RC_WP_RECEIVER_SERVER
    };
    var caller = {
        username: env.RC_WP_CALLER_USERNAME,
        password: env.RC_WP_CALLER_PASSWORD,
        appKey: env.RC_WP_CALLER_APPKEY,
        appSecret: env.RC_WP_CALLER_APPSECRET,
        server: env.RC_WP_CALLER_SERVER
    };
    var session; // each test should use this for storing session object for proper cleanup
    var callerSdk;
    var callerExtension;
    var callerPhone;
    var receiverSdk;
    var receiverExtension;
    var receiverPhone;
    var acceptOptions;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.all([createSdk(caller), createSdk(receiver)])];
                case 1:
                    _a = _d.sent(), callerSdk = _a[0], receiverSdk = _a[1];
                    return [4 /*yield*/, Promise.all([getExtension(callerSdk), getExtension(receiverSdk)])];
                case 2:
                    _b = _d.sent(), callerExtension = _b[0], receiverExtension = _b[1];
                    return [4 /*yield*/, Promise.all([
                            createWebPhone(callerSdk, caller, 'caller'),
                            createWebPhone(receiverSdk, receiver, 'receiver')
                        ])];
                case 3:
                    _c = _d.sent(), callerPhone = _c[0], receiverPhone = _c[1];
                    acceptOptions = getAcceptOptions(caller.username, callerExtension.regionalSettings.homeCountry.id);
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () {
        session = null;
    });
    it('starts and stops recording', function () { return __awaiter(_this, void 0, void 0, function () {
        var receiverSession;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    session = callerPhone.userAgent.invite(receiver.username, acceptOptions);
                    return [4 /*yield*/, onInvite(receiverPhone)];
                case 1:
                    receiverSession = _a.sent();
                    return [4 /*yield*/, receiverSession.accept()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, session.mute()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, receiverSession.mute()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, index_1.default.delay(1000)];
                case 5:
                    _a.sent(); //FIXME No idea why we can't record the call right away
                    return [4 /*yield*/, session.startRecord()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, session.stopRecord()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () {
        checkSessionStatus(session) && session.bye();
    });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = callerPhone;
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, callerPhone.userAgent.unregister()];
                case 1:
                    _a = (_c.sent());
                    _c.label = 2;
                case 2:
                    _a;
                    _b = receiverPhone;
                    if (!_b) return [3 /*break*/, 4];
                    return [4 /*yield*/, receiverPhone.userAgent.unregister()];
                case 3:
                    _b = (_c.sent());
                    _c.label = 4;
                case 4:
                    _b;
                    return [2 /*return*/];
            }
        });
    }); });
});
var onInvite = function (receverPhone) {
    return new Promise(function (resolve) { return receverPhone.userAgent.once('invite', function (receoverSession) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, resolve(receoverSession)];
    }); }); }); });
};
var getAcceptOptions = function (fromNumber, homeCountryId) { return ({
    fromNumber: fromNumber,
    homeCountryId: homeCountryId
}); };
var checkSessionStatus = function (session) {
    return session &&
        session.status !== sip_js_1.Session.C.STATUS_NULL &&
        session.status !== sip_js_1.Session.C.STATUS_TERMINATED &&
        session.status !== sip_js_1.Session.C.STATUS_CANCELED;
};
var createSdk = function (credentials) { return __awaiter(_this, void 0, void 0, function () {
    var sdk;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sdk = new ringcentral_1.default({
                    appKey: credentials.appKey,
                    appSecret: credentials.appSecret,
                    server: credentials.server,
                    cachePrefix: credentials.username
                });
                return [4 /*yield*/, sdk.platform().login({
                        username: credentials.username,
                        extension: credentials.extension || null,
                        password: credentials.password
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, sdk];
        }
    });
}); };
var getExtension = function (sdk) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, sdk.platform().get('/restapi/v1.0/account/~/extension/~')];
        case 1: return [2 /*return*/, (_a.sent()).json()];
    }
}); }); };
var createWebPhone = function (sdk, credentials, id) { return __awaiter(_this, void 0, void 0, function () {
    var uaId, remote, local, data, webPhone;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                uaId = 'UserAgent [' + id + '] event:';
                remote = document.createElement('video');
                remote.hidden = true;
                local = document.createElement('video');
                local.hidden = true;
                local.muted = true;
                document.body.appendChild(remote);
                document.body.appendChild(local);
                return [4 /*yield*/, sdk.platform().post('/client-info/sip-provision', {
                        sipInfo: [
                            {
                                transport: 'WSS'
                            }
                        ]
                    })];
            case 1: return [4 /*yield*/, (_a.sent()).json()];
            case 2:
                data = _a.sent();
                webPhone = new index_1.default(data, {
                    appKey: credentials.appKey,
                    uuid: index_1.default.uuid(),
                    audioHelper: {
                        enabled: true
                    },
                    logLevel: 1,
                    media: {
                        remote: remote,
                        local: local
                    },
                    enableQos: true,
                    onSession: function (session) {
                        var sessionId = 'Session [' + id + '] event:';
                        console.log('Binding to session', id);
                        session.on('accepted', function () { return console.log(sessionId, 'Accepted'); });
                        session.on('progress', function () { return console.log(sessionId, 'Progress'); });
                        session.on('rejected', function () { return console.log(sessionId, 'Rejected'); });
                        session.on('failed', function () { return console.log(sessionId, 'Failed'); });
                        session.on('terminated', function () { return console.log(sessionId, 'Terminated'); });
                        session.on('cancel', function () { return console.log(sessionId, 'Cancel'); });
                        session.on('replaced', function (newSession) {
                            return console.log(sessionId, 'Replaced', 'old session', session, 'has been replaced with', newSession);
                        });
                        session.on('dtmf', function () { return console.log(sessionId, 'DTMF'); });
                        session.on('muted', function () { return console.log(sessionId, 'Muted'); });
                        session.on('unmuted', function () { return console.log(sessionId, 'Unmuted'); });
                        session.on('connecting', function () { return console.log(sessionId, 'Connecting'); });
                        session.on('bye', function () { return console.log(sessionId, 'Bye'); });
                    }
                });
                webPhone.userAgent.audioHelper.loadAudio({
                    incoming: '/base/audio/incoming.ogg',
                    outgoing: '/base/audio/outgoing.ogg'
                });
                webPhone.userAgent.on('unregistered', function () { return console.log(uaId, 'Unregistered'); });
                webPhone.userAgent.on('message', function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return console.log(uaId, 'Message', args);
                });
                webPhone.userAgent.on('invite', function () { return console.log(uaId, 'Invite'); });
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        console.log(uaId, 'Registering', webPhone.userAgent.defaultHeaders[0]);
                        webPhone.userAgent.once('registered', function () {
                            console.log(uaId, 'Registered event delayed');
                            setTimeout(function () {
                                console.log(uaId, 'Registered');
                                resolve(webPhone);
                            }, DB_DELAY);
                        });
                        webPhone.userAgent.once('registrationFailed', function (e) {
                            var args = [];
                            for (var _i = 1; _i < arguments.length; _i++) {
                                args[_i - 1] = arguments[_i];
                            }
                            console.error(uaId, 'UA RegistrationFailed', e, args);
                            //FIXME For some reason test fail with network error first time, ignoring once
                            webPhone.userAgent.once('registrationFailed', function (e) {
                                var args = [];
                                for (var _i = 1; _i < arguments.length; _i++) {
                                    args[_i - 1] = arguments[_i];
                                }
                                console.error(uaId, 'UA RegistrationFailed', e, args);
                                reject(new Error('UA RegistrationFailed'));
                            });
                        });
                        setTimeout(function () { return reject(new Error('Registration timeout')); }, REGISTRATION_TIMEOUT);
                    })];
        }
    });
}); };
//# sourceMappingURL=index.spec.js.map