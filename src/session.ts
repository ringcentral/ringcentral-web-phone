import { EventEmitter } from 'events';
import type {
  Invitation,
  InvitationAcceptOptions,
  Inviter,
  SessionInviteOptions,
  SessionReferOptions,
  URI,
  Session,
} from 'sip.js';
import { RequestPendingError, UserAgent } from 'sip.js';
import type {
  IncomingRequestMessage,
  IncomingResponse,
  OutgoingInviteRequest,
  OutgoingReferRequest,
  OutgoingRequestDelegate,
  RequestOptions,
} from 'sip.js/lib/core';
import { fromBodyLegacy } from 'sip.js/lib/core';
import { SessionState } from 'sip.js/lib/api/session-state';
import type {
  SessionDescriptionHandler,
  SessionDescriptionHandlerOptions,
} from 'sip.js/lib/platform/web/session-description-handler';

import { extend } from './utils';
import type { Command } from './constants';
import { responseTimeout, messages } from './constants';
import type { WebPhoneUserAgent } from './userAgent';
import { Events } from './events';
import type { WehPhoneUserAgentCore } from './userAgentCore';
import { startQosStatsCollection } from './qos';

export interface QosStats {
  cpuRC?: string;
  cpuOS?: string;
  ram?: string;
  netType?: string;
}

/**
 * Object representing all the headers used by RingCentral backend
 */
export interface RCHeaders {
  body?: string;
  reqid?: number;
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
  replyType: number; // FIXME: Use enum
  replyText: string;
  timeValue?: string;
  timeUnits?: string;
  callbackDirection?: string;
}

export class CommonSession {
  /** @ignore */
  public __isRecording?: boolean;
  /** @ignore */
  public __localHold?: boolean;
  /** @ignore */
  public __patched?: boolean;
  /** @ignore */
  public __userAgentCoreEventsSetup?: boolean;
  /** Flag to check if the call is on hold or not */
  public held?: boolean;
  /** Options to represent dom elements where media stream should be loaded */
  public media?: { local?: HTMLMediaElement; remote?: HTMLMediaElement };
  /** Flag to indicate if media stats are being collected */
  public mediaStatsStarted?: boolean;
  /** MediaStreams class instance which has the logic to collect media stream stats */
  /** Flag to check if the call is muted or not */
  public muted?: boolean;
  /** Counter to represent how many media stats report were missed because of no audio */
  public noAudioReportCount?: number;
  /** JOSN representation of RC headers received for an incoming call */
  public rcHeaders?: RCHeaders;
  public __qosStats?: QosStats;
  /** Flag to represent if reinvite request was sent because there was no audio reported */
  public reinviteForNoAudioSent?: boolean;
  /** Time when session was started */
  public startTime?: Date | undefined;
  /** @ignore */
  public __accept?: typeof Invitation.prototype.accept;
  /** @ignore */
  public __dispose?: typeof Session.prototype.dispose;
  /** Method to attach event listener for session specific events */
  public addListener?: typeof EventEmitter.prototype.addListener;
  /** Add track to media source */
  public addTrack?: typeof addTrack;
  /** RingCentral barge implementation */
  public barge?: typeof barge;
  /** RingCentral blind transfer implementation */
  public blindTransfer?: typeof blindTransfer;
  /**
   * @internal
   * Helper function which represents if call control features can be used or not
   */
  public canUseRCMCallControl?: typeof canUseRCMCallControl;
  /**
   * @internal
   * Create session message which would be sent to the RingCentral backend
   */
  public createSessionMessage?: typeof createSessionMessage;
  /** Sends a DTMF over the call */
  public dtmf?: typeof dtmf;
  /** Emit session specific events which will trigger all the event listeners attached */
  public emit?: typeof EventEmitter.prototype.emit;
  /** RingCentral flip implementation */
  public flip?: typeof flip;
  /** RingCentral flip implementation */
  public forward?: typeof forward;
  /** Put the call on hold */
  public hold?: typeof hold;
  /** Ignore incoming call */
  public ignore?: typeof ignore;
  /** Mute the call */
  public mute?: typeof mute;
  /** Remove event listener */
  public off: typeof EventEmitter.prototype.off;
  /** Add event listener. Same as addListener */
  public on: typeof EventEmitter.prototype.on;
  /** Add once event listener. Same as addListener */
  public once: typeof EventEmitter.prototype.once;
  /** Returns if the call is on hold locally or not */
  public onLocalHold?: typeof onLocalHold;
  /** RingCentral park implementation */
  public park?: typeof park;
  /** Send a session reinvite */
  public reinvite?: typeof reinvite;
  /** Remove event listener */
  public removeListener?: typeof EventEmitter.prototype.removeListener;
  /** Remove all event listeners */
  public removeAllListeners?: typeof EventEmitter.prototype.removeAllListeners;
  /** RingCentral reply with message implementation */
  public replyWithMessage?: typeof replyWithMessage;
  /**
   * @internal
   * Helper method that sends an INFO request to other user agent and then waits for an INFO request from the other user agent
   */
  public sendInfoAndReceiveResponse?: typeof sendInfoAndReceiveResponse;
  /**
   * @internal
   * Helper function to send INFO request with `move` instruction to RingCentral backend
   */
  public sendMoveResponse?: typeof sendMoveResponse;
  /** Send `receiveConfirm` command to backend */
  public sendReceiveConfirm?: typeof sendReceiveConfirm;
  /** Helper function to send session message to backend using UserAgent */
  public sendSessionMessage?: typeof sendSessionMessage;
  /** Start recording the call */
  public startRecord?: typeof startRecord;
  /** Stop recording the call */
  public stopRecord?: typeof stopRecord;
  /** Send incoming call to voicemail */
  public toVoicemail?: typeof toVoicemail;
  /** Transfer current call */
  public transfer?: typeof transfer;
  /** Put the call on unhold */
  public unhold?: typeof unhold;
  /** Unmute the call */
  public unmute?: typeof unmute;
  /** RingCentral warm transfer implementation */
  public warmTransfer?: typeof warmTransfer;
  /** RingCentral whisper implementation */
  public whisper?: typeof whisper;
  public setQosStats?: typeof setQosStats;
}

