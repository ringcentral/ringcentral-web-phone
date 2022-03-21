import { EventEmitter } from 'events';
import {
    Invitation,
    InvitationAcceptOptions,
    Inviter,
    RequestPendingError,
    SessionInviteOptions,
    SessionReferOptions,
    UserAgent,
    URI,
    Session
} from 'sip.js';
import {
    fromBodyLegacy,
    IncomingRequestMessage,
    IncomingResponse,
    OutgoingInviteRequest,
    OutgoingReferRequest,
    OutgoingRequestDelegate,
    RequestOptions
} from 'sip.js/lib/core';
import { SessionState } from 'sip.js/lib/api/session-state';
import {
    SessionDescriptionHandler,
    SessionDescriptionHandlerOptions
} from 'sip.js/lib/platform/web/session-description-handler';

import { extend } from './utils';
import { responseTimeout, messages, Command } from './constants';
import { MediaStreams } from './mediaStreams';
import { RTPReport, isNoAudio } from './rtpReport';
import { WebPhoneUserAgent } from './userAgent';
import { Events } from './events';
import { WehPhoneUserAgentCore } from './userAgentCore';
import { startQosStatsCollection } from './qos';

export interface RCHeaders {
    body?: string;
    reqid?: string;
    sid?: string;
    request?: string;
    from?: string;
    to?: string;
    srvLvl?: string;
    srvLvlExt?: string;
    nm?: string;
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

export interface ReplyOptions {
    replyType: number; //FIXME: Use enum
    replyText: string;
    timeValue: string;
    timeUnits: string;
    callbackDirection: string;
}

export interface RTCPeerConnectionLegacy extends RTCPeerConnection {
    getRemoteStreams: () => MediaStream[];
    getLocalStreams: () => MediaStream[];
}

export class CommonSession {
    // DOCUMENT: This has been removed
    // sendRequest?: typeof sendRequest
    // onLocalHold?: typeof onLocalHold
    // receiveRequest?: typeof receiveRequest;
    /** @ignore */
    __isRecording?: boolean;
    /** @ignore */
    __patched?: boolean;
    /** @ignore */
    __userAgentCoreEventsSetup?: boolean;
    /** Flag to check if the call is on hold or not */
    held?: boolean;
    media?: { local?: HTMLMediaElement; remote?: HTMLMediaElement };
    /** Flag to indicate if media stats are being collected */
    mediaStatsStarted?: boolean;
    mediaStreams?: MediaStreams;
    /** Flag to check if the call is muted or not */
    muted?: boolean;
    noAudioReportCount?: number;
    /** JOSN representation of RC headers received for an incoming call */
    rcHeaders?: RCHeaders;
    reinviteForNoAudioSent?: boolean;
    /** @ignore */
    __accept?: typeof Invitation.prototype.accept;
    /** @ignore */
    __dispose?: typeof Session.prototype.dispose;
    /** Method to attach event listener for session specific events */
    addListener?: typeof EventEmitter.prototype.addListener;
    /** Add track to media source */
    addTrack?: typeof addTrack;
    /** RingCentral barge implementation */
    barge?: typeof barge;
    /** RingCentral blind transfer implementation */
    blindTransfer?: typeof blindTransfer;
    canUseRCMCallControl?: typeof canUseRCMCallControl;
    createSessionMessage?: typeof createSessionMessage;
    /** Sends a DTMF over the call */
    dtmf?: typeof dtmf;
    /** Emit session specific events which will trigger all the event listeners attached */
    emit?: typeof EventEmitter.prototype.emit;
    /** RingCentral flip implementation */
    flip?: typeof flip;
    /** RingCentral flip implementation */
    forward?: typeof forward;
    /** Put the call on hold */
    hold?: typeof hold;
    /** Ignore incoming call */
    ignore?: typeof ignore;
    /** Mute the call */
    mute?: typeof mute;
    /** Remove event listener */
    off?: typeof EventEmitter.prototype.off;
    /** Add event listener. Same as addListener */
    on?: typeof EventEmitter.prototype.on;
    /** RingCentral park implementation */
    park?: typeof park;
    /** Send a session reinvite */
    reinvite?: typeof reinvite;
    /** Remove event listener */
    removeListener?: typeof EventEmitter.prototype.removeListener;
    /** RingCentral reply with message implementation */
    replyWithMessage?: typeof replyWithMessage;
    sendInfoAndRecieveResponse?: typeof sendInfoAndRecieveResponse;
    sendMoveResponse?: typeof sendMoveResponse;
    sendReceiveConfirm?: typeof sendReceiveConfirm;
    sendSessionMessage?: typeof sendSessionMessage;
    /** Start recording the call */
    startRecord?: typeof startRecord;
    stopMediaStats?: typeof stopMediaStats;
    /** Stop recording the call */
    stopRecord?: typeof stopRecord;
    /** Send incoming call to voicemail */
    toVoicemail?: typeof toVoicemail;
    /** Transfer current call */
    transfer?: typeof transfer;
    /** Put the call on unhold */
    unhold?: typeof unhold;
    /** Unmute the call */
    unmute?: typeof unmute;
    /** RingCentral warm transfer implementation */
    warmTransfer?: typeof warmTransfer;
    /** RingCentral whisper implementation */
    whisper?: typeof whisper;
}

export type WebPhoneSession = WebPhoneInvitation | WebPhoneInviter;

/** This is an extension of the Invitation class of SIP.js
 *
 * [Reference](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.invitation.md)
 */
export interface WebPhoneInvitation extends Invitation, CommonSession {
    accept: typeof Invitation.prototype.accept;
    userAgent: WebPhoneUserAgent;
}

/** This is an extension of the Inviter class of SIP.js
 *
 * [Reference](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.inviter.md)
 */
export interface WebPhoneInviter extends Inviter, CommonSession {
    userAgent: WebPhoneUserAgent;
}

const mediaCheckTimer = 2000;

export function patchWebphoneSession(session: WebPhoneSession): WebPhoneSession {
    if (session.__patched) {
        return session;
    }
    session.__patched = true;
    session.held = false;
    session.muted = false;
    session.media = session.userAgent.media;
    session.__dispose = session.dispose.bind(session);
    session.dispose = dispose.bind(session);
    const eventEmitter = new EventEmitter();
    session.on = eventEmitter.on.bind(eventEmitter);
    session.off = eventEmitter.off.bind(eventEmitter);
    session.addListener = eventEmitter.addListener.bind(eventEmitter);
    session.removeListener = eventEmitter.removeListener.bind(eventEmitter);
    session.emit = eventEmitter.emit.bind(eventEmitter);
    session.sendInfoAndRecieveResponse = sendInfoAndRecieveResponse.bind(session);
    session.startRecord = startRecord.bind(session);
    session.stopRecord = stopRecord.bind(session);
    session.sendMoveResponse = sendMoveResponse.bind(session);
    session.park = park.bind(session);
    session.flip = flip.bind(session);
    session.whisper = whisper.bind(session);
    session.barge = barge.bind(session);
    session.mute = mute.bind(session);
    session.unmute = unmute.bind(session);
    session.addTrack = addTrack.bind(session);
    session.stopMediaStats = stopMediaStats.bind(session);
    session.warmTransfer = warmTransfer.bind(session);
    session.blindTransfer = blindTransfer.bind(session);
    session.transfer = transfer.bind(session);
    session.hold = hold.bind(session);
    session.unhold = unhold.bind(session);
    session.dtmf = dtmf.bind(session);
    session.reinvite = reinvite.bind(session);
    session.forward = forward.bind(session); // FIXME: Not needed?
    setupUserAgentCoreEvent(session);
    session.stateChange.addListener((newState) => {
        switch (newState) {
            case SessionState.Establishing: {
                session.emit(Events.Session.Establishing);
                (session.sessionDescriptionHandler as SessionDescriptionHandler).peerConnectionDelegate = {
                    ontrack: session.addTrack.bind(session)
                };
                break;
            }
            case SessionState.Established: {
                stopPlaying(session);
                session.emit(Events.Session.Established);
                break;
            }
            case SessionState.Terminating: {
                stopPlaying(session);
                stopMediaStreamStats(session);
                session.emit(Events.Session.Terminating);
                break;
            }
            case SessionState.Terminated: {
                stopPlaying(session);
                session.emit(Events.Session.Terminated);
                break;
            }
        }
    });

    // FIXME: Do we need this? The replaced session is part of existing sessions and would have already been patched
    // NEEDED - inviter.ts L191
    // session.on("replaced", patchWebphoneSession);

    if (session.userAgent.onSession) {
        session.userAgent.onSession(session);
    }
    session.mediaStatsStarted = false;
    session.noAudioReportCount = 0;
    session.reinviteForNoAudioSent = false;

    return session;
}

export function patchIncomingWebphoneSession(session: WebPhoneSession): void {
    try {
        parseRcHeader(session);
    } catch (e) {
        (session as any).logger.error("Can't parse RC headers from invite request due to " + e);
    }
    session.canUseRCMCallControl = canUseRCMCallControl.bind(session);
    session.createSessionMessage = createSessionMessage.bind(session);
    session.ignore = ignore.bind(session);
    session.replyWithMessage = replyWithMessage.bind(session);
    session.sendReceiveConfirm = sendReceiveConfirm.bind(session);
    session.sendSessionMessage = sendSessionMessage.bind(session);
    session.toVoicemail = toVoicemail.bind(session);
    session.__accept = (session as Invitation).accept.bind(session);
    (session as WebPhoneInvitation).accept = accept.bind(session);
    setupUserAgentCoreEvent(session);
}

function canUseRCMCallControl(this: WebPhoneSession): boolean {
    return !!this.rcHeaders;
}

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
    return this.userAgent.createRcMessage(options);
}

