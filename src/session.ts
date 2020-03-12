import {
    C,
    ClientContext,
    Exceptions,
    IncomingResponse,
    InviteClientContext,
    InviteServerContext,
    OutgoingRequest,
    ReferClientContext,
    Session
} from 'sip.js';
import {responseTimeout, messages} from './constants';
import {startQosStatsCollection} from './qos';
import {WebPhoneUserAgent} from './userAgent';
import {delay, extend} from './utils';
import {MediaStreams} from './mediaStreams';
import {RTPReport, InboundRtpReport, OutboundRtpReport, RttReport, isNoAudio} from './rtpReport';

export interface RCHeaders {
    sid?: string;
    request?: string;
    from?: string;
    to?: string;
    srvLvl?: string;
    srvLvlExt?: string;
    toNm?: string;
    callAttributes?: string;
    srcIVRSiteName?: string;
    queueName?: string;
    queueExtPin?: string;
    inDID?: string;
    inDIDLabel?: string;
    callerId?: string;
    callerIdName?: string;
    displayInfo?: string;
    displayInfoSub?: string;
}

export interface RTCPeerConnectionLegacy extends RTCPeerConnection {
    getRemoteStreams: () => MediaStream[];
    getLocalStreams: () => MediaStream[];
}

export type WebPhoneSession = InviteClientContext &
    InviteServerContext & {
        __sendRequest: typeof InviteServerContext.prototype.sendRequest;
        __receiveRequest: typeof InviteServerContext.prototype.receiveRequest;
        __accept: typeof InviteServerContext.prototype.accept;
        __hold: typeof InviteClientContext.prototype.hold;
        __unhold: typeof InviteClientContext.prototype.unhold;
        __dtmf: typeof InviteClientContext.prototype.dtmf;
        __reinvite: typeof InviteClientContext.prototype.reinvite;
        sendRequest: typeof sendRequest;
        receiveRequest: typeof receiveRequest;
        accept: typeof accept;
        hold: typeof hold;
        unhold: typeof unhold;
        dtmf: typeof dtmf;
        reinvite: typeof reinvite;
        _sendReceiveConfirmPromise: Promise<any>;
        ua: WebPhoneUserAgent;
        local_hold: boolean;
        failed: any; //FIXME PROTECTED
        sessionDescriptionHandler: {
            peerConnection: RTCPeerConnectionLegacy; //FIXME Not documented
        };
        // non-sip
        __patched: boolean;
        __onRecord: boolean;
        hasAnswer: boolean;
        media: any;
        rcHeaders: RCHeaders;
        warmTransfer: typeof warmTransfer;
        blindTransfer: typeof blindTransfer;
        transfer: typeof transfer;
        park: typeof park;
        forward: typeof forward;
        startRecord: typeof startRecord;
        stopRecord: typeof stopRecord;
        flip: typeof flip;
        mute: typeof mute;
        unmute: typeof unmute;
        onLocalHold: typeof onLocalHold;
        addTrack: typeof addTrack;
        canUseRCMCallControl: typeof canUseRCMCallControl;
        createSessionMessage: typeof createSessionMessage;
        sendSessionMessage: typeof sendSessionMessage;
        sendReceiveConfirm: typeof sendReceiveConfirm;
        ignore: typeof ignore;
        toVoicemail: typeof toVoicemail;
        replyWithMessage: typeof replyWithMessage;
        logger: any;
        on(event: 'muted' | 'unmuted', listener: (session: WebPhoneSession) => void): WebPhoneSession;
        mediaStreams: MediaStreams;
        mediaStatsStarted: boolean;
        noAudioReportCount: number;
        reinviteForNoAudioSent: boolean;
        stopMediaStats: typeof stopMediaStats;
        receiveReinviteResponse: any;
        pendingReinvite: boolean;
        sendReinvite: Promise<any>;
        _sendReinvite: typeof sendReinvite;
    };

