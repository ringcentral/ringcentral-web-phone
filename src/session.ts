import { Invitation, Inviter } from 'sip.js';
import { IncomingResponse } from 'sip.js/lib/core';

import { extend } from './utils';
import { messages } from './constants';
import { WebPhoneUserAgent } from './userAgent';

export interface RCHeaders {
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

interface ReplyOptions {
    replyType: number; //TODO Use enum
    replyText: string;
    timeValue: string;
    timeUnits: string;
    callbackDirection: string;
}

export interface RTCPeerConnectionLegacy extends RTCPeerConnection {
    getRemoteStreams: () => MediaStream[];
    getLocalStreams: () => MediaStream[];
}

type CommonSession = {
    rcHeaders?: RCHeaders;
    userAgent: WebPhoneUserAgent;
    __patched: boolean;
    canUseRCMCallControl: typeof canUseRCMCallControl;
    createSessionMessage: typeof createSessionMessage;
    ignore: typeof ignore;
    receiveRequest: typeof receiveRequest;
    replyWithMessage: typeof replyWithMessage;
    sendReceiveConfirm: typeof sendReceiveConfirm;
    sendSessionMessage: typeof sendSessionMessage;
    toVoicemail: typeof toVoicemail;
};

export type WebPhoneSession = WebPhoneInvitation | WebPhoneInviter;

export type WebPhoneInvitation = Invitation & CommonSession;

export type WebPhoneInviter = Inviter & CommonSession;

const mediaCheckTimer = 2000;

export function patchWebphoneSession(session: WebPhoneSession): WebPhoneSession {
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
    session.whisper = whisper.bind(session);
    session.barge = barge.bind(session);

    session.mute = mute.bind(session);
    session.unmute = unmute.bind(session);
    session.onLocalHold = onLocalHold.bind(session);

    session.media = session.ua.media; //TODO Remove
    session.addTrack = addTrack.bind(session);
    session.stopMediaStats = stopMediaStats.bind(session);
    session.getIncomingInfoContent = getIncomingInfoContent.bind(session);
    session.sendMoveResponse = sendMoveResponse.bind(session);
    session.sendReceive = sendReceive.bind(session);
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

    session.on('reinviteAccepted', patchIncomingSession);

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
    session.receiveRequest = receiveRequest.bind(session);
    session.replyWithMessage = replyWithMessage.bind(session);
    session.sendReceiveConfirm = sendReceiveConfirm.bind(session);
    session.sendSessionMessage = sendSessionMessage.bind(session);
    session.toVoicemail = toVoicemail.bind(session);
}

const parseRcHeaderString = (str = ''): { string?: string } => {
    const pairs = str.split(/; */).filter(pair => pair.includes('=')); // skip things that don't look like key=value
    return pairs.reduce((seed, pair) => {
        let [key, value] = pair.split('=');
        key = key.trim();
        value = value.trim();
        // only assign once
        seed[key] = seed[key] || value;
        return seed;
    }, {});
};

const parseRcHeader = (session: WebPhoneSession): void => {
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
        if (prcCallInfo) {
            const parsed = parseRcHeaderString(prcCallInfo);
            extend(session.rcHeaders, parsed);
        }
    }
};

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

//FIXME: Return type has changed and loggin has been included here itself
async function sendReceiveConfirm(this: WebPhoneSession): Promise<void> {
    return this.sendSessionMessage(messages.receiveConfirm)
        .then(() => (this as any).logger.log('sendReceiveConfirm success'))
        .catch(error =>
            (this as any).logger.error(`failed to send receive confirmation via SIP MESSAGE due to ${error}`)
        );
}

//FIXME: Return type has changed
function sendSessionMessage(this: WebPhoneSession, options): Promise<IncomingResponse> {
    if (!this.rcHeaders) {
        (this as any).logger.error("Can't send SIP MESSAGE related to session: no RC headers available");
    }
    return this.userAgent.sendMessage(this.rcHeaders.from, this.createSessionMessage(options));
}

//FIXME: Return type has changed
function ignore(this: WebPhoneSession): Promise<IncomingResponse> {
    return this.sendReceiveConfirm().then(() => this.sendSessionMessage(messages.ignore));
}

//FIXME: Return type has changed
function toVoicemail(this: WebPhoneSession): Promise<IncomingResponse> {
    return this.sendReceiveConfirm().then(() => this.sendSessionMessage(messages.toVoicemail));
}

//FIXME: Return type has changed
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
