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
        takeover: {reqid: 7, command: 'takeover'},
        toVoicemail: {reqid: 11, command: 'toVoicemail'},
        receiveConfirm: {reqid: 17, command: 'receiveConfirm'},
        replyWithMessage: {reqid: 14, command: 'replyWithMessage'},
    };

    var uuidKey = 'rc-webPhone-uuid';

    var responseTimeout = 60000;

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
        this.loadAudio(options);

    }

    AudioHelper.prototype._playSound = function(url, val, volume) {

        if (!this._enabled || !url) return this;

        if (!this._audio[url]) {
            if (val) {
                this._audio[url] = new Audio();
                this._audio[url].src = url;
                this._audio[url].loop = true;
                this._audio[url].volume = volume;
                this._audio[url].playPromise = this._audio[url].play();
            }
        } else {
            if (val) {
                this._audio[url].currentTime = 0;
                this._audio[url].playPromise = this._audio[url].play();
            } else {
                var audio = this._audio[url];
                if (audio.playPromise !== undefined) {
                    audio.playPromise.then(function() {
                        audio.pause();
                    });
                }
            }
        }

        return this;

    };

    AudioHelper.prototype.loadAudio = function(options) {
        this._incoming = options.incoming;
        this._outgoing = options.outgoing;
        this._audio = {};
    };

    AudioHelper.prototype.setVolume = function(volume) {
        if (volume < 0) { volume = 0; }
        if (volume > 1) { volume = 1; }
        this.volume = volume;
        for (var url in this._audio) {
            if (this._audio.hasOwnProperty(url)) {
                this._audio[url].volume = volume;
            }
        }
    };

    AudioHelper.prototype.playIncoming = function(val) {
        return this._playSound(this._incoming, val, (this.volume || 0.5));
    };

    AudioHelper.prototype.playOutgoing = function(val) {
        return this._playSound(this._outgoing, val, (this.volume || 1));
    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @param {object} regData
     * @param {object} [options]
     * @param {string} [options.uuid]
     * @param {string} [options.appKey]
     * @param {string} [options.appName]
     * @param {string} [options.appVersion]
     * @param {string} [options.audioHelper]
     * @param {string} [options.onSession] fired each time UserAgent starts working with session
     * @constructor
     */
    function WebPhone(regData, options) {

        regData = regData || {};
        options = options || {};

        this.sipInfo = regData.sipInfo[0] || regData.sipInfo;
        this.sipFlags = regData.sipFlags;

        this.uuidKey = options.uuidKey || uuidKey;

        var id = options.uuid || localStorage.getItem(this.uuidKey) || uuid(); //TODO Make configurable
        localStorage.setItem(this.uuidKey, id);

        // var rcMediaHandlerFactory = function(session, options) {
        //     //TODO Override MediaHandler functions in order to disable TCP candidates
        //     return new SIP.WebRTC.MediaHandler(session, options);
        // };

        this.appKey = options.appKey;
        this.appName = options.appName;
        this.appVersion = options.appVersion;

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
            iceCheckingTimeout: this.sipInfo.iceCheckingTimeout || this.sipInfo.iceGatheringTimeout || 500,
            // mediaHandlerFactory: rcMediaHandlerFactory,
            rtcpMuxPolicy: "negotiate",
            //disable TCP candidates
            hackStripTcp:true
        };


        this.userAgent = new SIP.UA(configuration);

        this.userAgent.defaultHeaders = [
            'P-rc-endpoint-id: ' + id,
            'RC-User-Agent: ' + (
            (options.appName ? (options.appName + (options.appVersion ? '/' + options.appVersion : '')) + ' ' : '') +
            'RCWEBPHONE/' + WebPhone.version),
            'Client-id:' + options.appKey
        ];

        this.userAgent.sipInfo = this.sipInfo;

        this.userAgent.__invite = this.userAgent.invite;
        this.userAgent.invite = invite;

        this.userAgent.__register = this.userAgent.register;
        this.userAgent.register = register;

        this.userAgent.__unregister = this.userAgent.unregister;
        this.userAgent.unregister = unregister;

        this.userAgent.on('invite', function(session) {
            this.userAgent.audioHelper.playIncoming(true);
            patchSession(session);
            patchIncomingSession(session);
            session._sendReceiveConfirmPromise = session.sendReceiveConfirm().then(function() {
                session.logger.log('sendReceiveConfirm success');
            }).catch(function(error){
                session.logger.error('failed to send receive confirmation via SIP MESSAGE due to ' + error);
                throw error;
            });
        }.bind(this));

        this.userAgent.audioHelper = new AudioHelper(options.audioHelper);

        this.userAgent.onSession = options.onSession || null;
        this.userAgent.createRcMessage = createRcMessage;
        this.userAgent.sendMessage = sendMessage;
        this.userAgent.transport._onMessage = this.userAgent.transport.onMessage;
        this.userAgent.transport.onMessage = onMessage;
        this.userAgent.register();

    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    WebPhone.version = '0.4.5';
    WebPhone.uuid = uuid;
    WebPhone.delay = delay;
    WebPhone.extend = extend;

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @param {object} options
     * @return {String}
     */
    function createRcMessage(options) {
        options.body = options.body || '';
        var msgBody = '<Msg><Hdr SID="' + options.sid + '" Req="' + options.request + '" From="' + options.from + '" To="' + options.to +'" Cmd="' + options.reqid + '"/> <Bdy Cln="' + this.sipInfo.authorizationId + '" ' + options.body + '/></Msg>';
        return msgBody;
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.UserAgent}
     * @param {object} options
     * @return {Promise}
     */
    function sendMessage(to, messageData) {
        var userAgent = this;
        var sipOptions = {};
        sipOptions.contentType = 'x-rc/agent';
        sipOptions.extraHeaders = [];
        sipOptions.extraHeaders.push('P-rc-ws: ' + this.contact);

        return new Promise(function(resolve, reject) {
            var message = userAgent.message(to, messageData, sipOptions);

            message.once('accepted', function(response, cause) {
                resolve();
            });
            message.once('failed', function(response, cause) {
                reject(new Error(cause));
            });
        });
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    function onMessage(e) {
        // This is a temporary solution to avoid timeout errors for MESSAGE responses.
        // Timeout is caused by port specification in host field within Via header.
        // sip.js requires received viaHost in a response to be the same as ours via host therefore
        // messages with the same host but with port are ignored.
        // This is the exact case for WSX: it send host:port inn via header in MESSAGE responses.
        // To overcome this, we will preprocess MESSAGE messages and remove port from viaHost field.
        var data = e.data;

        // WebSocket binary message.
        if (typeof data !== 'string') {
            try {
                data = String.fromCharCode.apply(null, new Uint8Array(data));
            }
            catch(error) {
                return this._onMessage.apply(this, [e]);
            }
        }

        if (data.match(/CSeq:\s*\d+\s+MESSAGE/i)) {
            var re = new RegExp(this.ua.configuration.viaHost + ':\\d+',"g");
            var newData = e.data.replace(re, this.ua.configuration.viaHost);
            Object.defineProperty(e, "data", {
                value: newData,
                writable: false
            });
        }

        return this._onMessage.apply(this, [e]);
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    function patchSession(session) {

        if (session.__patched) return session;

        session.__patched = true;

        session.__sendRequest = session.sendRequest;
        session.__receiveRequest = session.receiveRequest;
        session.__accept = session.accept;
        session.__hold = session.hold;
        session.__unhold = session.unhold;
        session.__dtmf = session.dtmf;

        session.sendRequest = sendRequest;
        session.receiveRequest = receiveRequest;
        session.accept = accept;
        session.hold = hold;
        session.unhold = unhold;
        session.dtmf = dtmf;

        session.warmTransfer = warmTransfer;
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
        session.on('progress', function(incomingResponse) {
            if (incomingResponse.status_code === 183 && incomingResponse.body) {
                session.createDialog(incomingResponse, 'UAC');
                session.mediaHandler.setDescription(incomingResponse).then(function() {
                    session.status = 11; //C.STATUS_EARLY_MEDIA;
                    session.hasAnswer = true;
                });
            }
        });
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

        if (session.ua.onSession) session.ua.onSession(session);

        return session;

    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    function patchIncomingSession(session) {
        try {
            parseRcHeader(session);
        } catch (e) {
            session.logger.error('Can\'t parse RC headers from invite request due to ' + e);
        }
        session.canUseRCMCallControl = canUseRCMCallControl;
        session.createSessionMessage = createSessionMessage;
        session.sendSessionMessage = sendSessionMessage;
        session.sendReceiveConfirm = sendReceiveConfirm;
        session.toVoicemail = toVoicemail;
        session.replyWithMessage = replyWithMessage;
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    function parseRcHeader(session) {
      var prc = session.request.headers['P-Rc'];
      if (prc && prc.length) {
        var rawInviteMsg = prc[0].raw;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(rawInviteMsg, 'text/xml');
        var hdrNode = xmlDoc.getElementsByTagName('Hdr')[0];

        if (hdrNode) {
          session.rcHeaders = {
            sid: hdrNode.getAttribute('SID'),
            request: hdrNode.getAttribute('Req'),
            from: hdrNode.getAttribute('From'),
            to: hdrNode.getAttribute('To'),
          };
        }
      }
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session}
     * @return {Bool}
     */
    function canUseRCMCallControl() {
        return !!this.rcHeaders;
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session}
     * @param {object} options
     * @return {String}
     */
    function createSessionMessage(options) {
        if (!this.rcHeaders) {
            return undefined;
        }
        extend(options, {
            sid: this.rcHeaders.sid,
            request: this.rcHeaders.request,
            from: this.rcHeaders.to,
            to: this.rcHeaders.from,
        });
        return this.ua.createRcMessage(options);
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session}
     * @param {object} options
     * @return {Promise}
     */
    function sendSessionMessage(options) {
        if (!this.rcHeaders) {
            return Promise.reject(new Error('Can\'t send SIP MESSAGE related to session: no RC headers available'));
        }

        var to = this.rcHeaders.from;

        return this.ua.sendMessage(to, this.createSessionMessage(options));
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session}
     * @return {Promise}
     */
    function sendReceiveConfirm() {
        return this.sendSessionMessage(messages.receiveConfirm);
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session}
     * @return {Promise}
     */
    function toVoicemail() {
        var session = this;
        return session._sendReceiveConfirmPromise.then(function () {
            return session.sendSessionMessage(messages.toVoicemail);
        });
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @this {SIP.Session}
     * @param {object} replyOptions
     * @return {Promise}
     */
    function replyWithMessage(replyOptions) {
        var body = 'RepTp="'+ replyOptions.replyType +'"';

        if (replyOptions.replyType === 0) {
            body += ' Bdy="'+ replyOptions.replyText +'"';
        } else if (replyOptions.replyType === 1){
            body += ' Vl="'+ replyOptions.timeValue +'"';
            body += ' Units="'+ replyOptions.timeUnits +'"';
            body += ' Dir="'+ replyOptions.callbackDirection +'"';
        }
        var session = this;
        return session._sendReceiveConfirmPromise.then(function () {
            return session.sendSessionMessage({ reqid: messages.replyWithMessage.reqid, body: body });
        });
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

            var extraHeaders = (options.extraHeaders || []).concat(session.ua.defaultHeaders).concat([
                'Content-Type: application/json;charset=utf-8'
            ]);

            session.sendRequest(SIP.C.INFO, {
                body: JSON.stringify({
                    request: command
                }),
                extraHeaders: extraHeaders,
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

    function register(options) {
        options = options || {};
        options.extraHeaders = (options.extraHeaders || []).concat(this.defaultHeaders);
        return this.__register.call(this, options);
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    function unregister(options) {
        options = options || {};
        options.extraHeaders = (options.extraHeaders || []).concat(this.defaultHeaders);
        return this.__unregister.call(this, options);
    }

    /*--------------------------------------------------------------------------------------------------------------------*/

    function sendRequest(type, config) {
        if (type == SIP.C.PRACK) {
            // type = SIP.C.ACK;
            return this;
        }
        return this.__sendRequest(type, config);
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

            var options = {
                eventHandlers: {
                    succeeded: resolve,
                    failed: reject
                }
            };

            if (flag) {
                session.__hold(options);
            } else {
                session.__unhold(options);
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
        options.extraHeaders = (options.extraHeaders || []).concat(ua.defaultHeaders);

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
        options.extraHeaders = (options.extraHeaders || []).concat(session.ua.defaultHeaders);
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
        var extraHeaders = options.extraHeaders || [];
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

            extraHeaders = extraHeaders.concat(session.ua.defaultHeaders).concat([
                'Contact: ' + session.contact,
                'Allow: ' + SIP.UA.C.ALLOWED_METHODS.toString(),
                'Refer-To: ' + target
            ]);

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
     * @this {SIP.Session} session
     * @param {SIP.Session} target
     * @param {object} transferOptions
     * @return {Promise}
     */
    function warmTransfer(target, transferOptions) {

        var session = this;

        return (session.isOnHold() ? Promise.resolve(null) : session.hold())
            .then(function() { return delay(300); })
            .then(function() {

                var referTo = '<' + target.dialog.remote_target.toString() +
                              '?Replaces=' + target.dialog.id.call_id +
                              '%3Bto-tag%3D' + target.dialog.id.remote_tag +
                              '%3Bfrom-tag%3D' + target.dialog.id.local_tag + '>';

                transferOptions = transferOptions || {};
                transferOptions.extraHeaders = (transferOptions.extraHeaders || [])
                    .concat(session.ua.defaultHeaders)
                    .concat(['Referred-By: ' + session.dialog.remote_target.toString()]);

                //TODO return session.refer(newSession);
                return session.blindTransfer(referTo, transferOptions);

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