//DOCUMENT: Return type has changed and logging has been included here itself
async function sendReceiveConfirm(this: WebPhoneSession): Promise<void> {
    return this.sendSessionMessage(messages.receiveConfirm)
        .then(() => (this as any).logger.log('sendReceiveConfirm success'))
        .catch((error) =>
            (this as any).logger.error(`failed to send receive confirmation via SIP MESSAGE due to ${error.message}`)
        );
}

//DOCUMENT: Return type has changed
function sendSessionMessage(this: WebPhoneSession, options): Promise<IncomingResponse> {
    if (!this.rcHeaders) {
        (this as any).logger.error("Can't send SIP MESSAGE related to session: no RC headers available");
    }
    return this.userAgent.sendMessage(this.rcHeaders.from, this.createSessionMessage(options));
}

//DOCUMENT: Name has changed
async function sendInfoAndRecieveResponse(this: WebPhoneSession, command: Command, options?: any): Promise<any> {
    options = options || {};
    extend(command, options);
    delete command.extraHeaders;
    return new Promise((resolve, reject) => {
        const requestDelegate: OutgoingRequestDelegate = {
            onAccept: (response: IncomingResponse): void => {
                let timeout = null;
                const {
                    message: { statusCode, callId }
                } = response;
                if (statusCode === 200) {
                    const onInfo = (message: IncomingRequestMessage): void => {
                        // FIXME: I think we need this check here
                        if (message.callId !== callId) {
                            return;
                        }
                        const body = (message && message.body) || '{}';
                        let obj;

                        try {
                            obj = JSON.parse(body);
                        } catch (e) {
                            obj = {};
                        }
                        if (obj.response && obj.response.command === command.command && obj.response.result) {
                            timeout && clearTimeout(timeout);
                            this.off('RC_SIP_INFO', onInfo);
                            if (obj.response.result.code.toString() === '0') {
                                return resolve(obj.response.result);
                            }
                            return reject(obj.response.result);
                        }
                    };
                    timeout = setTimeout(() => {
                        reject(new Error('Timeout: no reply'));
                        this.off('RC_SIP_INFO', onInfo);
                    }, responseTimeout);
                    this.on('RC_SIP_INFO', onInfo);
                } else {
                    reject(new Error(`The INFO response status code is: ${statusCode} (waiting for 200)`));
                }
            },
            onReject: (response) => {
                reject(new Error(`The INFO response status code is: ${response.message.statusCode} (waiting for 200)`));
            }
        };
        const requestOptions: RequestOptions = {
            extraHeaders: [...(options.extraHeaders || []), ...this.userAgent.defaultHeaders],
            body: fromBodyLegacy({
                body: JSON.stringify({ request: command }),
                contentType: 'application/json;charset=utf-8'
            })
        };
        this.info({ requestDelegate, requestOptions });
    });
}

