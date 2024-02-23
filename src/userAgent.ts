import { EventEmitter } from 'events';
import type { UserAgentOptions, InviterOptions, SessionDescriptionHandlerModifier } from 'sip.js';
import { UserAgent, UserAgentState, Registerer, RegistererState, Inviter, Messager } from 'sip.js';
import type { IncomingResponse } from 'sip.js/lib/core';
import type { WebPhoneTransport } from './transport';
import { createWebPhoneTransport } from './transport';

import type { SipInfo, WebPhoneOptions } from './index';
import { AudioHelper } from './audioHelper';
import { Events } from './events';
import type { RCHeaders, WebPhoneInvitation, WebPhoneSession } from './session';
import { onSessionDescriptionHandlerCreated, patchIncomingWebphoneSession, patchWebphoneSession } from './session';
import { patchUserAgentCore } from './userAgentCore';

/** RingCentral Active call info */
export interface ActiveCallInfo {
  id: string;
  from: string;
  to: string;
  direction: string;
  sipData: {
    toTag: string;
    fromTag: string;
  };
}
/**
 * WebPhoneUserAgent that makes SIP calls on behalf of the user
 */
export interface WebPhoneUserAgent extends UserAgent {
  /** Utility class to help play incoming and outgoing cues for calls */
  audioHelper: AudioHelper;
  /** RTC constraints to be passed to browser when requesting for media stream */
  constraints?: object;
  /**
   * @internal
   * Contains list of default headers needed to be sent to RingCentral SIP server
   */
  defaultHeaders: string[];
  /**
   * If `true`, the first answer to the local offer is immediately utilized for media.
   * Requires that the INVITE request MUST NOT fork.
   * Has no effect if `inviteWithoutSdp` is true.
   */
  earlyMedia?: boolean;
  /** If `true`, logs media stats when an connection is established */
  enableMediaReportLogging?: boolean;
  /** If `true`, Qality of service of the call is generated and published to RingCentral server once the call ends */
  enableQos?: boolean;
  /** instanceId used while registering to the backend SIP server */
  instanceId: string;
  /** HTML media elements where local and remote audio and video streams should be sent */
  media?: { local?: HTMLMediaElement; remote?: HTMLMediaElement };
  /** SDP modifiers to be used when generating local offer or creating answer */
  modifiers?: SessionDescriptionHandlerModifier[];
  /** Time interval in ms on how often should the quality of service data be collected */
  qosCollectInterval?: number;
  /** regId used while registering to the backend SIP server */
  regId?: number;
  /**
   * @internal
   * Instance of Registerer which will be used to register the device
   */
  registerer?: Registerer;
  /** sip info received by RingCentral backend server when provisioning a device */
  sipInfo?: SipInfo;
  /** Transport class over which communication would take place */
  transport: WebPhoneTransport;
  /** To add event listeners to be triggered whenever an event on UserAgent is emitted */
  addListener?: typeof EventEmitter.prototype.addListener;
  /**
   * @internal
   * Helper function to create RingCentral message
   */
  createRcMessage?: (options: RCHeaders) => string;
  /** Emit event along with data which will trigger all listerenes attached to that event */
  emit: typeof EventEmitter.prototype.emit;
  /** Send call invitation */
  invite: (number: string, options: InviteOptions) => WebPhoneSession;
  /** Remove event listener from list of listeners for that event */
  off: typeof EventEmitter.prototype.off;
  /** To add event listeners to be triggered whenever an event on UserAgent is emitted */
  on: typeof EventEmitter.prototype.on;
  /** Add once event listener from list of listeners for that event */
  once: typeof EventEmitter.prototype.once;
  /**
   * @internal
   * Function which will be called when session is created. It's value is picked using options.onSession when instantiating userAgent object
   */
  onSession?: (session: WebPhoneSession) => void;
  /** Register device with the registrar */
  register?: () => Promise<void>;
  /** Remove event listener from list of listeners for that event */
  removeListener?: typeof EventEmitter.prototype.removeListener;
  /** Remove all event listener from list of listeners for that event */
  removeAllListeners?: typeof EventEmitter.prototype.removeAllListeners;
  /**
   * @internal
   * Utility function used to send message to backend server
   */
  sendMessage?: (to: string, messageData: string) => Promise<IncomingResponse>;
  /** To switch from another device to this device */
  switchFrom: (activeCall: ActiveCallInfo, options: InviteOptions) => WebPhoneSession;
  /** Unregister device from the registrar */
  unregister: () => Promise<void>;
}

export interface InviteOptions {
  fromNumber?: string;
  homeCountryId?: string;
  extraHeaders?: string[];
  RTCConstraints?: any;
}

