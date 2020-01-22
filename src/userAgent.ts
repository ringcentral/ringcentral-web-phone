import {ClientContext, UA} from 'sip.js';
import {AudioHelper} from './audioHelper';
import {patchSession, patchIncomingSession, WebPhoneSession} from './session';
import {TransportConstructorWrapper, WebPhoneSIPTransport} from './sipTransportConstructor';

export interface WebPhoneUserAgent extends UA {
    media: any;
    defaultHeaders: any;
    enableQos: boolean;
    enableMediaReportLogging:boolean;
    qosCollectInterval: number;
    sipInfo: any;
    audioHelper: AudioHelper;
    onSession: (session: WebPhoneSession) => any;
    createRcMessage: typeof createRcMessage;
    sendMessage: typeof sendMessage;
    __invite: typeof UA.prototype.invite;
    __register: typeof UA.prototype.register;
    __unregister: typeof UA.prototype.unregister;
    __transportConstructor: any;
    __onTransportConnected: () => void; // It is a private method
    onTransportConnected: typeof onTransportConnected;
    configuration: typeof UA.prototype.configuration;
    transport: WebPhoneSIPTransport;
}

export const patchUserAgent = (userAgent: WebPhoneUserAgent, sipInfo, options, id): WebPhoneUserAgent => {
    userAgent.defaultHeaders = ['P-rc-endpoint-id: ' + id, 'Client-id:' + options.appKey];

    userAgent.media = {};

    userAgent.enableQos = options.enableQos;
    userAgent.enableMediaReportLogging = options.enableMediaReportLogging;

    userAgent.qosCollectInterval = options.qosCollectInterval || 5000;

    if (options.media && (options.media.remote && options.media.local)) {
        userAgent.media.remote = options.media.remote;
        userAgent.media.local = options.media.local;
    } else userAgent.media = null;

    userAgent.sipInfo = sipInfo;

    userAgent.__invite = userAgent.invite;
    userAgent.invite = invite.bind(userAgent);

    userAgent.__register = userAgent.register;
    userAgent.register = register.bind(userAgent);

    userAgent.__unregister = userAgent.unregister;
    userAgent.unregister = unregister.bind(userAgent);

    userAgent.audioHelper = new AudioHelper(options.audioHelper);

    userAgent.__transportConstructor = userAgent.configuration.transportConstructor;
    userAgent.configuration.transportConstructor = TransportConstructorWrapper(
        userAgent.__transportConstructor,
        options
    );

    userAgent.onSession = options.onSession || null;
    userAgent.createRcMessage = createRcMessage;
    userAgent.sendMessage = sendMessage;

    userAgent.__onTransportConnected = userAgent.onTransportConnected;
    userAgent.onTransportConnected = onTransportConnected.bind(userAgent);

    userAgent.on('invite', (session: WebPhoneSession) => {
        userAgent.audioHelper.playIncoming(true);
        patchSession(session);
        patchIncomingSession(session);
        session.logger.log('UA recieved incoming call invite');
        session._sendReceiveConfirmPromise = session
            .sendReceiveConfirm()
            .then(() => {
                session.logger.log('sendReceiveConfirm success');
            })
            .catch(error => {
                session.logger.error('failed to send receive confirmation via SIP MESSAGE due to ' + error);
                throw error;
            });
    });

    userAgent.on('registrationFailed', (e: any) => {
        // Check the status of message is in sipErrorCodes and disconnecting from server if it so;
        if (!e) {
            return;
        }

        const message = e.data || e;
        if (message && typeof message === 'string' && userAgent.transport.isSipErrorCode(message)) {
            userAgent.transport.onSipErrorCode();
        }
        userAgent.logger.warn('UA Registration Failed');
    });

    userAgent.on('notify', ({request}: any) => {
        const event = request && request.headers && request.headers.Event && request.headers.Event[0];

        if (event && event.raw === 'check-sync') {
            userAgent.emit('provisionUpdate');
        }
        userAgent.logger.log('UA recieved notify');
    });

    userAgent.start();

    return userAgent;
};

/*--------------------------------------------------------------------------------------------------------------------*/

function onTransportConnected(this: WebPhoneUserAgent): any {
    if (this.configuration.register) {
        return this.register();
    }
}

/*--------------------------------------------------------------------------------------------------------------------*/
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

/*--------------------------------------------------------------------------------------------------------------------*/

function sendMessage(this: WebPhoneUserAgent, to: string, messageData: string): Promise<ClientContext> {
    const userAgent: WebPhoneUserAgent = this;
    const sipOptions: any = {};
    sipOptions.contentType = 'x-rc/agent';
    sipOptions.extraHeaders = [];
    sipOptions.extraHeaders.push('P-rc-ws: ' + this.contact);

    return new Promise((resolve, reject) => {
        var message = userAgent.message(to, messageData, sipOptions);
        message.once('accepted', (response, cause) => resolve(response));
        message.once('failed', (response, cause) => reject(new Error(cause)));
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/

function register(this: WebPhoneUserAgent, options: any = {}): WebPhoneUserAgent {
    return this.__register.call(this, {
        ...options,
        extraHeaders: [...(options.extraHeaders || []), ...this.defaultHeaders]
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/

function unregister(this: WebPhoneUserAgent, options: any = {}): WebPhoneUserAgent {
    return this.__unregister.call(this, {
        ...options,
        extraHeaders: [...(options.extraHeaders || []), ...this.defaultHeaders]
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/

export interface InviteOptions {
    fromNumber?: string;
    homeCountryId?: string;
    extraHeaders?: any;
    RTCConstraints?: any;
}

function invite(this: WebPhoneUserAgent, number: string, options: InviteOptions = {}): WebPhoneSession {
    options.extraHeaders = (options.extraHeaders || []).concat(this.defaultHeaders);
    options.extraHeaders.push(
        'P-Asserted-Identity: sip:' + (options.fromNumber || this.sipInfo.username) + '@' + this.sipInfo.domain //FIXME Phone Number
    );

    //FIXME Backend should know it already
    if (options.homeCountryId) {
        options.extraHeaders.push('P-rc-country-id: ' + options.homeCountryId);
    }

    options.RTCConstraints = options.RTCConstraints || {
        optional: [{DtlsSrtpKeyAgreement: 'true'}]
    };

    this.audioHelper.playOutgoing(true);
    this.logger.log('Invite to ' + number + ' created with playOutgoing set to true');
    return patchSession(this.__invite(number, options) as any);
}