export type WebPhoneSession = WebPhoneInvitation | WebPhoneInviter;

/** This is an extension of the Invitation class of SIP.js
 *
 * [Reference](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.invitation.md)
 */
export interface WebPhoneInvitation extends Invitation, CommonSession {
  /**
   * Accept the invitation.
   *
   * @remarks
   * Accept the incoming INVITE request to start a Session.
   * Replies to the INVITE request with a 200 Ok response.
   * Resolves once the response sent, otherwise rejects.
   *
   * This method may reject for a variety of reasons including
   * the receipt of a CANCEL request before `accept` is able
   * to construct a response.
   * @param options - Options bucket.
   */
  accept: typeof Invitation.prototype.accept;
  /**
   * User Agent instance
   */
  userAgent: WebPhoneUserAgent;
}

/** This is an extension of the Inviter class of SIP.js
 *
 * [Reference](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.inviter.md)
 */
export interface WebPhoneInviter extends Inviter, CommonSession {
  /**
   * User Agent instance
   */
  userAgent: WebPhoneUserAgent;
}

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
  session.once = eventEmitter.once.bind(eventEmitter);
  session.addListener = eventEmitter.addListener.bind(eventEmitter);
  session.removeListener = eventEmitter.removeListener.bind(eventEmitter);
  session.removeAllListeners = eventEmitter.removeAllListeners.bind(eventEmitter);
  session.emit = eventEmitter.emit.bind(eventEmitter);
  session.sendInfoAndReceiveResponse = sendInfoAndReceiveResponse.bind(session);
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
  session.warmTransfer = warmTransfer.bind(session);
  session.blindTransfer = blindTransfer.bind(session);
  session.transfer = transfer.bind(session);
  session.hold = hold.bind(session);
  session.unhold = unhold.bind(session);
  session.dtmf = dtmf.bind(session);
  session.reinvite = reinvite.bind(session);
  session.forward = forward.bind(session); // FIXME: Not needed?
  session.__qosStats = {};
  session.setQosStats = setQosStats.bind(session);
  setupUserAgentCoreEvent(session);
  session.stateChange.addListener((newState) => {
    switch (newState) {
      case SessionState.Establishing: {
        session.emit!(Events.Session.Establishing);
        break;
      }
      case SessionState.Established: {
        stopPlaying(session);
        session.addTrack!();
        session.emit!(Events.Session.Established);
        break;
      }
      case SessionState.Terminating: {
        stopPlaying(session);
        session.emit!(Events.Session.Terminating);
        break;
      }
      case SessionState.Terminated: {
        stopPlaying(session);
        session.emit!(Events.Session.Terminated);
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
    throw Error('createSessionMessage options is undefined');
  }
  extend(options, {
    sid: this.rcHeaders.sid,
    request: this.rcHeaders.request,
    from: this.rcHeaders.to,
    to: this.rcHeaders.from,
  });
  return this.userAgent.createRcMessage!(options);
}

async function sendReceiveConfirm(this: WebPhoneSession): Promise<IncomingResponse> {
  return this.sendSessionMessage!(messages.receiveConfirm as unknown as RCHeaders)
    .then((response) => {
      (this as any).logger.log('sendReceiveConfirm success');
      return response;
    })
    .catch((error) =>
      (this as any).logger.error(`failed to send receive confirmation via SIP MESSAGE due to ${error.message}`),
    );
}

function sendSessionMessage(this: WebPhoneSession, options: RCHeaders): Promise<IncomingResponse> {
  if (!this.rcHeaders) {
    (this as any).logger.error("Can't send SIP MESSAGE related to session: no RC headers available");
  }
  return this.userAgent.sendMessage!(this.rcHeaders!.from!, this.createSessionMessage!(options));
}

async function sendInfoAndReceiveResponse(this: WebPhoneSession, command: Command, _options?: any): Promise<any> {
  const options = _options || {};
  extend(command, options);
  delete command.extraHeaders;
  return new Promise((resolve, reject) => {
    const requestDelegate: OutgoingRequestDelegate = {
      onAccept: (response: IncomingResponse): void => {
        let timeout: ReturnType<typeof setTimeout> | undefined;
        const {
          message: { statusCode, callId },
        } = response;
        if (statusCode === 200) {
          const onInfo = (message: IncomingRequestMessage): void => {
            // FIXME: I think we need this check here
            if (message.callId !== callId) {
              return;
            }
            const body = message?.body || '{}';
            let obj;

            try {
              obj = JSON.parse(body);
            } catch (e) {
              obj = {};
            }
            if (obj.response && obj.response.command === command.command && obj.response.result) {
              timeout && clearTimeout(timeout);
              this.off!('RC_SIP_INFO', onInfo);
              if (obj.response.result.code.toString() === '0') {
                return resolve(obj.response.result);
              }
              return reject(obj.response.result);
            }
          };
          timeout = setTimeout(() => {
            reject(new Error('Timeout: no reply'));
            this.off!('RC_SIP_INFO', onInfo);
          }, responseTimeout);
          this.on!('RC_SIP_INFO', onInfo);
        } else {
          reject(new Error(`The INFO response status code is: ${statusCode} (waiting for 200)`));
        }
      },
      onReject: (response) => {
        reject(new Error(`The INFO response status code is: ${response.message.statusCode} (waiting for 200)`));
      },
    };
    const requestOptions: RequestOptions = {
      extraHeaders: [...(options.extraHeaders || []), ...this.userAgent.defaultHeaders],
      body: fromBodyLegacy({
        body: JSON.stringify({ request: command }),
        contentType: 'application/json;charset=utf-8',
      }),
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

// eslint-disable-next-line max-params
function sendMoveResponse(
  this: WebPhoneSession,
  reqId: number,
  code: number,
  description: string,
  options: { extraHeaders?: Array<string> } = {},
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
            description,
          },
        },
      }),
      contentType: 'application/json;charset=utf-8',
    }),
  };
  this.info({ requestOptions });
}