/** @ignore */
// eslint-disable-next-line max-params
export function createWebPhoneUserAgent(
  configuration: UserAgentOptions,
  sipInfo: SipInfo,
  options: WebPhoneOptions,
  id: string,
): WebPhoneUserAgent {
  const extraConfiguration: UserAgentOptions = {
    delegate: {
      onConnect: (): Promise<void> => userAgent.register!(),
      onInvite: (invitation: WebPhoneInvitation): void => {
        userAgent.audioHelper!.playIncoming(true);
        invitation.delegate = {};
        invitation.delegate.onSessionDescriptionHandler = () => onSessionDescriptionHandlerCreated(invitation);
        patchWebphoneSession(invitation);
        patchIncomingWebphoneSession(invitation);
        (invitation as any).logger.log('UA received incoming call invite');
        invitation.sendReceiveConfirm!();
        userAgent.emit!(Events.UserAgent.Invite, invitation);
      },
      onNotify: (notification): void => {
        const event = notification.request.getHeader('Event');
        if (event === '') {
          userAgent.emit!(Events.UserAgent.ProvisionUpdate);
        }
        (userAgent as any).logger.log('UA received notify');
        notification.accept();
      },
    },
  };
  const extendedConfiguration = {
    ...extraConfiguration,
    ...configuration,
  };
  const userAgent: WebPhoneUserAgent = new UserAgent(extendedConfiguration) as WebPhoneUserAgent;
  const eventEmitter = new EventEmitter();
  userAgent.on = eventEmitter.on.bind(eventEmitter);
  userAgent.off = eventEmitter.off.bind(eventEmitter);
  userAgent.once = eventEmitter.once.bind(eventEmitter);
  userAgent.addListener = eventEmitter.addListener.bind(eventEmitter);
  userAgent.removeListener = eventEmitter.removeListener.bind(eventEmitter);
  userAgent.removeAllListeners = eventEmitter.removeAllListeners.bind(eventEmitter);
  userAgent.defaultHeaders = [`P-rc-endpoint-id: ${id}`, `Client-id: ${options.clientId}`];
  userAgent.regId = options.regId;
  userAgent.media = {};
  userAgent.enableQos = options.enableQos;
  userAgent.enableMediaReportLogging = options.enableMediaReportLogging;
  userAgent.qosCollectInterval = options.qosCollectInterval;
  if (options.media?.remote && options.media.local) {
    userAgent.media.remote = options.media.remote;
    userAgent.media.local = options.media.local;
  } else {
    userAgent.media = undefined;
  }
  userAgent.registerer = new Registerer(userAgent, {
    regId: userAgent.regId,
    instanceId: userAgent.instanceId,
    extraHeaders: userAgent.defaultHeaders,
  });
  userAgent.sipInfo = sipInfo;
  userAgent.modifiers = options.modifiers;
  userAgent.constraints = options.mediaConstraints;
  userAgent.earlyMedia = options.earlyMedia;
  userAgent.audioHelper = new AudioHelper(options.audioHelper);
  userAgent.onSession = options.onSession;
  (userAgent as any)._transport = createWebPhoneTransport(userAgent.transport, options);
  (userAgent as any).onTransportDisconnect = onTransportDisconnect.bind(userAgent);
  userAgent.emit = eventEmitter.emit.bind(eventEmitter);
  userAgent.register = register.bind(userAgent);
  userAgent.unregister = unregister.bind(userAgent);
  userAgent.invite = invite.bind(userAgent);
  userAgent.sendMessage = sendMessage.bind(userAgent);
  userAgent.createRcMessage = createRcMessage.bind(userAgent);
  userAgent.switchFrom = switchFrom.bind(userAgent);
  patchUserAgentCore(userAgent);
  userAgent.start();
  userAgent.stateChange.addListener((newState) => {
    switch (newState) {
      case UserAgentState.Started: {
        userAgent.emit!(Events.UserAgent.Started);
        break;
      }
      case UserAgentState.Stopped: {
        userAgent.emit!(Events.UserAgent.Stopped);
        break;
      }
    }
  });
  userAgent.registerer.stateChange.addListener((newState) => {
    switch (newState) {
      case RegistererState.Registered: {
        userAgent.emit!(Events.UserAgent.Registered);
        break;
      }
      case RegistererState.Unregistered: {
        userAgent.emit!(Events.UserAgent.Unregistered);
        break;
      }
    }
  });

  return userAgent;
}

function onTransportDisconnect(this: WebPhoneUserAgent, error?: Error): void {
  // Patch it so that reconnection is managed by WebPhoneTransport
  if (this.state === UserAgentState.Stopped) {
    return;
  }
  if (this.delegate?.onDisconnect) {
    this.delegate.onDisconnect(error);
  }
  if (error) {
    this.transport.reconnect!();
  }
}

function createRcMessage(this: WebPhoneUserAgent, options: RCHeaders): string {
  options.body = options.body || '';
  return (
    '<Msg>' +
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
    this.sipInfo!.authorizationId +
    '" ' +
    options.body +
    '/>' +
    '</Msg>'
  );
}

