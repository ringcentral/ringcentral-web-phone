(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['sip.js'], function(SIP) {
            return factory(SIP);
        });
    } else if (typeof module === 'object') {
        module.exports = factory(require('sip.js'));
        module.exports.default = module.exports; //ES6
    } else {
        root.RingCentral = root.RingCentral || {};
        root.RingCentral.WebPhone = factory(root.SIP);
    }
}(this, function(SIP) {

    var messages = {
        park: {reqid: 1, command: 'callpark'},
        startRecord: {reqid: 2, command: 'startcallrecord'},
        stopRecord: {reqid: 3, command: 'stopcallrecord'},
        flip: {reqid: 3, command: 'callflip', target: ''},
        monitor: {reqid: 4, command: 'monitor'},
        barge: {reqid: 5, command: 'barge'},
        whisper: {reqid: 6, command: 'whisper'},
        takeover: {reqid: 7, command: 'takeover'}
    };

    var responseTimeout = 10000;

    function uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function delay(ms) {
        return new Promise(function(resolve, reject) {
            setTimeout(resolve, ms);
        });
    }

    function extend(dst, src) {
        src = src || {};
        dst = dst || {};
        Object.keys(src).forEach(function(k) {
            dst[k] = src[k];
        });
        return dst;
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @param options
     * @constructor
     */
    function AudioHelper(options) {

        options = options || {};

        this._enabled = !!options.enabled;
        this._incoming = options.incoming || '../audio/incoming.ogg';
        this._outgoing = options.outgoing || '../audio/outgoing.ogg';
        this._audio = {};

    }

    AudioHelper.prototype._playSound = function(url, val, volume) {

        if (!this._enabled) return this;

        if (!this._audio[url]) {
            if (val) {
                this._audio[url] = new Audio();
                this._audio[url].src = url;
                this._audio[url].loop = true;
                this._audio[url].volume = volume;
                this._audio[url].play();
            }
        } else {
            if (val) {
                this._audio[url].currentTime = 0;
                this._audio[url].play();
            } else {
                this._audio[url].pause();
            }
        }

        return this;

    };

    AudioHelper.prototype.playIncoming = function(val) {
        return this._playSound(this._incoming, val, 0.5);
    };

    AudioHelper.prototype.playOutgoing = function(val) {
        return this._playSound(this._outgoing, val, 1);
    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    function WebPhone(regData, options) {

        regData = regData || {};
        options = options || {};

        this.sipInfo = regData.sipInfo[0] || regData.sipInfo;
        this.sipFlags = regData.sipFlags;

        var id = options.uuid || localStorage.getItem('rc-webPhone-uuid') || uuid(); //TODO Make configurable
        localStorage.setItem('rc-webPhone-uuid', id);

        this.endpointHeader = 'P-rc-endpoint-id: ' + id;

        var configuration = {
            uri: 'sip:' + this.sipInfo.username + '@' + this.sipInfo.domain,
            wsServers: this.sipInfo.outboundProxy && this.sipInfo.transport
                ? this.sipInfo.transport.toLowerCase() + '://' + this.sipInfo.outboundProxy
                : this.sipInfo.wsServers,
            authorizationUser: this.sipInfo.authorizationId,
            password: this.sipInfo.password,
            traceSip: true,
            stunServers: this.sipInfo.stunServers || ['stun:74.125.194.127:19302'], //FIXME Hardcoded?
            turnServers: [],
            log: {
                level: options.logLevel || 1 //FIXME LOG LEVEL 3
            },
            domain: this.sipInfo.domain,
            autostart: true,
            register: true,
            iceGatheringTimeout: this.sipInfo.iceGatheringTimeout || 3000
        };

        this.appKey = options.appKey;
        this.appName = options.appName;
        this.appVersion = options.appVersion;
        this.userAgentHeader = 'RC-User-Agent: ' +
                               (options.appName ? (options.appName + (options.appVersion ? '/' + options.appVersion : '')) + ' ' : '') +
                               'RCWEBPHONE/' + WebPhone.version;

        this.clientIdHeader = 'Client-id:' + options.appKey;

        this.userAgent = new SIP.UA(configuration).register({
            extraHeaders: [
                this.endpointHeader,
                this.userAgentHeader,
                this.clientIdHeader
            ]
        });

        this.userAgent.endpointHeader = this.endpointHeader;
        this.userAgent.userAgentHeader = this.userAgentHeader;
        this.userAgent.clientIdHeader = this.clientIdHeader;
        this.userAgent.sipInfo = this.sipInfo;

        this.userAgent.__invite = this.userAgent.invite;
        this.userAgent.invite = invite;

        this.userAgent.on('invite', function(session) {
            this.userAgent.audioHelper.playIncoming(true);
            patchSession(session);
        }.bind(this));

        this.userAgent.audioHelper = new AudioHelper(options.audioHelper);

    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    WebPhone.version = '0.3.0';
    WebPhone.uuid = uuid;
    WebPhone.delay = delay;
    WebPhone.extend = extend;

    /*--------------------------------------------------------------------------------------------------------------------*/

    function patchSession(session) {

        if (session.__patched) return session;

        session.__patched = true;

        session.__sendRequest = session.sendRequest;
        session.__receiveRequest = session.receiveRequest;
        session.__receiveInviteResponse = session.receiveInviteResponse;
        session.__receiveResponse = session.receiveResponse;
        session.__sendReinvite = session.sendReinvite;
        session.__accept = session.accept;
        session.__hold = session.hold;
        session.__unhold = session.unhold;
        session.__dtmf = session.dtmf;

        session.sendRequest = sendRequest;
        session.receiveRequest = receiveRequest;
        session.receiveInviteResponse = receiveInviteResponse;
        session.receiveResponse = receiveResponse;
        session.sendReinvite = sendReinvite;
        session.accept = accept;
        session.hold = hold;
        session.unhold = unhold;
        session.dtmf = dtmf;

        session.blindTransfer = blindTransfer;
        session.transfer = transfer;
        session.park = park;
        session.forward = forward;
        session.startRecord = startRecord;
        session.stopRecord = stopRecord;
        session.flip = flip;

        session.on('replaced', patchSession);
        // session.on('connecting', onConnecting);

        // Audio
        session.on('accepted', stopPlaying);
        session.on('rejected', stopPlaying);
        session.on('bye', stopPlaying);
        session.on('terminated', stopPlaying);
        session.on('cancel', stopPlaying);
        session.on('failed', stopPlaying);
        session.on('replaced', stopPlaying);
        session.mediaHandler.on('iceConnectionCompleted', stopPlaying);
        session.mediaHandler.on('iceConnectionFailed', stopPlaying);

        function stopPlaying() {
            console.warn('STOPPED PLAYING');
            session.ua.audioHelper.playOutgoing(false);
            session.ua.audioHelper.playIncoming(false);
            session.removeListener('accepted', stopPlaying);
            session.removeListener('rejected', stopPlaying);
            session.removeListener('bye', stopPlaying);
            session.removeListener('terminated', stopPlaying);
            session.removeListener('cancel', stopPlaying);
            session.removeListener('failed', stopPlaying);
            session.removeListener('replaced', stopPlaying);
            session.mediaHandler.removeListener('iceConnectionCompleted', stopPlaying);
            session.mediaHandler.removeListener('iceConnectionFailed', stopPlaying);
        }

        return session;

    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @private
     * @param {SIP.Session} session
     * @param {object} command
     * @param {object} [options]
     * @return {Promise}
     */
    function sendReceive(session, command, options) {

        options = options || {};

        extend(command, options);

        var cseq = null;

        return new Promise(function(resolve, reject) {

            session.sendRequest(SIP.C.INFO, {
                body: JSON.stringify({
                    request: command
                }),
                extraHeaders: [
                    "Content-Type: application/json;charset=utf-8",
                    session.ua.userAgentHeader,
                    session.ua.endpointHeader,
                    session.ua.clientIdHeader
                ],
                receiveResponse: function(response) {
                    var timeout = null;
                    if (response.status_code === 200) {
                        cseq = response.cseq;
                        var onInfo = function(request) {
                            if (response.cseq === cseq) {

                                var body = request && request.body || '{}';
                                var obj;

                                try {
                                    obj = JSON.parse(body);
                                } catch (e) {
                                    obj = {};
                                }

                                if (obj.response && obj.response.command === command.command) {
                                    if (obj.response.result) {
                                        if (obj.response.result.code == 0) {
                                            return resolve(obj.response.result);
                                        } else {
                                            return reject(obj.response.result);
                                        }
                                    }
                                }
                                timeout && clearTimeout(timeout);
                                session.removeListener('RC_SIP_INFO', onInfo);
                                resolve(null); //FIXME What to resolve
                            }
                        };

                        timeout = setTimeout(function() {
                            reject(new Error('Timeout: no reply'));
                            session.removeListener('RC_SIP_INFO', onInfo);
                        }, responseTimeout);
                        session.on('RC_SIP_INFO', onInfo);
                    }
                    else {
                        reject(new Error('The INFO response status code is: ' + response.status_code + ' (waiting for 200)'));
                    }
                }
            });

        });

    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    function sendRequest(type, config){
        if (type == SIP.C.PRACK) {
            type = SIP.C.ACK;
        }
        return this.__sendRequest(type, config);
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * Fired each time a provisional (100-199) response is received.
     * Early media is supported by SIP.js library
     * But in case it is sent without 100rel support we play it manually
     * STATUS_EARLY_MEDIA === 11, it will be set by SIP.js if 100rel is supported
     *
     * @see https://bugzilla.mozilla.org/show_bug.cgi?id=1072388
     * @param {SIP.Session} session
     * @param response
     * @param {funciton} cb
     */
    function patch100rel(session, response, cb) {

        //Early media is supported by SIP.js library
        //But in case it is sent without 100rel support we play it manually
        //STATUS_EARLY_MEDIA === 11, it will be set by SIP.js if 100rel is supported
        if (session.status !== SIP.Session.C.STATUS_EARLY_MEDIA && response.status_code === 183 && typeof(response.body) === 'string' && response.body.indexOf('\n') !== -1) {
            if (!response.hasHeader('require')) response.setHeader('require', '100rel');
        }

        return cb.call(session, response);

    }

    /**
     * @this {SIP.Session}
     * @param response
     * @return {*}
     */
    function receiveInviteResponse(response) {
        return patch100rel(this, response, this.__receiveInviteResponse);
    }

    /**
     * @this {SIP.Session}
     * @param response
     * @return {*}
     */
    function receiveResponse(response) {
        return patch100rel(this, response, this.__receiveResponse);
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @private
     * @param {SIP.Session} session
     * @param {boolean} flag
     * @return {Promise}
     */
    function setRecord(session, flag) {

        var message = !!flag
            ? messages.startRecord
            : messages.stopRecord;

        if ((session.__onRecord && !flag) || (!session.__onRecord && flag)) {
            return sendReceive(session, message)
                .then(function(data) {
                    session.__onRecord = !!flag;
                    return data;
                });
        }

    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @private
     * @param {SIP.Session} session
     * @param {boolean} flag
     * @return {Promise}
     */
    function setHold(session, flag) {
        return new Promise(function(resolve, reject) {

            function onSucceeded() {
                resolve();
                session.removeListener('RC_CALL_REINVITE_FAILED', onFailed);
            }

            function onFailed(e) {
                reject(e);
                session.removeListener('RC_CALL_REINVITE_SUCCEEDED', onSucceeded);
            }

            session.once('RC_CALL_REINVITE_SUCCEEDED', onSucceeded);
            session.once('RC_CALL_REINVITE_FAILED', onFailed);

            if (flag) {
                session.__hold();
            } else {
                session.__unhold();
            }

        });
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.UA}
     * @param number
     * @param options
     * @return {SIP.Session}
     */
    function invite(number, options) {

        var ua = this;

        options = options || {};
        options.extraHeaders = options.extraHeaders || [];

        options.extraHeaders.push(ua.userAgentHeader);
        options.extraHeaders.push(ua.endpointHeader);
        options.extraHeaders.push(ua.clientIdHeader);

        options.extraHeaders.push('P-Asserted-Identity: sip:' + (options.fromNumber || ua.sipInfo.username) + '@' + ua.sipInfo.domain); //FIXME Phone Number

        //FIXME Backend should know it already
        if (options.homeCountryId) { options.extraHeaders.push('P-rc-country-id: ' + options.homeCountryId); }

        options.media = options.media || {};
        options.media.constraints = options.media.constraints || {audio: true, video: false};

        options.RTCConstraints = options.RTCConstraints || {optional: [{DtlsSrtpKeyAgreement: 'true'}]};

        ua.audioHelper.playOutgoing(true);

        return patchSession(ua.__invite(number, options));

    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * Monkey patching sendReinvite for better Hold handling
     * @this {SIP.Session}
     * @return {*}
     */
    function sendReinvite() {
        var session = this;
        var res = session.__sendReinvite.apply(session, arguments);
        var __reinviteSucceeded = session.reinviteSucceeded,
            __reinviteFailed = session.reinviteFailed;
        session.reinviteSucceeded = function() {
            session.emit('RC_CALL_REINVITE_SUCCEEDED', session);
            return __reinviteSucceeded.apply(session, arguments);
        };
        session.reinviteFailed = function() {
            session.emit('RC_CALL_REINVITE_FAILED', session);
            return __reinviteFailed.apply(session, arguments);
        };
        return res;
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session}
     * @param request
     * @return {*}
     */
    function receiveRequest(request) {
        var session = this;
        switch (request.method) {
            case SIP.C.INFO:
                session.emit('RC_SIP_INFO', request);
                //SIP.js does not support application/json content type, so we monkey override its behaviour in this case
                if (session.status === SIP.Session.C.STATUS_CONFIRMED || session.status === SIP.Session.C.STATUS_WAITING_FOR_ACK) {
                    var contentType = request.getHeader('content-type');
                    if (contentType.match(/^application\/json/i)) {
                        request.reply(200);
                        return session;
                    }
                }
                break;
            //Refresh invite should not be rejected with 488
            case SIP.C.INVITE:
                if (session.status === SIP.Session.C.STATUS_CONFIRMED) {
                    if (request.call_id && session.dialog && session.dialog.id && request.call_id == session.dialog.id.call_id) {
                        //TODO: check that SDP did not change
                        session.logger.log('re-INVITE received');
                        var localSDP = session.mediaHandler.peerConnection.localDescription.sdp;
                        request.reply(200, null, ['Contact: ' + session.contact], localSDP, function() {
                            session.status = SIP.Session.C.STATUS_WAITING_FOR_ACK;
                            session.setInvite2xxTimer(request, localSDP);
                            session.setACKTimer();
                        });
                        return session;
                    }
                    //else will be rejected with 488 by SIP.js
                }
                break;
            //We need to analize NOTIFY messages sometimes, so we fire an event
            case SIP.C.NOTIFY:
                session.emit('RC_SIP_NOTIFY', request);
                break;
        }
        return session.__receiveRequest.apply(session, arguments);
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session}
     * @param {object} options
     * @return {Promise}
     */
    function accept(options) {

        var session = this;

        options = options || {};
        options.extraHeaders = options.extraHeaders || [];

        options.extraHeaders.push(session.ua.userAgentHeader);
        options.extraHeaders.push(session.ua.endpointHeader);
        options.extraHeaders.push(session.ua.clientIdHeader);

        options.media = options.media || {};
        options.media.constraints = options.media.constraints || {audio: true, video: false};

        options.RTCConstraints = options.RTCConstraints || {optional: [{DtlsSrtpKeyAgreement: 'true'}]};

        return new Promise(function(resolve, reject) {

            function onAnswered() {
                resolve(session);
                session.removeListener('failed', onFail);
            }

            function onFail(e) {
                reject(e);
                session.removeListener('accepted', onAnswered);
            }

            //TODO More events?
            session.once('accepted', onAnswered);
            session.once('failed', onFail);

            session.__accept(options);

        });

    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session} session
     * @param {string} dtmf
     * @param {number} duration
     * @return {Promise}
     */
    function dtmf(dtmf, duration) {
        var session = this;
        duration = parseInt(duration) || 1000;
        var peer = session.mediaHandler.peerConnection;
        var stream = session.getLocalStreams()[0];
        var dtmfSender = peer.createDTMFSender(stream.getAudioTracks()[0]);
        if (dtmfSender !== undefined && dtmfSender.canInsertDTMF) {
            return dtmfSender.insertDTMF(dtmf, duration);
        }
        throw new Error('Send DTMF failed: ' + (!dtmfSender ? 'no sender' : (!dtmfSender.canInsertDTMF ? 'can\'t insert DTMF' : 'Unknown')));
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session} session
     * @return {Promise}
     */
    function hold() {
        return setHold(this, true);
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session} session
     * @return {Promise}
     */
    function unhold() {
        return setHold(this, false);
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session} session
     * @param {string} target
     * @param {object} options
     * @return {Promise}
     */
    function blindTransfer(target, options) {

        options = options || {};

        var session = this;
        var extraHeaders  =  options.extraHeaders||[];
        var originalTarget = target;

        return new Promise(function(resolve, reject) {
            //Blind Transfer is taken from SIP.js source

            // Check Session Status
            if (session.status !== SIP.Session.C.STATUS_CONFIRMED) {
                throw new SIP.Exceptions.InvalidStateError(session.status);
            }

            // normalizeTarget allows instances of SIP.URI to pass through unaltered,
            // so try to make one ahead of time
            try {
                target = SIP.Grammar.parse(target, 'Refer_To').uri || target;
            } catch (e) {
                session.logger.debug(".refer() cannot parse Refer_To from", target);
                session.logger.debug("...falling through to normalizeTarget()");
            }

            // Check target validity
            target = session.ua.normalizeTarget(target);
            if (!target) {
                throw new TypeError('Invalid target: ' + originalTarget);
            }

            extraHeaders.push('Contact: ' + session.contact);
            extraHeaders.push('Allow: ' + SIP.UA.C.ALLOWED_METHODS.toString());
            extraHeaders.push('Refer-To: ' + target);
            extraHeaders.push(session.ua.userAgentHeader);
            extraHeaders.push(session.ua.endpointHeader);
            extraHeaders.push(session.ua.clientIdHeader);

            // Send the request
            session.sendRequest(SIP.C.REFER, {
                extraHeaders: extraHeaders,
                body: options.body,
                receiveResponse: function(response) {
                    var timeout = null;
                    if (response.status_code === 202) {
                        var callId = response.call_id;

                        var onNotify = function(request) {
                            if (request.call_id === callId) {
                                var body = request && request.body || '';
                                switch (true) {
                                    case /1[0-9]{2}/.test(body):
                                        request.reply(200);
                                        break;
                                    case /2[0-9]{2}/.test(body):
                                        session.terminate();
                                        clearTimeout(timeout);
                                        session.removeListener('RC_SIP_NOTIFY', onNotify);
                                        resolve();
                                        break;
                                    default:
                                        reject(body);
                                        break;
                                }
                            }
                        };

                        timeout = setTimeout(function() {
                            reject(new Error('Timeout: no reply'));
                            session.removeListener('RC_SIP_NOTIFY', onNotify);
                        }, responseTimeout);
                        session.on('RC_SIP_NOTIFY', onNotify);
                    }
                    else {
                        reject(new Error('The response status code is: ' + response.status_code + ' (waiting for 202)'));
                    }
                }
            });

        });
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session}
     * @param {string} target
     * @param {object} options
     * @return {Promise}
     */
    function transfer(target, options) {

        var session = this;

        return (session.isOnHold() ? Promise.resolve(null) : session.hold())
            .then(function() { return delay(300); })
            .then(function() {
                return session.blindTransfer(target, options);
            });

    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session}
     * @param {string} target
     * @param {object} acceptOptions
     * @param {object} [transferOptions]
     * @return {Promise}
     */
    function forward(target, acceptOptions, transferOptions) {

        var interval = null,
            session = this;

        return session.accept(acceptOptions)
            .then(function() {

                return new Promise(function(resolve, reject) {
                    interval = setInterval(function() {
                        if (session.status === 12) {
                            clearInterval(interval);
                            session.mute();
                            setTimeout(function() {
                                resolve(session.transfer(target, transferOptions));
                            }, 700);
                        }
                    }, 50);
                });

            });

    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session}
     * @return {Promise}
     */
    function startRecord() {
        return setRecord(this, true);
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session}
     * @return {Promise}
     */
    function stopRecord() {
        return setRecord(this, false);
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session}
     * @param target
     * @return {Promise}
     */
    function flip(target) {
        return sendReceive(this, messages.flip, {target: target});
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session}
     * @return {Promise}
     */
    function park() {
        return sendReceive(this, messages.park);
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    return WebPhone;

}));