function ignore(this: WebPhoneSession): Promise<IncomingResponse> {
  return this.sendReceiveConfirm!().then(() => this.sendSessionMessage!(messages.ignore));
}

function toVoicemail(this: WebPhoneSession): Promise<IncomingResponse> {
  return this.sendReceiveConfirm!().then(() => this.sendSessionMessage!(messages.toVoicemail));
}

function replyWithMessage(this: WebPhoneSession, replyOptions: ReplyOptions): Promise<IncomingResponse> {
  let body = 'RepTp="' + replyOptions.replyType + '"';

  if (replyOptions.replyType === 0) {
    body += ' Bdy="' + replyOptions.replyText + '"';
  } else if (replyOptions.replyType === 1 || replyOptions.replyType === 4) {
    body += ' Vl="' + replyOptions.timeValue + '"';
    body += ' Units="' + replyOptions.timeUnits + '"';
    body += ' Dir="' + replyOptions.callbackDirection + '"';
  }
  return this.sendReceiveConfirm!().then(() =>
    this.sendSessionMessage!({ reqid: messages.replyWithMessage.reqid, body }),
  );
}

async function flip(this: WebPhoneSession, target: string): Promise<any> {
  return this.sendInfoAndReceiveResponse!(messages.flip, { target });
}

async function whisper(this: WebPhoneSession): Promise<any> {
  return this.sendInfoAndReceiveResponse!(messages.whisper);
}