async function startRecord(this: WebPhoneSession): Promise<any> {
    return setRecord(this, true);
}

async function stopRecord(this: WebPhoneSession): Promise<any> {
    return setRecord(this, false);
}

function sendMoveResponse(
    this: WebPhoneSession,
    reqId: number,
    code: number,
    description: string,
    options: { extraHeaders?: Array<string> } = {}
): void {
    const extraHeaders = options.extraHeaders || [];
    const requestOptions: RequestOptions = {
        extraHeaders: [...extraHeaders, ...this.userAgent.defaultHeaders],
        body: fromBodyLegacy({
            body: JSON.stringify({
                response: {
                    reqId,
                    command: 'move',
                    result: {
                        code,
                        description
                    }
                }
            }),
            contentType: 'application/json;charset=utf-8'
        })
    };
    this.info({ requestOptions });
}

//DOCUMENT: Return type has changed
function ignore(this: WebPhoneSession): Promise<IncomingResponse> {
    return this.sendReceiveConfirm().then(() => this.sendSessionMessage(messages.ignore));
}

//DOCUMENT: Return type has changed
function toVoicemail(this: WebPhoneSession): Promise<IncomingResponse> {
    return this.sendReceiveConfirm().then(() => this.sendSessionMessage(messages.toVoicemail));
}

