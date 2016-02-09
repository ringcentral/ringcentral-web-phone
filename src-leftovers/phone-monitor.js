//angular.module( 'activeCallMonitor' ).factory( 'webphoneCallMonitor', function( $rootScope, $timeout, rcSIPUA, audio, customAlert, utils, settingsService, rcPlatform, DEFAULT_CALL_STATUS )
'use strict';

var EventEmitter = require('./emitter');
var rcSIPUA = require('./web-phone');
var settingsService = require('./settingsService');
var utils = require('./utils');
var audio = require('./audio');
var rcPlatform = require('./platform');

var eventScope = new EventEmitter();

var inboundCalls = {};
var outboundCalls = {};

var activeCallsCount = 0;

/*
 Sound handling
 --------------
 */
function __playSound(fn, url, val, volume) {
    if (!fn.__audio) {
        if (val) {
            volume !== undefined && (audio.volume = volume);
            fn.__audio = audio.play(url, {
                loop: true
            });
        }
    }
    else {
        if (val) {
            fn.__audio.reset();
        }
        else {
            fn.__audio.stop();
        }
    }
}

function playIncoming(val) {
    __playSound(playIncoming, 'audio/incoming.ogg', val, 0.5);
}

function playOutgoing(val) {
    __playSound(playOutgoing, 'audio/outgoing.ogg', val, 1);
}

rcSIPUA.on(rcSIPUA.events.incomingCall, function() {
    playIncoming(true);
});

rcSIPUA.on(rcSIPUA.events.outgoingCall, function() {
    playOutgoing(true);
});

rcSIPUA.on(rcSIPUA.events.callProgress, function(session) {
    if (session.hasEarlyMedia()) {
        playOutgoing(false);
    }
});

rcSIPUA.on([rcSIPUA.events.callStarted, rcSIPUA.events.callRejected, rcSIPUA.events.callEnded, rcSIPUA.events.callFailed], function() {
    playIncoming(false);
    playOutgoing(false);
});
/* --------------------- */

function normalize(number) {
    //FIXME Platform usage
    var countryCode = settingsService.countryCode;
    //return rcPlatform.api.phoneParser([utils.normalizeNumberForParser(number)], {country: countryCode})
    //    .then(function(parsedNumbers) {
    //        return parsedNumbers[0] || number;
    //    });
    return Promise.resolve(number);
}

function Call(call, type, inbound) {
    var contact = call.getContact();
    if (inbound) {
        this.from = contact.number;
    }
    else {
        this.to = contact.number;
    }
    this.contactName = contact.name;
    this.sessionId = call.sessionId;
    this.type = type;

    this.isOnRecord = function() {
        return call.isOnRecord();
    };
    this.forward = function(number) {
        normalize(number).then(function(n) { call.forward(n); });
    };
    this.transfer = function(number) {
        normalize(number).then(function(n) { rcSIPUA.transfer(call, n); });
    };
    this.recordingDisabled = false;
    this.record = function(value) {
        var self = this;
        self.recordingDisabled = true;
        call.record(value).finally(function() {
            self.recordingDisabled = false;
        });
    };
    this.answer = function() {
        rcSIPUA.answer(call);
    };
    this.hangup = function() {
        rcSIPUA.hangup(call);
    };
    this.hold = function() {
        //unmute call if it was mute before hold
        if (call.isOnMute()) {
            this.mute();
        }
        !call.isOnHold() ? rcSIPUA.hold(call) : rcSIPUA.unhold(call);
    };
    this.mute = function() {
        //mute will not work if on hold
        if (call.isOnHold()) return;
        !call.isOnMute() ? rcSIPUA.mute(call) : rcSIPUA.unmute(call);
    };
    this.flip = function(target) {
        normalize(target).then(function(n) { call.flip(n); });
    };
    this.clone = function(){
        return new Call(call, type, inbound); //FIXME utils.copy
    };
}

rcSIPUA.on(rcSIPUA.events.outgoingCall, function(call) {
    var sessionId = call.getId();
    outboundCalls[sessionId] = new Call(call, 'sip', false);
    outboundCalls[sessionId].callStatus = 'Calling';
    update();
});

rcSIPUA.on(rcSIPUA.events.incomingCall, function(call) {
    var sessionId = call.getId();
    inboundCalls[sessionId] = new Call(call, 'sip', true);
    inboundCalls[sessionId].callStatus = 'Calling';
    update();
});

rcSIPUA.on(rcSIPUA.events.callHold, function(call) {
    var sessionId = call.getId();
    if (outboundCalls[sessionId])outboundCalls[sessionId].callStatus = 'OnHold';
    if (inboundCalls[sessionId])inboundCalls[sessionId].callStatus = 'OnHold';
    update();
});

rcSIPUA.on(rcSIPUA.events.callMute, function(call) {
    var sessionId = call.getId();
    if (outboundCalls[sessionId])outboundCalls[sessionId].callStatus = 'OnMute';
    if (inboundCalls[sessionId])inboundCalls[sessionId].callStatus = 'OnMute';
    update();
});

