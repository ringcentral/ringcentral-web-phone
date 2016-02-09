'use strict';

var audio = require('./audio');

function AudioHelper(rcSIPUA, options) {

    var self = this;

    options = options || {};

    this._rcSIPUA = rcSIPUA;
    this._incoming = options.incoming || 'audio/incoming.ogg';
    this._outgoing = options.outgoing || 'audio/outgoing.ogg';

    rcSIPUA.on(rcSIPUA.events.incomingCall, function() {
        self.playIncoming(true);
    });

    rcSIPUA.on(rcSIPUA.events.outgoingCall, function() {
        self.playOutgoing(true);
    });

    rcSIPUA.on(rcSIPUA.events.callProgress, function(session) {
        if (session.hasEarlyMedia()) {
            self.playOutgoing(false);
        }
    });

    rcSIPUA.on([rcSIPUA.events.callStarted, rcSIPUA.events.callRejected, rcSIPUA.events.callEnded, rcSIPUA.events.callFailed], function() {
        self.playIncoming(false);
        self.playOutgoing(false);
    });

}

AudioHelper.prototype._playSound = function(url, val, volume) {

    if (!this._audio) {
        if (val) {
            volume !== undefined && (audio.volume = volume);
            this._audio = audio.play(url, {loop: true});
        }
    } else {
        if (val) {
            this._audio.reset();
        }
        else {
            this._audio.stop();
        }
    }

};

AudioHelper.prototype.playIncoming = function(val) {
    this._playSound(this._incoming, val, 0.5);
};

AudioHelper.prototype.playOutgoing = function(val) {
    this._playSound(this._outgoing, val, 1);
};

module.exports = AudioHelper;