//DOCUMENT: Return type has changed
function replyWithMessage(this: WebPhoneSession, replyOptions: ReplyOptions): Promise<IncomingResponse> {
    let body = 'RepTp="' + replyOptions.replyType + '"';

    if (replyOptions.replyType === 0) {
        body += ' Bdy="' + replyOptions.replyText + '"';
    } else if (replyOptions.replyType === 1 || replyOptions.replyType === 4) {
        body += ' Vl="' + replyOptions.timeValue + '"';
        body += ' Units="' + replyOptions.timeUnits + '"';
        body += ' Dir="' + replyOptions.callbackDirection + '"';
    }
    return this.sendReceiveConfirm().then(() =>
        this.sendSessionMessage({ reqid: messages.replyWithMessage.reqid, body })
    );
}

async function flip(this: WebPhoneSession, target): Promise<any> {
    return this.sendInfoAndRecieveResponse(messages.flip, { target });
}

async function whisper(this: WebPhoneSession): Promise<any> {
    return this.sendInfoAndRecieveResponse(messages.whisper);
}

async function barge(this: WebPhoneSession): Promise<any> {
    return this.sendInfoAndRecieveResponse(messages.barge);
}

function park(this: WebPhoneSession): Promise<any> {
    return this.sendInfoAndRecieveResponse(messages.park);
}

function mute(this: WebPhoneSession, silent?: boolean): void {
    if (this.state !== SessionState.Established) {
        (this as any).logger.warn('An active session is required to mute audio');
        return;
    }
    if (this.muted) {
        (this as any).logger.debug('Session already muted');
        return;
    }
    (this as any).logger.log('Muting Audio');
    enableSenderTracks(this, false);
    this.muted = true;
    if (!silent) {
        this.emit(Events.Session.Muted, this);
    }
}