async function barge(this: WebPhoneSession): Promise<any> {
  return this.sendInfoAndReceiveResponse!(messages.barge);
}

function park(this: WebPhoneSession): Promise<any> {
  return this.sendInfoAndReceiveResponse!(messages.park);
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
    this.emit!(Events.Session.Muted, this);
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
    this.emit!(Events.Session.Unmuted, this);
  }
}

function addTrack(this: WebPhoneSession, remoteAudioEle?: HTMLVideoElement, localAudioEle?: HTMLVideoElement): void {
  const sessionDescriptionHandler = this.sessionDescriptionHandler as SessionDescriptionHandler;
  const peerConnection = sessionDescriptionHandler.peerConnection;
  let remoteAudio: HTMLMediaElement;
  let localAudio: HTMLMediaElement;

  if (remoteAudioEle && localAudioEle) {
    remoteAudio = remoteAudioEle;
    localAudio = localAudioEle;
  } else if (this.media) {
    remoteAudio = this.media.remote!;
    localAudio = this.media.local!;
  } else {
    throw new Error('HTML Media Element not Defined');
  }

  // TODO: peerConnecton.remoteMediaStream already has reciver track added thanks to default session description handler. Can we remove this code?
  let remoteStream = new MediaStream();
  if (peerConnection?.getReceivers) {
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
  if (peerConnection?.getSenders) {
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
}

async function blindTransfer(
  this: WebPhoneSession,
  target: string | URI | WebPhoneSession,
  options: SessionReferOptions = {},
): Promise<OutgoingReferRequest> {
  (this as any).logger.log('Call transfer initiated');
  const newTarget =
    typeof target === 'string' ? UserAgent.makeURI(`sip:${target}@${this.userAgent.sipInfo!.domain}`)! : target;
  return this.refer(newTarget, options);
}

async function warmTransfer(
  this: WebPhoneSession,
  target: string | URI | WebPhoneSession,
  options: SessionReferOptions = { requestOptions: { extraHeaders: [] } },
): Promise<OutgoingReferRequest> {
  options.requestOptions!.extraHeaders = (options.requestOptions!.extraHeaders || []).concat(
    this.userAgent.defaultHeaders,
  );
  const newTarget =
    typeof target === 'string' ? UserAgent.makeURI(`sip:${target}@${this.userAgent.sipInfo!.domain}`)! : target;
  (this as any).logger.log('Completing warm transfer');
  return this.refer(newTarget, options);
}

async function transfer(
  this: WebPhoneSession,
  target: string | URI | WebPhoneSession,
  options: SessionReferOptions = {},
): Promise<OutgoingReferRequest> {
  if (!options.requestOptions) {
    options.requestOptions = {};
  }
  if (!options.requestOptions.extraHeaders) {
    options.requestOptions.extraHeaders = [];
  }
  options.requestOptions.extraHeaders = [...options.requestOptions.extraHeaders, ...this.userAgent.defaultHeaders];
  return this.blindTransfer!(target, options);
}

/**
 *
 * @param this WebPhoneSessionSessionInviteOptions
 * @param options
 * @returns Promise<OutgoingInviteRequest>
 *
 * Sends a reinvite. Also makes sure to regenerate a new SDP by passing offerToReceiveAudio: true, offerToReceiveVideo: false  and iceRestart: true
 * Once the SDP is ready, the local description is set and the SDP is sent to the remote peer along with an INVITE request
 */
function reinvite(this: WebPhoneSession, options: SessionInviteOptions = {}): Promise<OutgoingInviteRequest> {
  options.sessionDescriptionHandlerOptions = {
    ...options.sessionDescriptionHandlerOptions,
    offerToReceiveAudio: true,
    offerToReceiveVideo: false,
    iceRestart: true,
  } as any;
  options.requestDelegate = options.requestDelegate || {};
  const originalOnAccept = options.requestDelegate.onAccept?.bind(options.requestDelegate);
  options.requestDelegate.onAccept = (...args): void => {
    patchIncomingWebphoneSession(this);
    originalOnAccept?.(...args);
  };
  return this.invite(options);
}

async function hold(this: WebPhoneSession): Promise<void> {
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
  this.addTrack(this.media.remote as HTMLVideoElement, this.media.local as HTMLVideoElement);
}

// eslint-disable-next-line max-params
function dtmf(this: WebPhoneSession, dtmf: string, _duration = 100, _interToneGap = 50): void {
  const duration = parseInt(_duration.toString(), 10);
  const interToneGap = parseInt(_interToneGap.toString(), 10);
  const sessionDescriptionHandler = this.sessionDescriptionHandler as SessionDescriptionHandler;
  const peerConnection = sessionDescriptionHandler.peerConnection;
  if (!peerConnection) {
    (this as any).logger.error('Peer connection closed.');
    return;
  }
  const senders = peerConnection.getSenders();
  const audioSender = senders.find((sender) => sender.track && sender.track.kind === 'audio');
  const dtmfSender: RTCDTMFSender | null = audioSender!.dtmf;
  if (dtmfSender !== undefined && dtmfSender) {
    (this as any).logger.log(`Send DTMF: ${dtmf} Duration: ${duration} InterToneGap: ${interToneGap}`);
    return dtmfSender.insertDTMF(dtmf, duration, interToneGap);
  }
  throw new Error('Send DTMF failed');
}

async function accept(this: WebPhoneSession, _options: InvitationAcceptOptions = {}): Promise<void> {
  const options = _options || {};
  options.extraHeaders = (options.extraHeaders || []).concat(this.userAgent.defaultHeaders);
  options.sessionDescriptionHandlerOptions = {
    ...options.sessionDescriptionHandlerOptions,
  };
  options.sessionDescriptionHandlerOptions.constraints = options.sessionDescriptionHandlerOptions.constraints || {
    ...this.userAgent.constraints,
    optional: [{ DtlsSrtpKeyAgreement: 'true' }],
  };
  try {
    await this.__accept!(options);
    this.startTime = new Date();
    this.emit!(Events.Session.Accepted, this.request);
  } catch (e) {
    if ((e as any).message.indexOf('Permission denied') !== -1) {
      this.emit!(Events.Session.UserMediaFailed);
    }
  }
}

// eslint-disable-next-line max-params
async function forward(
  this: WebPhoneSession,
  target: WebPhoneSession,
  acceptOptions: InvitationAcceptOptions = {},
  transferOptions: SessionReferOptions = {},
): Promise<OutgoingReferRequest> {
  await (this as WebPhoneInvitation).accept(acceptOptions);
  return new Promise((resolve) => {
    this.mute!();
    setTimeout(() => {
      resolve(this.transfer!(target, transferOptions));
    }, 700);
  });
}

async function dispose(this: WebPhoneSession) {
  this.__dispose!();
}

/* ---------------------------------------------------------- HELPER FUNCTIONS ---------------------------------------------------------- */

function parseRcHeaderString(str = ''): { [key: string]: string } {
  const pairs = str.split(/; */).filter((pair) => pair.includes('=')); // skip things that don't look like key=value
  const result: { [key: string]: string } = {};
  for (const pair of pairs) {
    let [key, value] = pair.split('=');
    key = key.trim();
    value = value.trim();
    if (!(key in result)) {
      result[key] = value;
    }
  }
  return result;
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
        sid: hdrNode.getAttribute('SID') || undefined,
        request: hdrNode.getAttribute('Req') || undefined,
        from: hdrNode.getAttribute('From') || undefined,
        to: hdrNode.getAttribute('To') || undefined,
      };
    }
    if (bdyNode) {
      extend(session.rcHeaders, {
        srvLvl: bdyNode.getAttribute('SrvLvl'),
        srvLvlExt: bdyNode.getAttribute('SrvLvlExt'),
        nm: bdyNode.getAttribute('Nm'),
        toNm: bdyNode.getAttribute('ToNm'),
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
    const data = await session.sendInfoAndReceiveResponse!(message);
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
      resolve();
      return;
    }

    const options: SessionInviteOptions = {
      requestDelegate: {
        onAccept: async (response): Promise<void> => {
          session.held = hold;
          const sessionDescriptionHandler = session.sessionDescriptionHandler as SessionDescriptionHandler;
          const peerConnection = sessionDescriptionHandler.peerConnection;
          const localSdp = peerConnection!.localDescription!.sdp;
          const match = localSdp.match(/a=(sendrecv|sendonly|recvonly|inactive)/);
          const direction = match ? match[1] : '';
          session.__localHold = response.message.statusCode === 200 && direction === 'sendonly';
          (session as any).logger.log('localhold is set to ' + session.__localHold);
          enableReceiverTracks(session, !session.held);
          enableSenderTracks(session, !session.held && !session.muted);
          resolve();
        },
        onReject: (): void => {
          (session as any).logger.warn('re-invite request was rejected');
          enableReceiverTracks(session, !session.held);
          enableSenderTracks(session, !session.held && !session.muted);
          reject(new Error('re-invite request was rejected'));
        },
      },
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
          (session as any).logger.error('A hold request is already in progress.');
        }
        reject(error);
      });
  });
}

