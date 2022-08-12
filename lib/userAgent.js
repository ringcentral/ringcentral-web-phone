"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchUserAgent = void 0;
var audioHelper_1 = require("./audioHelper");
var session_1 = require("./session");
var sipTransportConstructor_1 = require("./sipTransportConstructor");
exports.patchUserAgent = function (userAgent, sipInfo, options, id) {
    userAgent.defaultHeaders = ['P-rc-endpoint-id: ' + id, 'Client-id:' + options.appKey];
    userAgent.media = {};
    userAgent.enableQos = options.enableQos;
    userAgent.enableMediaReportLogging = options.enableMediaReportLogging;
    userAgent.qosCollectInterval = options.qosCollectInterval || 5000;
    if (options.media && (options.media.remote && options.media.local)) {
        userAgent.media.remote = options.media.remote;
        userAgent.media.local = options.media.local;
    }
    else
        userAgent.media = null;
    userAgent.sipInfo = sipInfo;
    userAgent.__invite = userAgent.invite;
    userAgent.invite = invite.bind(userAgent);
    userAgent.__register = userAgent.register;
    userAgent.register = register.bind(userAgent);
    userAgent.__unregister = userAgent.unregister;
    userAgent.unregister = unregister.bind(userAgent);
    userAgent.switchFrom = switchFrom.bind(userAgent);
    userAgent.qosStatsCallback = options.qosStatsCallback;
    userAgent.audioHelper = new audioHelper_1.AudioHelper(options.audioHelper);
    userAgent.__transportConstructor = userAgent.configuration.transportConstructor;
    userAgent.configuration.transportConstructor = sipTransportConstructor_1.TransportConstructorWrapper(userAgent.__transportConstructor, options);
    userAgent.onSession = options.onSession || null;
    userAgent.createRcMessage = createRcMessage;
    userAgent.sendMessage = sendMessage;
    userAgent.__onTransportConnected = userAgent.onTransportConnected;
    userAgent.onTransportConnected = onTransportConnected.bind(userAgent);
    userAgent.on('invite', function (session) {
        userAgent.audioHelper.playIncoming(true);
        session_1.patchSession(session);
        session_1.patchIncomingSession(session);
        session.logger.log('UA recieved incoming call invite');
        session._sendReceiveConfirmPromise = session
            .sendReceiveConfirm()
            .then(function () {
            session.logger.log('sendReceiveConfirm success');
        })
            .catch(function (error) {
            session.logger.error('failed to send receive confirmation via SIP MESSAGE due to ' + error);
        });
    });
    userAgent.on('registrationFailed', function (e) {
        // Check the status of message is in sipErrorCodes and disconnecting from server if it so;
        if (!e) {
            return;
        }
        var message = e.data || e;
        if (message && typeof message === 'string' && userAgent.transport.isSipErrorCode(message)) {
            userAgent.transport.onSipErrorCode();
        }
        userAgent.logger.warn('UA Registration Failed');
    });
    userAgent.on('notify', function (_a) {
        var request = _a.request;
        var event = request && request.headers && request.headers.Event && request.headers.Event[0];
        if (event && event.raw === 'check-sync') {
            userAgent.emit('provisionUpdate');
        }
        userAgent.logger.log('UA recieved notify');
    });
    userAgent.start();
    return userAgent;
};
/*--------------------------------------------------------------------------------------------------------------------*/
function onTransportConnected() {
    if (this.configuration.register) {
        return this.register();
    }
}
/*--------------------------------------------------------------------------------------------------------------------*/
function createRcMessage(options) {
    options.body = options.body || '';
    return ('<Msg>' +
        '<Hdr SID="' +
        options.sid +
        '" Req="' +
        options.request +
        '" From="' +
        options.from +
        '" To="' +
        options.to +
        '" Cmd="' +
        options.reqid +
        '"/> ' +
        '<Bdy Cln="' +
        this.sipInfo.authorizationId +
        '" ' +
        options.body +
        '/>' +
        '</Msg>');
}
/*--------------------------------------------------------------------------------------------------------------------*/
function sendMessage(to, messageData) {
    var userAgent = this;
    var sipOptions = {};
    sipOptions.contentType = 'x-rc/agent';
    sipOptions.extraHeaders = [];
    sipOptions.extraHeaders.push('P-rc-ws: ' + this.contact);
    return new Promise(function (resolve, reject) {
        var message = userAgent.message(to, messageData, sipOptions);
        message.once('accepted', function (response, cause) { return resolve(response); });
        message.once('failed', function (response, cause) { return reject(new Error(cause)); });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function register(options) {
    if (options === void 0) { options = {}; }
    return this.__register.call(this, __assign(__assign({}, options), { extraHeaders: __spreadArrays((options.extraHeaders || []), this.defaultHeaders) }));
}
/*--------------------------------------------------------------------------------------------------------------------*/
function unregister(options) {
    if (options === void 0) { options = {}; }
    return this.__unregister.call(this, __assign(__assign({}, options), { extraHeaders: __spreadArrays((options.extraHeaders || []), this.defaultHeaders) }));
}
function invite(number, options) {
    if (options === void 0) { options = {}; }
    options.extraHeaders = (options.extraHeaders || []).concat(this.defaultHeaders);
    options.extraHeaders.push('P-Asserted-Identity: sip:' + (options.fromNumber || this.sipInfo.username) + '@' + this.sipInfo.domain //FIXME Phone Number
    );
    //FIXME Backend should know it already
    if (options.homeCountryId) {
        options.extraHeaders.push('P-rc-country-id: ' + options.homeCountryId);
    }
    options.RTCConstraints = options.RTCConstraints || {
        optional: [{ DtlsSrtpKeyAgreement: 'true' }]
    };
    this.audioHelper.playOutgoing(true);
    this.logger.log('Invite to ' + number + ' created with playOutgoing set to true');
    return session_1.patchSession(this.__invite(number, options));
}
/**
 * Support to switch call from other device to current web phone device
 * need active call information from details presence API for switching
 * https://developers.ringcentral.com/api-reference/Detailed-Extension-Presence-with-SIP-Event
 */
function switchFrom(activeCall, options) {
    if (options === void 0) { options = {}; }
    var replaceHeaders = [];
    replaceHeaders.push("Replaces: " + activeCall.id + ";to-tag=" + activeCall.sipData.fromTag + ";from-tag=" + activeCall.sipData.toTag);
    replaceHeaders.push('RC-call-type: replace');
    var toNumber = activeCall.direction === 'Outbound' ? activeCall.to : activeCall.from;
    var fromNumber = activeCall.direction === 'Outbound' ? activeCall.from : activeCall.to;
    options.extraHeaders = (options.extraHeaders || []).concat(replaceHeaders);
    options.fromNumber = options.fromNumber || fromNumber;
    return this.invite(toNumber, options);
}
//# sourceMappingURL=userAgent.js.map