function unmute(this: WebPhoneSession, silent?: boolean): void {
    if (this.state !== SessionState.Established) {
        (this as any).logger.warn('An active session is required to unmute audio');
        return;
    }
    if (!this.muted) {
        (this as any).logger.debug('Session not muted');
        return;
    }
    (this as any).logger.log('Unmuting Audio');
    enableSenderTracks(this, true);
    this.muted = false;
    if (!silent) {
        this.emit(Events.Session.Unmuted, this);
    }
}

function addTrack(this: WebPhoneSession, remoteAudioEle?, localAudioEle?): void {
    const sessionDescriptionHandler = this.sessionDescriptionHandler as SessionDescriptionHandler;
    const peerConnection = sessionDescriptionHandler.peerConnection;
    let remoteAudio: HTMLMediaElement;
    let localAudio: HTMLMediaElement;

    if (remoteAudioEle && localAudioEle) {
        remoteAudio = remoteAudioEle;
        localAudio = localAudioEle;
    } else if (this.media) {
        remoteAudio = this.media.remote;
        localAudio = this.media.local;
    } else {
        throw new Error('HTML Media Element not Defined');
    }

    // TODO: peerConnecton.remoteMediaStream already has reciver track added thanks to default session description handler. Can we remove this code?
    let remoteStream = new MediaStream();
    if (peerConnection.getReceivers) {
        peerConnection.getReceivers().forEach((receiver) => {
            const rtrack = receiver.track;
            if (rtrack) {
                remoteStream.addTrack(rtrack);
                (this as any).logger.log('Remote track added');
            }
        });
    } else {
        remoteStream = sessionDescriptionHandler.remoteMediaStream;
        (this as any).logger.log('Remote track added');
    }
    remoteAudio.srcObject = remoteStream;
    remoteAudio.play().catch(() => {
        (this as any).logger.error('Remote play was rejected');
    });

    // TODO: peerConnecton.localMediaStream already has sender track added thanks to default session description handler. Can we remove this code?
    let localStream = new MediaStream();
    if (peerConnection.getSenders) {
        peerConnection.getSenders().forEach((sender) => {
            const strack = sender.track;
            if (strack && strack.kind === 'audio') {
                localStream.addTrack(strack);
                (this as any).logger.log('Local track added');
            }
        });
    } else {
        localStream = sessionDescriptionHandler.localMediaStream;
        (this as any).logger.log('Local track added');
    }
    localAudio.srcObject = localStream;
    localAudio.play().catch(() => {
        (this as any).logger.error('Local play was rejected');
    });

    if (localStream && remoteStream && !this.mediaStatsStarted) {
        this.mediaStreams = new MediaStreams(this);
        (this as any).logger.log('Start gathering media report');
        this.mediaStatsStarted = true;
        this.mediaStreams.getMediaStats((report: RTPReport) => {
            if (this.userAgent.enableMediaReportLogging) {
                (this as any).logger.log(`Got media report: ${JSON.stringify(report)}`);
            }
            if (!this.reinviteForNoAudioSent && isNoAudio(report)) {
                (this as any).logger.log('No audio report');
                this.noAudioReportCount++;
                if (this.noAudioReportCount === 3) {
                    (this as any).logger.log('No audio for 6 sec. Trying to recover audio by sending Re-invite');
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

function stopMediaStats(this: WebPhoneSession): void {
    (this as any).logger.log('Stopping media stats collection');
    if (!this) {
        return;
    }
    this.mediaStreams && this.mediaStreams.stopMediaStats();
    this.mediaStatsStarted = false;
    this.noAudioReportCount = 0;
}

// DOCUMENT: Return type has changed
// option type has changed
async function blindTransfer(
    this: WebPhoneSession,
    target: string | URI | WebPhoneSession,
    options: SessionReferOptions = {}
): Promise<OutgoingReferRequest> {
    (this as any).logger.log('Call transfer initiated');
    target = typeof target === 'string' ? UserAgent.makeURI(`sip:${target}@${this.userAgent.sipInfo.domain}`) : target;
    return Promise.resolve(this.refer(target, options));
}

// DOCUMENT: Return type has changed
// option type has changed
async function warmTransfer(
    this: WebPhoneSession,
    target: string | URI | WebPhoneSession,
    options: SessionReferOptions = { requestOptions: { extraHeaders: [] } }
): Promise<OutgoingReferRequest> {
    options.requestOptions.extraHeaders = (options.requestOptions.extraHeaders || []).concat(
        this.userAgent.defaultHeaders
    );
    target = typeof target === 'string' ? UserAgent.makeURI(`sip:${target}@${this.userAgent.sipInfo.domain}`) : target;
    (this as any).logger.log('Completing warm transfer');
    return Promise.resolve(this.refer(target, options));
}

// DOCUMENT: Return type has changed
// option type has changed
async function transfer(
    this: WebPhoneSession,
    target: string | URI | WebPhoneSession,
    options: SessionReferOptions = { requestOptions: { extraHeaders: [] } }
): Promise<OutgoingReferRequest> {
    options.requestOptions.extraHeaders = (options.requestOptions.extraHeaders || []).concat(
        this.userAgent.defaultHeaders
    );
    return this.blindTransfer(target, options);
}

// DOCUMENT: Return type has changed
// option type has changed
/**
 *
 * @param this WebPhoneSessionSessionInviteOptions
 * @param options
 * @returns Promise<OutgoingInviteRequest>
 *
 * Sends a reinvite. Also makes sure to regenrate a new SDP by passing offerToReceiveAudio: true, offerToReceiveVideo: false  and iceRestart: true
 * Once the SDP is ready, the local description is set and the SDP is sent to the remote peer along with an INVITE request
 */
function reinvite(this: WebPhoneSession, options: SessionInviteOptions = {}): Promise<OutgoingInviteRequest> {
    options.sessionDescriptionHandlerOptions = Object.assign({}, options.sessionDescriptionHandlerOptions, {
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
        iceRestart: true
    });
    options.requestDelegate = options.requestDelegate || {};
    const originalOnAccept = options.requestDelegate.onAccept?.bind(options.requestDelegate);
    options.requestDelegate.onAccept = (...args): void => {
        patchIncomingWebphoneSession(this);
        originalOnAccept && originalOnAccept(...args);
    };
    return this.invite(options);
}

async function hold(this: WebPhoneSession): Promise<void> {
    this.stopMediaStats();
    try {
        (this as any).logger.log('Hold Initiated');
        await setHold(this, true);
        (this as any).logger.log('Hold completed, held is set to true');
    } catch (e) {
        throw new Error('Hold could not be completed');
    }
}

async function unhold(this: WebPhoneSession): Promise<void> {
    try {
        (this as any).logger.log('Unhold Initiated');
        await setHold(this, false);
        (this as any).logger.log('Unhold completed, held is set to false');
    } catch (e) {
        throw new Error('Unhold could not be completed');
    }
}

function dtmf(this: WebPhoneSession, dtmf: string, duration = 100, interToneGap = 50): void {
    duration = parseInt(duration.toString());
    interToneGap = parseInt(interToneGap.toString());
    const sessionDescriptionHandler = this.sessionDescriptionHandler as SessionDescriptionHandler;
    const peerConnection = sessionDescriptionHandler.peerConnection;
    if (!peerConnection) {
        (this as any).logger.error('Peer connection closed.');
        return;
    }
    const senders = peerConnection.getSenders();
    const audioSender = senders.find((sender) => sender.track && sender.track.kind === 'audio');
    const dtmfSender = audioSender.dtmf;
    if (dtmfSender !== undefined && dtmfSender) {
        (this as any).logger.log(`Send DTMF: ${dtmf} Duration: ${duration} InterToneGap: ${interToneGap}`);
        return dtmfSender.insertDTMF(dtmf, duration, interToneGap);
    }
    const sender = dtmfSender && !dtmfSender.canInsertDTMF ? "can't insert DTMF" : 'Unknown';
    throw new Error('Send DTMF failed: ' + (!dtmfSender ? 'no sender' : sender));
}

function accept(this: WebPhoneSession, options: InvitationAcceptOptions = {}): Promise<WebPhoneSession> {
    options = options || {};
    options.extraHeaders = (options.extraHeaders || []).concat(this.userAgent.defaultHeaders);
    options.sessionDescriptionHandlerOptions = Object.assign({}, options.sessionDescriptionHandlerOptions);
    options.sessionDescriptionHandlerOptions.constraints =
        options.sessionDescriptionHandlerOptions.constraints ||
        Object.assign({}, this.userAgent.constraints, { optional: [{ DtlsSrtpKeyAgreement: 'true' }] });

    return new Promise((resolve, reject) => {
        try {
            this.__accept(options);
            resolve(this);
        } catch (e) {
            reject(e);
        }
    });
}

async function forward(
    this: WebPhoneSession,
    target: WebPhoneSession,
    acceptOptions: InvitationAcceptOptions,
    transferOptions: SessionReferOptions
): Promise<OutgoingReferRequest> {
    await (this as WebPhoneInvitation).accept(acceptOptions);
    return new Promise((resolve) => {
        this.mute();
        setTimeout(() => {
            resolve(this.transfer(target, transferOptions));
        }, 700);
    });
}

async function dispose(this: WebPhoneSession) {
    stopMediaStreamStats(this);
    this.__dispose();
}

/* ---------------------------------------------------------- HELPER FUNCTIONS ---------------------------------------------------------- */

function parseRcHeaderString(str = ''): { string?: string } {
    const pairs = str.split(/; */).filter((pair) => pair.includes('=')); // skip things that don't look like key=value
    return pairs.reduce((seed, pair) => {
        let [key, value] = pair.split('=');
        key = key.trim();
        value = value.trim();
        // only assign once
        seed[key] = seed[key] || value;
        return seed;
    }, {});
}

function parseRcHeader(session: WebPhoneSession): void {
    const prc = session.request.getHeader('P-Rc');
    const prcCallInfo = session.request.getHeader('P-Rc-Api-Call-Info');
    if (prc) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(prc, 'text/xml');
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
                nm: bdyNode.getAttribute('Nm'),
                toNm: bdyNode.getAttribute('ToNm')
            });
        }
    }
    if (prcCallInfo) {
        const parsed = parseRcHeaderString(prcCallInfo);
        extend(session.rcHeaders, parsed);
    }
}

async function setRecord(session: WebPhoneSession, flag: boolean): Promise<any> {
    const message = flag ? messages.startRecord : messages.stopRecord;

    if ((session.__isRecording && !flag) || (!session.__isRecording && flag)) {
        const data = await session.sendInfoAndRecieveResponse(message);
        session.__isRecording = !!flag;
        return data;
    }
}

function enableReceiverTracks(session: WebPhoneSession, enable: boolean): void {
    const sessionDescriptionHandler = session.sessionDescriptionHandler as SessionDescriptionHandler;
    const peerConnection = sessionDescriptionHandler.peerConnection;
    if (!peerConnection) {
        (session as any).logger.error('Peer connection closed.');
        return;
    }

    peerConnection.getReceivers().forEach((receiver) => {
        if (receiver.track) {
            receiver.track.enabled = enable;
        }
    });
}

function enableSenderTracks(session: WebPhoneSession, enable: boolean): void {
    const sessionDescriptionHandler = session.sessionDescriptionHandler as SessionDescriptionHandler;
    const peerConnection = sessionDescriptionHandler.peerConnection;
    if (!peerConnection) {
        (session as any).logger.error('Peer connection closed.');
        return;
    }

    peerConnection.getSenders().forEach((sender) => {
        if (sender.track) {
            sender.track.enabled = enable;
        }
    });
}

function setHold(session: WebPhoneSession, hold: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
        // Just resolve if we are already in correct state
        if (session.held === hold) {
            return resolve();
        }

        const options: SessionInviteOptions = {
            requestDelegate: {
                onAccept: (): void => {
                    session.held = hold;
                    enableReceiverTracks(session, !session.held);
                    enableSenderTracks(session, !session.held && !session.muted);
                    resolve();
                },
                onReject: (): void => {
                    (session as any).logger.warn('re-invite request was rejected');
                    enableReceiverTracks(session, !session.held);
                    enableSenderTracks(session, !session.held && !session.muted);
                    reject();
                }
            }
        };

        // Session properties used to pass options to the SessionDescriptionHandler:
        //
        // 1) Session.sessionDescriptionHandlerOptions
        //    SDH options for the initial INVITE transaction.
        //    - Used in all cases when handling the initial INVITE transaction as either UAC or UAS.
        //    - May be set directly at anytime.
        //    - May optionally be set via constructor option.
        //    - May optionally be set via options passed to Inviter.invite() or Invitation.accept().
        //
        // 2) Session.sessionDescriptionHandlerOptionsReInvite
        //    SDH options for re-INVITE transactions.
        //    - Used in all cases when handling a re-INVITE transaction as either UAC or UAS.
        //    - May be set directly at anytime.
        //    - May optionally be set via constructor option.
        //    - May optionally be set via options passed to Session.invite().

        const sessionDescriptionHandlerOptions =
            session.sessionDescriptionHandlerOptionsReInvite as SessionDescriptionHandlerOptions;
        sessionDescriptionHandlerOptions.hold = hold;
        session.sessionDescriptionHandlerOptionsReInvite = sessionDescriptionHandlerOptions;

        // Send re-INVITE
        session
            .invite(options)
            .then(() => {
                // preemptively enable/disable tracks
                enableReceiverTracks(session, !hold);
                enableSenderTracks(session, !hold && !session.muted);
            })
            .catch((error: Error) => {
                if (error instanceof RequestPendingError) {
                    (session as any).logger.error(`A hold request is already in progress.`);
                }
                reject(error);
            });
    });
}