export const patchSession = (session: WebPhoneSession): WebPhoneSession => {
    if (session.__patched) return session;

    session.__patched = true;

    session.__sendRequest = session.sendRequest;
    session.__receiveRequest = session.receiveRequest;
    session.__accept = (session as InviteServerContext).accept;
    session.__hold = session.hold;
    session.__unhold = session.unhold;
    session.__dtmf = session.dtmf;
    session.__reinvite = session.reinvite;

    session.sendRequest = sendRequest.bind(session);
    session.receiveRequest = receiveRequest.bind(session);
    session.accept = accept.bind(session);
    session.hold = hold.bind(session);
    session.unhold = unhold.bind(session);
    session.dtmf = dtmf.bind(session);
    session.reinvite = reinvite.bind(session);

    session.warmTransfer = warmTransfer.bind(session);
    session.blindTransfer = blindTransfer.bind(session);
    session.transfer = transfer.bind(session);
    session.park = park.bind(session);
    session.forward = forward.bind(session);
    session.startRecord = startRecord.bind(session);
    session.stopRecord = stopRecord.bind(session);
    session.flip = flip.bind(session);

    session.mute = mute.bind(session);
    session.unmute = unmute.bind(session);
    session.onLocalHold = onLocalHold.bind(session);

    session.media = session.ua.media; //TODO Remove
    session.addTrack = addTrack.bind(session);
    session.stopMediaStats = stopMediaStats.bind(session);

    session._sendReinvite = sendReinvite.bind(session);

    session.on('replaced', patchSession);

    // Audio
    session.on('progress' as any, (incomingResponse: IncomingResponse) => {
        stopPlaying();
        if (incomingResponse.statusCode === 183) {
            session.logger.log('Receiving 183 In Progress from server');
            session.createDialog(incomingResponse, 'UAC');
            session.hasAnswer = true;
            session.status = Session.C.STATUS_EARLY_MEDIA;
            session.logger.log('Created UAC Dialog');
            session.sessionDescriptionHandler.setDescription(incomingResponse.body).catch(exception => {
                session.logger.warn(exception);
                session.failed(incomingResponse, C.causes.BAD_MEDIA_DESCRIPTION);
                session.terminate({
                    status_code: 488,
                    reason_phrase: 'Bad Media Description'
                });
                session.logger.log('Call failed with Bad Media Description');
            });
        }
    });

    if (session.media) session.on('trackAdded', addTrack as any);

    const stopPlaying = (): void => {
        session.ua.audioHelper.playOutgoing(false);
        session.ua.audioHelper.playIncoming(false);
        session.removeListener('accepted', stopPlaying);
        session.removeListener('rejected', stopPlaying);
        session.removeListener('bye', stopPlaying);
        session.removeListener('terminated', stopPlaying);
        session.removeListener('cancel', stopPlaying);
        session.removeListener('failed', stopPlaying);
        session.removeListener('replaced', stopPlaying);
    };

    session.on('accepted', stopPlaying);
    session.on('rejected', stopPlaying);
    session.on('bye', stopPlaying);
    session.on('terminated', stopPlaying);
    session.on('cancel', stopPlaying);
    session.on('failed', stopPlaying);
    session.on('replaced', stopPlaying);

    if (session.ua.enableQos) {
        session.on('SessionDescriptionHandler-created', () => {
            session.logger.log('SessionDescriptionHandler Created');
            startQosStatsCollection(session);
            navigator.mediaDevices.enumerateDevices().then(function(devices) {
                devices.forEach(function(device) {
                    session.logger.log(device.kind + ' = ' + device.label + JSON.stringify(device));
                });
            });
        });
    }

    if (session.ua.onSession) session.ua.onSession(session);

    session.mediaStatsStarted = false;
    session.noAudioReportCount = 0;
    session.reinviteForNoAudioSent = false;

    return session;
};

/*--------------------------------------------------------------------------------------------------------------------*/

