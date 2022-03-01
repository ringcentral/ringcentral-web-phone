import { EventEmitter } from 'events';
import {
    UserAgent,
    UserAgentOptions,
    UserAgentState,
    Registerer,
    Inviter,
    InviterOptions,
    SessionDescriptionHandlerModifier,
    Messager
} from 'sip.js';
import { IncomingResponse } from 'sip.js/lib/core';
import { WebPhoneTransport, createWebPhoneTransport } from './transport';

import { WebPhoneOptions } from './index';
import { AudioHelper } from './audioHelper';
import { Events } from './events';
import {
    onSessionDescriptionHandlerCreated,
    patchIncomingWebphoneSession,
    patchWebphoneSession,
    RCHeaders,
    WebPhoneInvitation,
    WebPhoneSession
} from './session';
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
    audioHelper?: AudioHelper;
    constraints?: object;
    defaultHeaders?: string[];
    earlyMedia?: boolean;
    enableMediaReportLogging?: boolean;
    enableQos?: boolean;
    instanceId?: string;
    media?: { local?: HTMLMediaElement; remote?: HTMLMediaElement };
    modifiers?: SessionDescriptionHandlerModifier[];
    qosCollectInterval?: number;
    regId?: number;
    registerer?: Registerer;
    sipInfo?: any;
    transport: WebPhoneTransport;
    addListener?: typeof EventEmitter.prototype.addListener;
    createRcMessage?: (options: RCHeaders) => string;
    emit?: typeof EventEmitter.prototype.emit;
    invite?: (number: string, options: InviteOptions) => WebPhoneSession;
    off?: typeof EventEmitter.prototype.off;
    on?: typeof EventEmitter.prototype.on;
    onSession?: (session: WebPhoneSession) => void;
    register?: () => Promise<void>;
    removeListener?: typeof EventEmitter.prototype.removeListener;
    sendMessage?: (to: string, messageData: string) => Promise<IncomingResponse>;
    switchFrom?: (activeCall: ActiveCallInfo, options: InviteOptions) => WebPhoneSession;
    unregister?: () => Promise<void>;
}

export interface InviteOptions {
    fromNumber?: string;
    homeCountryId?: string;
    extraHeaders?: string[];
    RTCConstraints?: any;
}