function stopPlaying(session: WebPhoneSession): void {
    session.userAgent.audioHelper.playOutgoing(false);
    session.userAgent.audioHelper.playIncoming(false);
}

export function onSessionDescriptionHandlerCreated(session: WebPhoneSession): void {
    if (!session.userAgent.enableQos) {
        return;
    }
    (session as any).logger.log('SessionDescriptionHandler created');
    startQosStatsCollection(session);
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
        devices.forEach((device) =>
            (session as any).logger.log(`${device.kind} = ${device.label} ${JSON.stringify(device)}`)
        );
    });
}

function setupUserAgentCoreEvent(session: WebPhoneSession) {
    if (session.__userAgentCoreEventsSetup) {
        return;
    }
    const userAgentCore: WehPhoneUserAgentCore = session.userAgent.userAgentCore;
    userAgentCore.on(Events.Session.UpdateReceived, (payload) => session.emit(Events.Session.UpdateReceived, payload));
    userAgentCore.on(Events.Session.MoveToRcv, (payload) => session.emit(Events.Session.MoveToRcv, payload));
    // RC_SIP_INFO event is for internal use
    userAgentCore.on('RC_SIP_INFO', (payload) => session.emit('RC_SIP_INFO', payload));
    session.__userAgentCoreEventsSetup = true;
}

function stopMediaStreamStats(session: WebPhoneSession) {
    if (session.mediaStreams) {
        (session as any).logger.log('Releasing media streams');
        session.mediaStreams.release();
    }
}
