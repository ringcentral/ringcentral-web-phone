(function() {

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

    function WebPhone(options) {

        this.sipInfo = options.sipInfo[0] || options.sipInfo;
        this.sipFlags = options.sipFlags;

        console.log('Provisioning info', this.sipInfo, this.sipFlags);

        this.iceGatheringTimeout = this.sipInfo.iceGatheringTimeout || 3000;

        var configuration = {
            uri: 'sip:' + this.sipInfo.username + '@' + this.sipInfo.domain,
            wsServers: this.sipInfo.outboundProxy && this.sipInfo.transport
                ? this.sipInfo.transport.toLowerCase() + '://' + this.sipInfo.outboundProxy
                : this.sipInfo.wsServers,
            authorizationUser: this.sipInfo.authorizationId,
            extraHeaders: [
                'P-rc-endpoint-id: ' + options.uuid || uuid()
            ],
            password: this.sipInfo.password,
            traceSip: true,
            stunServers: this.sipInfo.stunServers || ['stun:74.125.194.127:19302'], //FIXME Hardcoded?
            turnServers: [],
            log: {
                level: 1 //FIXME LOG LEVEL 3
            },
            domain: this.sipInfo.domain,
            autostart: true,   //turn off autostart on UA creation
            register: true,    //turn off auto register on UA creation,
            iceGatheringTimeout: this.iceGatheringTimeout
        };

        //TODO Use this
        this.appKey = options.appKey;
        this.appName = options.appName;
        this.appVersion = options.appVersion;
        this.userAgentHeader = (options.appName ? (options.appName + (options.appVersion ? '/' + options.appVersion : '')) + ' ' : '') +
                               'RCWEBPHONE/' + WebPhone.version;

        this.userAgent = new SIP.UA(configuration);

    }

    WebPhone.version = '0.1.0';

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @param {Session} session
     * @return {Session}
     */
    WebPhone.prototype.patchSession = function(session) {

        if (session.__isPatched) return session;

        session.__isPatched = true;

        /*--------------------------------------------------------------------------------------------------------------------*/

        var __receiveRequest = session.receiveRequest;
        session.receiveRequest = function(request) {
            switch (request.method) {
                case SIP.C.INFO:
                    session.emit('SIP_INFO', request);
                    //SIP.js does not support application/json content type, so we monkey override its behaviour in this case
                    if (session.status === SIP.Session.C.STATUS_CONFIRMED || session.status === SIP.Session.C.STATUS_WAITING_FOR_ACK) {
                        var contentType = request.getHeader('content-type');
                        if (contentType.match(/^application\/json/i)) {
                            request.reply(200);
                            return this;
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
                    session.emit('SIP_NOTIFY', request);
                    break;
            }
            return __receiveRequest.apply(session, arguments);
        };

        /*--------------------------------------------------------------------------------------------------------------------*/

        // session.__hasEarlyMedia = false;
        // session.__waitingForIce = false;
        // session.__doubleCompleted = false;
        //
        // //Fired when the request fails, whether due to an unsuccessful final response or due to timeout, transport, or other error
        // session.on('failed', function(response, cause) {
        //     session.terminated('Forced Termination', cause);
        //     //FIXME SIP.js 0.6.x does not call terminated event sometimes, so we call it ourselves
        //     if (cause === SIP.C.causes.REQUEST_TIMEOUT) {
        //         if (session.status !== SIP.Session.C.STATUS_CONFIRMED) {
        //             session.terminated('Forced Termination', SIP.C.causes.REQUEST_TIMEOUT);
        //         }
        //     }
        // });
        //
        // // /*--------------------------------------------------------------------------------------------------------------------*/
        //
        // //Fired when ICE is starting to negotiate between the peers.
        // session.on('connecting', function(e) {
        //     setTimeout(function() {
        //         if (session.mediaHandler.onIceCompleted !== undefined) {
        //             session.mediaHandler.onIceCompleted(session); //FIXME Incompatible with SIP.JS 0.7
        //         }
        //         else {
        //             session.mediaHandler.callOnIceCompleted = true;
        //         }
        //     }, this.iceGatheringTimeout);
        // });
        //
        // // /*--------------------------------------------------------------------------------------------------------------------*/
        //
        // //Fired each time a provisional (100-199) response is received.
        // session.on('progress', function(e) {
        //     var response = e;
        //     //Early media is supported by SIP.js library
        //     //But in case it is sent without 100rel support we play it manually
        //     //STATUS_EARLY_MEDIA === 11, it will be set by SIP.js if 100rel is supported
        //     if (session.status !== SIP.Session.C.STATUS_EARLY_MEDIA && e.status_code === 183 && typeof(e.body) === 'string' && e.body.indexOf('\n') !== -1) {
        //         if (session.hasOffer) {
        //             if (!session.createDialog(response, 'UAC')) {
        //                 return;
        //             }
        //             session.mediaHandler.setDescription(
        //                 response.body,
        //                 function() {
        //                     session.dialog.pracked.push(response.getHeader('rseq'));
        //                     session.status = SIP.Session.C.STATUS_EARLY_MEDIA;
        //                     session.mute();
        //                     session.__hasEarlyMedia = true;
        //                 },
        //                 function(e) {
        //                     session.logger.warn(e);
        //                     session.acceptAndTerminate(response, 488, 'Not Acceptable Here');
        //                     session.failed(response, SIP.C.causes.BAD_MEDIA_DESCRIPTION);
        //                 }
        //             );
        //         }
        //     }
        // });
        //
        // // /*--------------------------------------------------------------------------------------------------------------------*/
        //
        // //Monkey patching for handling early media and to delay ACKs
        // var __receiveInviteReponse = session.receiveInviteResponse;
        // session.receiveInviteResponse = function(response) {
        //     var session = this, args = arguments;
        //     switch (true) {
        //         case (/^1[0-9]{2}$/.test(response.status_code)):
        //             //Let's not allow the library to send PRACK
        //             if (session.__hasEarlyMedia) {
        //                 this.emit('progress', response);
        //                 return;
        //             }
        //             break;
        //         case /^(2[0-9]{2})|(4\d{2})$/.test(response.status_code):
        //             if (!session.__hasEarlyMedia) break;
        //
        //             //Let's check the ICE connection state
        //             if (session.mediaHandler.peerConnection.iceConnectionState === 'completed' && !session.__waitingForIce) {
        //                 session.__waitingForIce = false;
        //                 //if ICE is connected, then let the library to handle the ACK
        //                 break;
        //             }
        //             else {
        //                 //If ICE is not connected, then we should send ACK after it has been connected
        //                 if (!session.__waitingForIce) {
        //                     function onICECompleted() {
        //                         session.removeListener('ICECompeted', onICECompleted);
        //                         //let the library handle the ACK after ICE connection is completed
        //                         session.__waitingForIce = false;
        //                         __receiveInviteReponse.apply(session, args);
        //                     }
        //                     session.on('ICECompeted', onICECompleted);
        //
        //                     function onICEFailed() {
        //                         session.removeListener('ICEFailed', onICEFailed);
        //                         //handle the ICE Failed situation
        //                         session.__waitingForIce = false;
        //                         session.acceptAndTerminate(response, null, 'ICE Connection Failed');
        //                     }
        //                     session.on('ICEFailed', onICEFailed);
        //
        //                     session.__waitingForIce = true;
        //                 }
        //                 return;
        //             }
        //             break;
        //     }
        //     return __receiveInviteReponse.apply(session, args);
        // };
        //
        // /*--------------------------------------------------------------------------------------------------------------------*/
        //
        // Session.prototype.terminateCallOnDisconnected = function(reason) {
        //     this.terminated(null, reason || SIP.C.causes.CONNECTION_ERROR);
        //     // self.eventEmitter.emit(EVENT_NAMES.callFailed, self, null, 'Connection error');
        // };
        //
        // //FIXME: Explore if it can be replaced with ref: http://sipjs.com/api/0.7.0/mediaHandler/
        // //Monkey patching oniceconnectionstatechange because SIP.js 0.6.x does not have this event
        // var onStateChange = session.mediaHandler.peerConnection.oniceconnectionstatechange || function() {};
        // session.mediaHandler.peerConnection.oniceconnectionstatechange = function() {
        //     //this === peerConnection
        //     var state = this.iceConnectionState;
        //     onStateChange.apply(this, arguments);
        //
        //     switch (state) {
        //         case 'connected':
        //             session.emit('ICEConnected', session);
        //             break;
        //         case 'completed':
        //             //this may be called twice, see: https://code.google.com/p/chromium/issues/detail?id=371804
        //             if (!session.__doubleCompleted) {
        //                 session.emit('ICECompleted', session);
        //                 session.__doubleCompleted = true;
        //             }
        //             break;
        //         case 'disconnected':
        //             terminateCallOnDisconnected();
        //             session.emit('ICEDisconnected', session);
        //             break;
        //         case 'failed':
        //             session.emit('ICEFailed', session);
        //             break;
        //     }
        // };

        return session;

    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @param {Session} session
     * @param {string} dtmf
     * @param {number} duration
     * @return {Promise}
     */
    WebPhone.prototype.dtmf = function(session, dtmf, duration) {
        session = this.patchSession(session);
        duration = parseInt(duration) || 1000;
        var peer = session.mediaHandler.peerConnection;
        var stream = session.getLocalStreams()[0];
        var dtmfSender = peer.createDTMFSender(stream.getAudioTracks()[0]);
        if (dtmfSender !== undefined && dtmfSender.canInsertDTMF) {
            return dtmfSender.insertDTMF(dtmf, duration);
        }
        throw new Error('Send DTMF failed: ' + (!dtmfSender ? 'no sender' : (!dtmfSender.canInsertDTMF ? 'can\'t insert DTMF' : 'Unknown')));
    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @param {Session} session
     * @param {boolean} flag
     * @return {Promise}
     */
    WebPhone.prototype.setHold = function(session, flag) {
        session = this.patchSession(session);
        return (new Promise(function(resolve, reject) {
            var handlers = {eventHandlers: {succeeded: resolve, failed: reject}};
            if (flag) {
                session.hold(handlers);
            } else {
                session.unhold(handlers);
            }
        }.bind(this)));
    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @param {Session} session
     * @param {object} command
     * @param {object} options
     * @return {Promise}
     */
    WebPhone.prototype.send = function(session, command, options) {

        session = this.patchSession(session);

        options = options || {};

        extend(command, options);

        var cseq = null;

        return new Promise(function(resolve, reject) {

            session.sendRequest(SIP.C.INFO, {
                body: JSON.stringify({
                    request: command
                }),
                extraHeaders: [
                    "Content-Type: application/json;charset=utf-8"
                ],
                receiveResponse: function(response) {
                    var timeout = null;
                    if (response.status_code === 200) {
                        cseq = response.cseq;
                        function onInfo(request) {
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
                                session.removeListener('SIP_INFO', onInfo);
                                resolve(null); //FIXME What to resolve
                            }
                        }

                        timeout = setTimeout(function() {
                            reject(new Error('Timeout: no reply'));
                            session.removeListener('SIP_INFO', onInfo);
                        }, responseTimeout);
                        session.on('SIP_INFO', onInfo);
                    }
                    else {
                        reject(new Error('The INFO response status code is: ' + response.status_code + ' (waiting for 200)'));
                    }
                }
            });

        });

    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @param {Session} session
     * @param {string} target
     * @param {object} options
     * @return {Promise}
     */
    WebPhone.prototype.blindTransfer = function(session, target, options) {

        session = this.patchSession(session);

        var extraHeaders = [];
        var originalTarget = target;
        options = options || {};

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

            // Send the request
            session.sendRequest(SIP.C.REFER, {
                extraHeaders: extraHeaders,
                body: options.body,
                receiveResponse: function(response) {
                    var timeout = null;
                    if (response.status_code === 202) {
                        var callId = response.call_id;

                        function onNotify(request) {
                            if (request.call_id === callId) {
                                var body = request && request.body || '';
                                switch (true) {
                                    case /1[0-9]{2}/.test(body):
                                        request.reply(200);
                                        break;
                                    case /2[0-9]{2}/.test(body):
                                        session.terminate();
                                        clearTimeout(timeout);
                                        session.removeListener('SIP_NOTIFY', onNotify);
                                        resolve();
                                        break;
                                    default:
                                        reject(body);
                                        break;
                                }
                            }
                        }

                        timeout = setTimeout(function() {
                            reject(new Error('Timeout: no reply'));
                            session.removeListener('SIP_NOTIFY', onNotify);
                        }, responseTimeout);
                        session.on('SIP_NOTIFY', onNotify);
                    }
                    else {
                        reject(new Error('The response status code is: ' + response.status_code + ' (waiting for 202)'));
                    }
                }
            });

        });
    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @param {Session} session
     * @param {string} target
     * @param {object} options
     * @return {Promise}
     */
    WebPhone.prototype.transfer = function(session, target, options) {

        session = this.patchSession(session);

        return (session.isOnHold() ? Promise.resolve(null) : this.setHold(session, true))
            .then(function() { return delay(300); })
            .then(function() {
                return this.blindTransfer(session, target, options);
            }.bind(this));

    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @param {Session} session
     * @param {object} options
     * @return {Promise}
     */
    WebPhone.prototype.answer = function(session, options) {

        session = this.patchSession(session);

        return new Promise(function(resolve, reject) {

            function onAnswered() {
                resolve();
                session.removeListener('accepted', onAnswered);
                session.removeListener('failed', onFail);
            }

            function onFail(e) {
                reject(e);
                session.removeListener('accepted', onAnswered);
                session.removeListener('failed', onFail);
            }

            //TODO More events
            session.on('accepted', onAnswered);
            session.on('failed', onFail);

            session.accept(options);

        });

    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @param {Session} session
     * @param {string} target
     * @param {object} acceptOptions
     * @param {object} [transferOptions]
     * @return {Promise}
     */
    WebPhone.prototype.forward = function(session, target, acceptOptions, transferOptions) {

        session = this.patchSession(session);

        var interval = null,
            self = this;

        return this.answer(session, acceptOptions)
            .then(function() {

                return new Promise(function(resolve, reject) {
                    interval = setInterval(function() {
                        if (session.status === 12) {
                            clearInterval(interval);
                            session.mute();
                            setTimeout(function() {
                                resolve(self.transfer(session, target, transferOptions));
                            }, 700);
                        }
                    }, 50);
                });

            });

    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @param {Session} session
     * @param {boolean} flag
     * @return {Promise}
     */
    WebPhone.prototype.record = function(session, flag) {

        session = this.patchSession(session);

        var message = !!flag
            ? messages.startRecord
            : messages.stopRecord;

        if ((session.__onRecord && !flag) || (!session.__onRecord && flag)) {
            return this.send(session, message)
                .then(function(data) {
                    session.__onRecord = !!flag;
                    return data;
                });
        }

    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    WebPhone.prototype.flip = function(session, target) {
        session = this.patchSession(session);
        return this.send(session, messages.flip, {target: target});
    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    /**
     * @param {Session} session
     * @return {Promise}
     */
    WebPhone.prototype.park = function(session) {
        session = this.patchSession(session);
        return this.send(session, messages.park);
    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    window.WebPhone = WebPhone;

})();