export const patchIncomingSession = (session: WebPhoneSession): void => {
    try {
        parseRcHeader(session);
    } catch (e) {
        session.logger.error("Can't parse RC headers from invite request due to " + e);
    }
    session.canUseRCMCallControl = canUseRCMCallControl;
    session.createSessionMessage = createSessionMessage;
    session.sendSessionMessage = sendSessionMessage;
    session.sendReceiveConfirm = sendReceiveConfirm;
    session.ignore = ignore;
    session.toVoicemail = toVoicemail;
    session.replyWithMessage = replyWithMessage;
};

/*--------------------------------------------------------------------------------------------------------------------*/

const parseRcHeaderString = (str: string = ''): any => {
    let obj = {};
    let pairs = str.split(/; */);

    pairs.forEach(pair => {
        let eq_idx = pair.indexOf('=');

        // skip things that don't look like key=value
        if (eq_idx < 0) {
            return;
        }

        let key = pair.substr(0, eq_idx).trim();
        let val = pair.substr(++eq_idx, pair.length).trim();

        // only assign once
        if (undefined === obj[key]) {
            obj[key] = val;
        }
    });

    return obj;
};

const parseRcHeader = (session: WebPhoneSession): any => {
    const prc = session.request.headers['P-Rc'];
    const prcCallInfo = session.request.headers['P-Rc-Api-Call-Info'];
    if (prc && prc.length) {
        const rawInviteMsg = prc[0].raw;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rawInviteMsg, 'text/xml');
        const hdrNode = xmlDoc.getElementsByTagName('Hdr')[0];
        const bdyNode = xmlDoc.getElementsByTagName('Bdy')[0];

        if (hdrNode) {
            session.rcHeaders = {
                sid: hdrNode.getAttribute('SID'),
                request: hdrNode.getAttribute('Req'),
                from: hdrNode.getAttribute('From'),
                to: hdrNode.getAttribute('To')
            };
        }
        if (bdyNode) {
            extend(session.rcHeaders, {
                srvLvl: bdyNode.getAttribute('SrvLvl'),
                srvLvlExt: bdyNode.getAttribute('SrvLvlExt'),
                toNm: bdyNode.getAttribute('ToNm')
            });
        }
    }
    if (prcCallInfo && prcCallInfo.length) {
        const rawCallInfo = prcCallInfo[0].raw;

        if (rawCallInfo) {
            let parsed = parseRcHeaderString(rawCallInfo);
            extend(session.rcHeaders, parsed);
        }
    }
};

const mediaCheckTimer = 2000;
/*--------------------------------------------------------------------------------------------------------------------*/

function canUseRCMCallControl(this: WebPhoneSession): boolean {
    return !!this.rcHeaders;
}

/*--------------------------------------------------------------------------------------------------------------------*/

function createSessionMessage(this: WebPhoneSession, options: RCHeaders): string {
    if (!this.rcHeaders) {
        return undefined;
    }
    extend(options, {
        sid: this.rcHeaders.sid,
        request: this.rcHeaders.request,
        from: this.rcHeaders.to,
        to: this.rcHeaders.from
    });
    return this.ua.createRcMessage(options);
}

/*--------------------------------------------------------------------------------------------------------------------*/