/** @ignore */
export function createWebPhoneUserAgent(
    configuration: UserAgentOptions,
    sipInfo: any,
    options: WebPhoneOptions,
    id: string
): WebPhoneUserAgent {
    const extraConfiguration: UserAgentOptions = {
        delegate: {
            onConnect: (): Promise<void> => userAgent.register(),
            onInvite: (invitation: WebPhoneInvitation): void => {
                userAgent.audioHelper.playIncoming(true);
                invitation.delegate = {};
                invitation.delegate.onSessionDescriptionHandler = () => onSessionDescriptionHandlerCreated(invitation);
                patchWebphoneSession(invitation);
                patchIncomingWebphoneSession(invitation);
                (invitation as any).logger.log('UA recieved incoming call invite');
                invitation.sendReceiveConfirm();
                userAgent.emit(Events.UserAgent.Invite, invitation);
            },
            onNotify: (notification): void => {
                const event = notification.request.getHeader('Event');
                if (event === '') {
                    userAgent.emit(Events.UserAgent.ProvisionUpdate);
                }
                (userAgent as any).logger.log('UA recieved notify');
                notification.accept();
            }
        }
    };
    const extendedConfiguration = Object.assign({}, extraConfiguration, configuration);
    const userAgent: WebPhoneUserAgent = new UserAgent(extendedConfiguration) as WebPhoneUserAgent;
    const eventEmitter = new EventEmitter();
    userAgent.on = eventEmitter.on.bind(eventEmitter);
    userAgent.off = eventEmitter.off.bind(eventEmitter);
    userAgent.addListener = eventEmitter.addListener.bind(eventEmitter);
    userAgent.removeListener = eventEmitter.removeListener.bind(eventEmitter);
    userAgent.defaultHeaders = [`P-rc-endpoint-id: ${id}`, `Client-id: ${options.appKey}`];
    userAgent.regId = options.regId;
    userAgent.instanceId = options.instanceId;
    userAgent.media = {};
    userAgent.enableQos = options.enableQos;
    userAgent.enableMediaReportLogging = options.enableMediaReportLogging;
    userAgent.qosCollectInterval = options.qosCollectInterval;
    if (options.media && options.media.remote && options.media.local) {
        userAgent.media.remote = options.media.remote;
        userAgent.media.local = options.media.local;
    } else {
        userAgent.media = null;
    }
    userAgent.registerer = new Registerer(userAgent, {
        regId: userAgent.regId,
        instanceId: userAgent.instanceId,
        extraHeaders: userAgent.defaultHeaders
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
                userAgent.emit(Events.UserAgent.Started);
                break;
            }
            case UserAgentState.Stopped: {
                userAgent.emit(Events.UserAgent.Stopped);
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
    if (this.delegate && this.delegate.onDisconnect) {
        this.delegate.onDisconnect(error);
    }
    if (error) {
        this.transport.reconnect();
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
        this.sipInfo.authorizationId +
        '" ' +
        options.body +
        '/>' +
        '</Msg>'
    );
}

// DOCUMENT: ClientContext class has been removed. New type is IncomingResponse
function sendMessage(this: WebPhoneUserAgent, to: string, messageData: string): Promise<IncomingResponse> {
    const extraHeaders = [`P-rc-ws: ${this.contact}`];
    // For some reason, UserAgent.makeURI is unable to parse username starting with #
    // Fix in later release if this is fixed by SIP.js
    const [user] = to.split('@');
    to = to.startsWith('#') ? `sip:${to.substring(1)}` : `sip:${to}`;
    const uri = UserAgent.makeURI(to);
    uri.user = user;
    const messager = new Messager(this, uri, messageData, 'x-rc/agent', { extraHeaders });

    return new Promise((resolve, reject) => {
        messager.message({
            requestDelegate: {
                onAccept: resolve,
                onReject: reject
            }
        });
    });
}

async function register(this: WebPhoneUserAgent): Promise<void> {
    await this.registerer.register({
        requestDelegate: {
            onAccept: (): void => {
                this.emit(Events.UserAgent.Registrerd);
            },
            // FIXME: Test this
            onReject: (response): void => {
                if (!response) {
                    return;
                }
                if (this.transport.isSipErrorCode(response.message.statusCode)) {
                    this.transport.onSipErrorCode();
                }
                (this as any).logger.warn('UA Registration Failed');
            }
        }
    });
}

async function unregister(this: WebPhoneUserAgent): Promise<void> {
    await this.registerer.unregister({
        requestDelegate: {
            onAccept: (): void => {
                this.emit(Events.UserAgent.Unregistrerd);
            }
        }
    });
}

function invite(this: WebPhoneUserAgent, number: string, options: InviteOptions = {}): WebPhoneSession {
    const inviterOptions: InviterOptions = {};
    inviterOptions.extraHeaders = [
        ...(options.extraHeaders || []),
        ...this.defaultHeaders,
        `P-Asserted-Identity: sip: ${(options.fromNumber || this.sipInfo.username) + '@' + this.sipInfo.domain}`,
        ...(options.homeCountryId ? [`P-rc-country-id: ${options.homeCountryId}`] : [])
    ];

    // FIXME: Need to check this
    options.RTCConstraints =
        options.RTCConstraints || Object.assign({}, this.constraints, { optional: [{ DtlsSrtpKeyAgreement: 'true' }] });
    inviterOptions.sessionDescriptionHandlerModifiers = this.modifiers;
    inviterOptions.sessionDescriptionHandlerOptions = { constraints: options.RTCConstraints };
    inviterOptions.earlyMedia = this.earlyMedia;
    inviterOptions.delegate = {
        onSessionDescriptionHandler: (): void => onSessionDescriptionHandlerCreated(inviter),
        onNotify: (notification) => notification.accept()
    };
    this.audioHelper.playOutgoing(true);
    (this as any).logger.log(`Invite to ${number} created with playOutgoing set to true`);
    const inviter: WebPhoneSession = new Inviter(
        this,
        UserAgent.makeURI(`sip:${number}@${this.sipInfo.domain}`),
        inviterOptions
    );
    inviter.invite().then(() => this.emit(Events.UserAgent.InviteSent));
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
        'RC-call-type: replace'
    ];
    const [toNumber, fromNumber] =
        activeCall.direction === 'Outbound' ? [activeCall.to, activeCall.from] : [activeCall.from, activeCall.to];
    options.extraHeaders = (options.extraHeaders || []).concat(replaceHeaders);
    options.fromNumber = options.fromNumber || fromNumber;
    const inviterOptions: InviterOptions = {
        extraHeaders: options.extraHeaders,
        sessionDescriptionHandlerOptions: { constraints: options.RTCConstraints || this.constraints }
    };
    return this.invite(toNumber, inviterOptions);
}