function stopPlaying(session: WebPhoneSession): void {
  session.userAgent.audioHelper!.playOutgoing(false);
  session.userAgent.audioHelper!.playIncoming(false);
}

export function onSessionDescriptionHandlerCreated(session: WebPhoneSession): void {
  if (!session.userAgent.enableQos) {
    return;
  }
  (session as any).logger.log('SessionDescriptionHandler created');
  startQosStatsCollection(session);
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    devices.forEach((device) =>
      (session as any).logger.log(`${device.kind} = ${device.label} ${JSON.stringify(device)}`),
    );
  });
}

function setupUserAgentCoreEvent(session: WebPhoneSession) {
  if (session.__userAgentCoreEventsSetup) {
    return;
  }
  const userAgentCore: WehPhoneUserAgentCore = session.userAgent.userAgentCore;
  userAgentCore.on!(Events.Session.UpdateReceived, (payload) => session.emit!(Events.Session.UpdateReceived, payload));
  userAgentCore.on!(Events.Session.MoveToRcv, (payload) => session.emit!(Events.Session.MoveToRcv, payload));
  // RC_SIP_INFO event is for internal use
  userAgentCore.on!('RC_SIP_INFO', (payload) => session.emit!('RC_SIP_INFO', payload));
  session.__userAgentCoreEventsSetup = true;
}

function onLocalHold(this: WebPhoneSession): boolean {
  return this.__localHold!;
}

function setQosStats(this: WebPhoneSession, stats: QosStats) {
  this.__qosStats!.cpuOS = stats.cpuOS || '0:0:0';
  this.__qosStats!.cpuRC = stats.cpuRC || '0:0:0';
  this.__qosStats!.ram = stats.ram || '0:0:0';
  this.__qosStats!.netType = stats.netType || undefined;
}