async function ignore(this: WebPhoneSession): Promise<ClientContext> {
    return this._sendReceiveConfirmPromise.then(() => {
        return this.sendSessionMessage(messages.ignore);
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/

async function sendSessionMessage(this: WebPhoneSession, options): Promise<ClientContext> {
    if (!this.rcHeaders) {
        throw new Error("Can't send SIP MESSAGE related to session: no RC headers available");
    }
    return this.ua.sendMessage(this.rcHeaders.from, this.createSessionMessage(options));
}

/*--------------------------------------------------------------------------------------------------------------------*/

async function sendReceiveConfirm(this: WebPhoneSession): Promise<ClientContext> {
    return this.sendSessionMessage(messages.receiveConfirm);
}

/*--------------------------------------------------------------------------------------------------------------------*/

async function toVoicemail(this: WebPhoneSession): Promise<ClientContext> {
    return this._sendReceiveConfirmPromise.then(() => {
        return this.sendSessionMessage(messages.toVoicemail);
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/

interface ReplyOptions {
    replyType: number; //TODO Use enum
    replyText: string;
    timeValue: string;
    timeUnits: string;
    callbackDirection: string;
}

async function replyWithMessage(this: WebPhoneSession, replyOptions: ReplyOptions): Promise<ClientContext> {
    let body = 'RepTp="' + replyOptions.replyType + '"';

    if (replyOptions.replyType === 0) {
        body += ' Bdy="' + replyOptions.replyText + '"';
    } else if (replyOptions.replyType === 1 || replyOptions.replyType === 4) {
        body += ' Vl="' + replyOptions.timeValue + '"';
        body += ' Units="' + replyOptions.timeUnits + '"';
        body += ' Dir="' + replyOptions.callbackDirection + '"';
    }
    return this._sendReceiveConfirmPromise.then(() => {
        return this.sendSessionMessage({
            reqid: messages.replyWithMessage.reqid,
            body
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/

async function sendReceive(session: WebPhoneSession, command: any, options?: any): Promise<any> {
    options = options || {};

    extend(command, options);

    let cseq;

    return new Promise((resolve, reject) => {
        const extraHeaders = (options.extraHeaders || [])
            .concat(session.ua.defaultHeaders)
            .concat(['Content-Type: application/json;charset=utf-8']);

        session.sendRequest(C.INFO, {
            body: JSON.stringify({
                request: command
            }),
            extraHeaders,
            receiveResponse: (response: IncomingResponse) => {
                let timeout = null;
                if (response.statusCode === 200) {
                    cseq = response.cseq;
                    const onInfo = (request: OutgoingRequest): void => {
                        if (response.cseq !== cseq) return;
                        let body = (request && request.body) || '{}';
                        let obj;

                        try {
                            obj = JSON.parse(body);
                        } catch (e) {
                            obj = {};
                        }

                        if (obj.response && obj.response.command === command.command) {
                            if (obj.response.result) {
                                if (obj.response.result.code.toString() === '0') {
                                    return resolve(obj.response.result);
                                }
                                return reject(obj.response.result);
                            }
                        }
                        timeout && clearTimeout(timeout);
                        session.removeListener('RC_SIP_INFO', onInfo);
                        resolve(null); //FIXME What to resolve
                    };
                    timeout = setTimeout(() => {
                        reject(new Error('Timeout: no reply'));
                        session.removeListener('RC_SIP_INFO', onInfo);
                    }, responseTimeout);
                    session.on('RC_SIP_INFO' as any, onInfo);
                } else {
                    reject(
                        new Error('The INFO response status code is: ' + response.statusCode + ' (waiting for 200)')
                    );
                }
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/

function sendRequest(this: WebPhoneSession, type, config): InviteServerContext {
    if (type === C.PRACK) {
        // type = C.ACK;
        return this;
    }
    return this.__sendRequest(type, config);
}

/*--------------------------------------------------------------------------------------------------------------------*/

async function setRecord(session: WebPhoneSession, flag: boolean): Promise<any> {
    const message = !!flag ? messages.startRecord : messages.stopRecord;

    if ((session.__onRecord && !flag) || (!session.__onRecord && flag)) {
        const data = await sendReceive(session, message);
        session.__onRecord = !!flag;
        return data;
    }
}

/*--------------------------------------------------------------------------------------------------------------------*/
//TODO: Convert to toggleHold() and deprecate this function
async function setLocalHold(session: WebPhoneSession, flag: boolean): Promise<any> {
    if (flag) {
        await session.__hold();
    } else {
        await session.__unhold();
    }
}

/*--------------------------------------------------------------------------------------------------------------------*/

function receiveRequest(this: WebPhoneSession, request): any {
    switch (request.method) {
        case C.INFO:
            this.emit('RC_SIP_INFO', request);
            //SIP.js does not support application/json content type, so we monkey override its behaviour in this case
            if (this.status === Session.C.STATUS_CONFIRMED || this.status === Session.C.STATUS_WAITING_FOR_ACK) {
                const contentType = request.getHeader('content-type');
                if (contentType.match(/^application\/json/i)) {
                    request.reply(200);
                    return this;
                }
            }
            break;
    }
    return this.__receiveRequest.apply(this, arguments);
}

/*--------------------------------------------------------------------------------------------------------------------*/

function accept(this: WebPhoneSession, options: any = {}): Promise<WebPhoneSession> {
    options = options || {};
    options.extraHeaders = (options.extraHeaders || []).concat(this.ua.defaultHeaders);
    options.RTCConstraints = options.RTCConstraints || {
        optional: [{DtlsSrtpKeyAgreement: 'true'}]
    };

    return new Promise((resolve, reject) => {
        const onAnswered = (): void => {
            resolve(this);
            this.removeListener('failed', onFail);
        };

        const onFail = (e): void => {
            reject(e);
            this.removeListener('accepted', onAnswered);
        };

        //TODO More events?
        this.once('accepted', onAnswered);
        this.once('failed', onFail);
        this.__accept(options);
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/

function dtmf(this: WebPhoneSession, dtmf: string, duration = 100, interToneGap = 50): void {
    duration = parseInt(duration.toString());
    interToneGap = parseInt(interToneGap.toString());
    const pc = this.sessionDescriptionHandler.peerConnection;
    const senders = pc.getSenders();
    const audioSender = senders.find(sender => {
        return sender.track && sender.track.kind === 'audio';
    });
    const dtmfSender = audioSender.dtmf;
    if (dtmfSender !== undefined && dtmfSender) {
        this.logger.log(`Send DTMF: ${dtmf} Duration: ${duration} InterToneGap: ${interToneGap}`);
        return dtmfSender.insertDTMF(dtmf, duration, interToneGap);
    }
    const sender = dtmfSender && !dtmfSender.canInsertDTMF ? "can't insert DTMF" : 'Unknown';
    throw new Error('Send DTMF failed: ' + (!dtmfSender ? 'no sender' : sender));
}

/*--------------------------------------------------------------------------------------------------------------------*/

async function sendReinvite(this: WebPhoneSession, options: any = {}): Promise<any> {
    if (this.pendingReinvite) {
        throw new Error('Reinvite in progress. Please wait until complete, then try again.');
    }
    if (!this.sessionDescriptionHandler) {
        throw new Error("No SessionDescriptionHandler, can't send reinvite..");
    }
    this.pendingReinvite = true;
    options.modifiers = options.modifiers || [];

    return new Promise(async (resolve, reject) => {
        try {
            const description = await this.sessionDescriptionHandler.getDescription(
                options.sessionDescriptionHandlerOptions,
                options.modifiers
            );
            this.sendRequest(C.INVITE, {
                body: description,
                receiveResponse: (response: IncomingResponse) => {
                    if (response.statusCode === 200) resolve(response);
                    return this.receiveReinviteResponse(response);
                }
            });
        } catch (e) {
            this.pendingReinvite = false;
            reject(e);
        }
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/

async function hold(this: WebPhoneSession): Promise<any> {
    if (this.status !== Session.C.STATUS_WAITING_FOR_ACK && this.status !== Session.C.STATUS_CONFIRMED) {
        throw new Exceptions.InvalidStateError(this.status);
    }
    if (this.localHold) {
        throw new Error('Session already on hold');
    }
    this.stopMediaStats();
    let options = {
        modifiers: []
    };
    options.modifiers = options.modifiers || [];
    options.modifiers.push(this.sessionDescriptionHandler.holdModifier);
    try {
        this.logger.log('Hold Initiated');
        let response = await this._sendReinvite(options);
        this.localHold = true;
        this.logger.log('Hold completed: ' + response.body);
    } catch (e) {
        throw new Error('Hold could not be completed');
    }
}

/*--------------------------------------------------------------------------------------------------------------------*/

async function unhold(this: WebPhoneSession): Promise<any> {
    if (this.status !== Session.C.STATUS_WAITING_FOR_ACK && this.status !== Session.C.STATUS_CONFIRMED) {
        throw new Exceptions.InvalidStateError(this.status);
    }
    if (!this.localHold) {
        throw new Error('Session not on hold, cannot unhold');
    }
    try {
        this.logger.log('Unhold Initiated');
        let response = await this._sendReinvite();
        this.localHold = false;
        this.logger.log('Unhold completed: ' + response.body);
    } catch (e) {
        throw new Error('Unhold could not be completed');
    }
}

/*--------------------------------------------------------------------------------------------------------------------*/

function blindTransfer(this: WebPhoneSession, target, options = {}): Promise<ReferClientContext> {
    this.logger.log('Call transfer initiated');
    return Promise.resolve(this.refer(target, options));
}

/*--------------------------------------------------------------------------------------------------------------------*/

async function warmTransfer(
    this: WebPhoneSession,
    target: WebPhoneSession,
    transferOptions: any = {}
): Promise<ReferClientContext> {
    await (this.localHold ? Promise.resolve(null) : this.hold());
    transferOptions.extraHeaders = (transferOptions.extraHeaders || []).concat(this.ua.defaultHeaders);
    this.logger.log('Completing warm transfer');
    return Promise.resolve(this.refer(target, transferOptions));
}

/*--------------------------------------------------------------------------------------------------------------------*/

async function transfer(
    this: WebPhoneSession,
    target: WebPhoneSession,
    options: any = {}
): Promise<ReferClientContext> {
    options.extraHeaders = (options.extraHeaders || []).concat(this.ua.defaultHeaders);
    return this.blindTransfer(target, options);
}

/*--------------------------------------------------------------------------------------------------------------------*/

async function forward(
    this: WebPhoneSession,
    target: WebPhoneSession,
    acceptOptions,
    transferOptions
): Promise<ReferClientContext> {
    let interval = null;
    await this.accept(acceptOptions);
    return new Promise(resolve => {
        interval = setInterval(() => {
            if (this.status === Session.C.STATUS_CONFIRMED) {
                clearInterval(interval);
                this.mute();
                setTimeout(() => {
                    resolve(this.transfer(target, transferOptions));
                }, 700);
            }
        }, 50);
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/

async function startRecord(this: WebPhoneSession): Promise<any> {
    return setRecord(this, true);
}

/*--------------------------------------------------------------------------------------------------------------------*/

async function stopRecord(this: WebPhoneSession): Promise<any> {
    return setRecord(this, false);
}

/*--------------------------------------------------------------------------------------------------------------------*/

async function flip(this: WebPhoneSession, target): Promise<any> {
    return sendReceive(this, messages.flip, {target});
}

/*--------------------------------------------------------------------------------------------------------------------*/

function park(this: WebPhoneSession): Promise<any> {
    return sendReceive(this, messages.park);
}

/*--------------------------------------------------------------------------------------------------------------------*/

function reinvite(this: WebPhoneSession, options: any = {}, modifier = null): void {
    options.sessionDescriptionHandlerOptions = options.sessionDescriptionHandlerOptions || {};
    return this.__reinvite(options, modifier);
}

/*--------------------------------------------------------------------------------------------------------------------*/

function toggleMute(session: WebPhoneSession, mute: boolean): void {
    const pc = session.sessionDescriptionHandler.peerConnection;
    if (pc.getSenders) {
        pc.getSenders().forEach(sender => {
            if (sender.track) {
                sender.track.enabled = !mute;
            }
        });
    }
}

/*--------------------------------------------------------------------------------------------------------------------*/
function mute(this: WebPhoneSession, silent?: boolean): void {
    if (this.status !== Session.C.STATUS_CONFIRMED) {
        this.logger.warn('An active call is required to mute audio');
        return;
    }
    this.logger.log('Muting Audio');
    if (!silent) {
        this.emit('muted', this);
    }
    return toggleMute(this, true);
}

/*--------------------------------------------------------------------------------------------------------------------*/

function unmute(this: WebPhoneSession, silent?: boolean): void {
    if (this.status !== Session.C.STATUS_CONFIRMED) {
        this.logger.warn('An active call is required to unmute audio');
        return;
    }
    this.logger.log('Unmuting Audio');
    if (!silent) {
        this.emit('unmuted', this);
    }
    return toggleMute(this, false);
}

/*--------------------------------------------------------------------------------------------------------------------*/

function onLocalHold(this: WebPhoneSession): boolean {
    return this.localHold;
}

/*--------------------------------------------------------------------------------------------------------------------*/

function addTrack(this: WebPhoneSession, remoteAudioEle, localAudioEle): void {
    const pc = this.sessionDescriptionHandler.peerConnection;
    let remoteAudio;
    let localAudio;

    if (remoteAudioEle && localAudioEle) {
        remoteAudio = remoteAudioEle;
        localAudio = localAudioEle;
    } else if (this.media) {
        remoteAudio = this.media.remote;
        localAudio = this.media.local;
    } else {
        throw new Error('HTML Media Element not Defined');
    }

    let remoteStream = new MediaStream();
    if (pc.getReceivers) {
        pc.getReceivers().forEach(receiver => {
            const rtrack = receiver.track;
            if (rtrack) {
                remoteStream.addTrack(rtrack);
                this.logger.log('Remote track added');
            }
        });
    } else {
        remoteStream = pc.getRemoteStreams()[0];
        this.logger.log('Remote track added');
    }
    remoteAudio.srcObject = remoteStream;
    remoteAudio.play().catch(() => {
        this.logger.log('Remote play was rejected');
    });

    let localStream = new MediaStream();
    if (pc.getSenders) {
        pc.getSenders().forEach(sender => {
            const strack = sender.track;
            if (strack && strack.kind === 'audio') {
                localStream.addTrack(strack);
                this.logger.log('Local track added');
            }
        });
    } else {
        localStream = pc.getLocalStreams()[0];
        this.logger.log('Local track added');
    }
    localAudio.srcObject = localStream;
    localAudio.play().catch(() => {
        this.logger.log('Local play was rejected');
    });
    if (localStream && remoteStream && !this.mediaStatsStarted) {
        this.mediaStreams = new MediaStreams(this);
        this.logger.log('Start gathering media report');
        this.mediaStatsStarted = true;
        this.mediaStreams.getMediaStats((report: RTPReport) => {
            if (this.ua.enableMediaReportLogging) {
                this.logger.log(`Got media report: ${JSON.stringify(report)}`);
            }
            if (!this.reinviteForNoAudioSent && isNoAudio(report)) {
                this.logger.log('No audio report');
                this.noAudioReportCount++;
                if (this.noAudioReportCount === 3) {
                    this.logger.log('No audio for 6 sec. Trying to recover audio by sending Re-invite');
                    this.mediaStreams.reconnectMedia();
                    this.reinviteForNoAudioSent = true;
                    this.noAudioReportCount = 0;
                }
            } else if (!isNoAudio(report)) {
                this.noAudioReportCount = 0;
            }
        }, mediaCheckTimer);
    }
}

function stopMediaStats(this: WebPhoneSession) {
    this.logger.log('Stopping media stats collection');
    if (!this) {
        return;
    }
    this.mediaStreams && this.mediaStreams.stopMediaStats();
    this.mediaStatsStarted = false;
    this.noAudioReportCount = 0;
}