rcSIPUA.on([rcSIPUA.events.callUnhold, rcSIPUA.events.callUnmute], function(call) {
    var sessionId = call.getId();
    if (outboundCalls[sessionId])outboundCalls[sessionId].callStatus = 'CallConnected';//'CalleeConnected';
    if (inboundCalls[sessionId])inboundCalls[sessionId].callStatus = 'CallConnected';
    update();
});

rcSIPUA.on(rcSIPUA.events.callProgress, function(call) {
    var sessionId = call.getId();
    if (outboundCalls[sessionId])outboundCalls[sessionId].callStatus = 'CallerConnected';
    if (inboundCalls[sessionId])inboundCalls[sessionId].callStatus = 'CallerConnecting';
    update();
});

rcSIPUA.on(rcSIPUA.events.callStarted, function(call) {
    var sessionId = call.getId();
    if (outboundCalls[sessionId])outboundCalls[sessionId].callStatus = 'CallConnected';//'CalleeConnected';
    if (inboundCalls[sessionId])inboundCalls[sessionId].callStatus = 'CallConnected';
    update();
});

rcSIPUA.on(rcSIPUA.events.callFailed, function(call) {
    var sessionId = call.getId();
    if (outboundCalls[sessionId])outboundCalls[sessionId].callStatus = 'NoCall';
    if (inboundCalls[sessionId])inboundCalls[sessionId].callStatus = 'NoCall';
    update();
    setTimeout(update.bind(this, true), 1500);
});

rcSIPUA.on(rcSIPUA.events.callEnded, function(call) {
    var sessionId = call.getId();
    if (outboundCalls[sessionId])outboundCalls[sessionId].callStatus = 'NoCall';
    if (inboundCalls[sessionId])inboundCalls[sessionId].callStatus = 'NoCall';
    update();
    setTimeout(update.bind(this, true), 1500);
});

rcSIPUA.on(rcSIPUA.events.callFailed, function(call, e, cause) {
    var goodCauses = [
        rcSIPUA.causes.CANCELED,
        rcSIPUA.causes.BUSY,
        rcSIPUA.causes.REJECTED,
        rcSIPUA.causes.NO_ANSWER,
        rcSIPUA.reasons['486']	//486 Busy Here is considered failure by
    ];
    if (goodCauses.indexOf(cause) === -1) {
        alert('SIP Error: \n\n' + (e && e.data && e.data.cause || cause || 'Unknown')); //FIXME Alert
    }
});

rcSIPUA.on(rcSIPUA.events.callReplaced, function(newCall, oldCall) {
    var originalSessionId = oldCall.getId();
    if (outboundCalls[originalSessionId]) outboundCalls[originalSessionId].callStatus = 'Replaced';
    if (inboundCalls[originalSessionId]) inboundCalls[originalSessionId].callStatus = 'Replaced';

    var newSessionId = newCall.getId();
    inboundCalls[newSessionId] = new Call(newCall, 'sip', true);
    inboundCalls[newSessionId].callStatus = 'CallConnected';

    update();
});

rcSIPUA.on(rcSIPUA.events.sipRegistrationFailed, function(e) {
    var reason = e && e.reason_phrase || 'Unknown';
    alert('SIP Registration Error: \n\n' + reason); //FIXME Alert
});


function update(forceStart) {
    var _activeCallsCount = 0;
    var start = false;
    var stop = false;

    //FIXME Unsafe
    for (var id in outboundCalls)if (outboundCalls[id].callStatus != 'NoCall')_activeCallsCount++;
    for (var id in inboundCalls)if (inboundCalls[id].callStatus != 'NoCall')_activeCallsCount++;

    if (_activeCallsCount === 0 && activeCallsCount !== 0)stop = true;
    if (_activeCallsCount !== 0 && activeCallsCount === 0)start = true;

    if (stop)eventScope.emit('stop');
    if (start)eventScope.emit('start');

    activeCallsCount = _activeCallsCount;

    var _inboundCalls = [];
    var _outboundCalls = [];

    if (start || !!forceStart) {
        for (var id in outboundCalls)if (outboundCalls[id].callStatus == 'NoCall')delete outboundCalls[id];
        for (var id in inboundCalls)if (inboundCalls[id].callStatus == 'NoCall')delete inboundCalls[id];
    }

    for (var id in outboundCalls)_outboundCalls.push(outboundCalls[id].clone());
    for (var id in inboundCalls)_inboundCalls.push(inboundCalls[id].clone());

    eventScope.emit('update', {"inboundCalls": _inboundCalls, "outboundCalls": _outboundCalls});
}

module.exports = {
    "onStop": function(listener) { if (typeof listener == 'function')eventScope.on('stop', listener); },
    "onStart": function(listener) { if (typeof listener == 'function')eventScope.on('start', listener); },
    "onUpdate": function(listener) { if (typeof listener == 'function')eventScope.on('update', function(d) { listener(d); }); }
};