function sendMessage(this: WebPhoneUserAgent, _to: string, messageData: string): Promise<IncomingResponse> {
  const extraHeaders = [`P-rc-ws: ${this.contact}`];
  // For some reason, UserAgent.makeURI is unable to parse username starting with #
  // Fix in later release if this is fixed by SIP.js
  let to = _to;
  const [user] = to.split('@');
  to = to.startsWith('#') ? `sip:${to.substring(1)}` : `sip:${to}`;
  const uri = UserAgent.makeURI(to)!;
  uri.user = user;
  const messager = new Messager(this, uri, messageData, 'x-rc/agent', {
    extraHeaders,
  });

  return new Promise((resolve, reject) => {
    messager.message({
      requestDelegate: {
        onAccept: resolve,
        onReject: reject,
      },
    });
  });
}

async function register(this: WebPhoneUserAgent): Promise<void> {
  await this.registerer!.register({
    requestDelegate: {
      onReject: (response): void => {
        if (!response) {
          return;
        }
        if (this.transport.isSipErrorCode!(response.message.statusCode)) {
          this.transport.onSipErrorCode!();
        }
        this.emit!(Events.UserAgent.RegistrationFailed, response);
        (this as any).logger.warn('UA Registration Failed');
      },
    },
  });
}

async function unregister(this: WebPhoneUserAgent): Promise<void> {
  await this.registerer!.unregister();
}

function invite(this: WebPhoneUserAgent, number: string, options: InviteOptions = {}): WebPhoneSession {
  const inviterOptions: InviterOptions = {};
  inviterOptions.extraHeaders = [
    ...(options.extraHeaders || []),
    ...this.defaultHeaders,
    `P-Asserted-Identity: sip:${(options.fromNumber || this.sipInfo!.username) + '@' + this.sipInfo!.domain}`,
    ...(options.homeCountryId ? [`P-rc-country-id: ${options.homeCountryId}`] : []),
  ];

  options.RTCConstraints = options.RTCConstraints || {
    ...this.constraints,
    optional: [{ DtlsSrtpKeyAgreement: 'true' }],
  };
  inviterOptions.sessionDescriptionHandlerModifiers = this.modifiers;
  inviterOptions.sessionDescriptionHandlerOptions = {
    constraints: options.RTCConstraints,
  };
  inviterOptions.earlyMedia = this.earlyMedia;
  inviterOptions.delegate = {
    onSessionDescriptionHandler: (): void => onSessionDescriptionHandlerCreated(inviter),
    onNotify: (notification) => notification.accept(),
  };
  this.audioHelper!.playOutgoing(true);
  (this as any).logger.log(`Invite to ${number} created with playOutgoing set to true`);
  const inviter: WebPhoneSession = new Inviter(
    this,
    UserAgent.makeURI(`sip:${number}@${this.sipInfo!.domain}`)!,
    inviterOptions,
  ) as WebPhoneSession;
  inviter
    .invite({
      requestDelegate: {
        onAccept: (inviteResponse) => {
          inviter.startTime = new Date();
          inviter.emit!(Events.Session.Accepted, inviteResponse.message);
        },
        onProgress: (inviteResponse) => {
          inviter.emit!(Events.Session.Progress, inviteResponse.message);
        },
      },
    })
    .then(() => this.emit!(Events.UserAgent.InviteSent, inviter))
    .catch((e) => {
      if (e.message.indexOf('Permission denied') > -1) {
        inviter.emit!(Events.Session.UserMediaFailed);
      }
      throw e;
    });
  patchWebphoneSession(inviter);
  return inviter;
}

/**
 * Support to switch call from other device to current web phone device
 * need active call information from details presence API for switching
 * https://developers.ringcentral.com/api-reference/Detailed-Extension-Presence-with-SIP-Event
 */

function switchFrom(this: WebPhoneUserAgent, activeCall: ActiveCallInfo, options: InviteOptions = {}): WebPhoneSession {
  const replaceHeaders = [
    `Replaces: ${activeCall.id};to-tag=${activeCall.sipData.fromTag};from-tag=${activeCall.sipData.toTag}`,
    'RC-call-type: replace',
  ];
  const [toNumber, fromNumber] =
    activeCall.direction === 'Outbound' ? [activeCall.to, activeCall.from] : [activeCall.from, activeCall.to];
  options.extraHeaders = (options.extraHeaders || []).concat(replaceHeaders);
  options.fromNumber = options.fromNumber || fromNumber;
  const inviterOptions: InviterOptions = {
    extraHeaders: options.extraHeaders,
    sessionDescriptionHandlerOptions: {
      constraints: options.RTCConstraints || this.constraints,
    },
  };
  return this.invite!(toNumber, inviterOptions);
}
