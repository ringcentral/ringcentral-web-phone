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

import { WebPhoneOptions } from './index';
import { WebPhoneTransport, createWebPhoneTransport } from './transport';
import { AudioHelper } from './audioHelper';
import { Events } from './events';
import { patchIncomingWebphoneSession, patchWebphoneSession, WebPhoneSession } from './session';

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

export interface WebPhoneUserAgent extends UserAgent {
    media?: any;
    defaultHeaders?: string[];
    enableQos?: boolean;
    enableMediaReportLogging?: boolean;
    qosCollectInterval?: number;
    sipInfo?: any;
    audioHelper?: AudioHelper;
    transport: WebPhoneTransport;
    regId?: number;
    instanceId?: string;
    registerer?: Registerer;
    modifiers?: SessionDescriptionHandlerModifier[];
    earlyMedia?: boolean;
    constraints?: object;
    // FIXME: REturn should be session type
    invite?: (number: string, options: InviteOptions) => Promise<void>;
    // FIXME: REturn should be session type
    switchFrom?: (activeCall: ActiveCallInfo, options: InviteOptions) => any;
    off?: typeof EventEmitter.prototype.off;
    on?: typeof EventEmitter.prototype.on;
    emit?: typeof EventEmitter.prototype.emit;
    register?: () => Promise<void>;
    unregister?: () => Promise<void>;
    sendMessage?: (to: string, messageData: string) => Promise<IncomingResponse>;
    createRcMessage?: (options: any) => string;
}

export interface InviteOptions {
    fromNumber?: string;
    homeCountryId?: string;
    extraHeaders?: string[];
    RTCConstraints?: any;
}

export function createWebPhoneUserAgent(
    configuration: UserAgentOptions,
    sipInfo: any,
    options: WebPhoneOptions,
    id: string
): WebPhoneUserAgent {
    const extraConfiguration: UserAgentOptions = {
        delegate: {
            onConnect: (): Promise<void> => userAgent.register(),
            onInvite: (invitation: WebPhoneSession): void => {
                userAgent.audioHelper.playIncoming(true);
                // FIXME:
                patchIncomingWebphoneSession(invitation);
                // patchIncomingSession(session);
                (invitation as any).logger.log('UA recieved incoming call invite');
                invitation.sendReceiveConfirm();
                userAgent.emit(Events.UserAgent.Invite, invitation);
            },
            onNotify: (notification): void => {
                const event = notification.request.getHeader('Event');
                if (event === '') {
                    userAgent.emit('provisionUpdate');
                }
                (userAgent as any).logger.log('UA recieved notify');
                notification.accept();
            }
        }
    };
    const extendedConfiguration = Object.assign({}, extraConfiguration, configuration);
    const userAgent: WebPhoneUserAgent = new UserAgent(extendedConfiguration) as WebPhoneUserAgent;
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
    const eventEmitter = new EventEmitter();
    (userAgent as any)._transport = createWebPhoneTransport(userAgent.transport, options);
    (userAgent as any).onTransportDisconnect = onTransportDisconnect.bind(userAgent);
    userAgent.on = eventEmitter.on.bind(eventEmitter);
    userAgent.off = eventEmitter.off.bind(eventEmitter);
    userAgent.emit = eventEmitter.emit.bind(eventEmitter);
    userAgent.register = register.bind(userAgent);
    userAgent.unregister = unregister.bind(userAgent);
    userAgent.invite = invite.bind(userAgent);
    userAgent.sendMessage = sendMessage.bind(userAgent);
    userAgent.createRcMessage = createRcMessage.bind(userAgent);
    userAgent.switchFrom = switchFrom.bind(userAgent);

    userAgent.start();
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

function createRcMessage(this: WebPhoneUserAgent, options: any): string {
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

// FIXME: ClientContext class has been removed. New type is IncomingResponse
function sendMessage(this: WebPhoneUserAgent, to: string, messageData: string): Promise<IncomingResponse> {
    const extraHeaders = [`P-rc-ws: ${this.contact}`];
    const messager = new Messager(this, UserAgent.makeURI(to), messageData, 'x-rc/agent', { extraHeaders });

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
            // FIXME: Verify this
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

// FIXME: return type should be WebphoneSession
function invite(this: WebPhoneUserAgent, number: string, options: InviteOptions = {}): any {
    const inviterOptions: InviterOptions = {};
    inviterOptions.extraHeaders = (options.extraHeaders || [])
        .concat(this.defaultHeaders)
        .concat([
            `P-Asserted-Identity: sip: ${(options.fromNumber || this.sipInfo.username) + '@' + this.sipInfo.domain}`
        ]) //FIXME: Phone Number?
        .concat(options.homeCountryId ? [`P-rc-country-id: ${options.homeCountryId}`] : []); //FIXME: Backend should know it already

    options.RTCConstraints = options.RTCConstraints || {
        optional: [{ DtlsSrtpKeyAgreement: 'true' }]
    };
    inviterOptions.sessionDescriptionHandlerModifiers = this.modifiers;
    inviterOptions.sessionDescriptionHandlerOptions = { constraints: this.constraints };
    inviterOptions.earlyMedia = this.earlyMedia;
    // FIXME:
    this.audioHelper.playOutgoing(true);
    (this as any).logger.log(`Invite to ${number} created with playOutgoing set to true`);
    const inviter = new Inviter(this, UserAgent.makeURI(`sip:${number}@${this.sipInfo.domain}`), inviterOptions);
    inviter.invite({
        requestDelegate: {
            onAccept: (): void => {
                this.emit(Events.UserAgent.InviteSent);
            }
        }
    });
    // FIXME:
    // return patchSession(this.__invite(number, options) as any);
}

/**
 * Support to switch call from other device to current web phone device
 * need active call information from details presence API for switching
 * https://developers.ringcentral.com/api-reference/Detailed-Extension-Presence-with-SIP-Event
 */

// FIXME: return type should be WebphoneSession
function switchFrom(this: WebPhoneUserAgent, activeCall: ActiveCallInfo, options: InviteOptions = {}): any {
    const replaceHeaders = [
        `Replaces: ${activeCall.id};to-tag=${activeCall.sipData.fromTag};from-tag=${activeCall.sipData.toTag}`,
        'RC-call-type: replace'
    ];
    const [toNumber, fromNumber] =
        activeCall.direction === 'Outbound' ? [activeCall.to, activeCall.from] : [activeCall.from, activeCall.to];
    options.extraHeaders = (options.extraHeaders || []).concat(replaceHeaders);
    options.fromNumber = options.fromNumber || fromNumber;
    return this.invite(toNumber, options);
}
