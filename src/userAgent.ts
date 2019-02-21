import {ClientContext, UA} from 'sip.js';
import {AudioHelper} from './audioHelper';
import {patchSession, patchIncomingSession, WebPhoneSession} from './session';

export interface WebPhoneUserAgent extends UA {
    media: any;
    defaultHeaders: any;
    enableQos: boolean;
    qosCollectInterval: number;
    sipInfo: any;
    audioHelper: AudioHelper;
    onSession: (session: WebPhoneSession) => any;
    createRcMessage: typeof createRcMessage;
    sendMessage: typeof sendMessage;
    __invite: typeof UA.prototype.invite;
    __register: typeof UA.prototype.register;
    __unregister: typeof UA.prototype.unregister;
    __onTransportReceiveMsg: any;
    onTransportReceiveMsg: any; //FIXME Untyped
}

export const patchUserAgent = (userAgent: WebPhoneUserAgent, sipInfo, options, id): WebPhoneUserAgent => {
    userAgent.defaultHeaders = ['P-rc-endpoint-id: ' + id, 'Client-id:' + options.appKey];

    userAgent.media = {};

    userAgent.enableQos = options.enableQos;

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

    userAgent.__onTransportReceiveMsg = userAgent.onTransportReceiveMsg;
    userAgent.onTransportReceiveMsg = onTransportReceiveMsg.bind(userAgent);

    userAgent.audioHelper = new AudioHelper(options.audioHelper);

    userAgent.onSession = options.onSession || null;
    userAgent.createRcMessage = createRcMessage;
    userAgent.sendMessage = sendMessage;

    userAgent.on('invite', (session: WebPhoneSession) => {
        userAgent.audioHelper.playIncoming(true);
        patchSession(session);
        patchIncomingSession(session);
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

    userAgent.start();
    userAgent.register();

    console.log('done');

    return userAgent;
};

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

function onTransportReceiveMsg(this: WebPhoneUserAgent, e: any): any {
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
        } catch (error) {
            return this.__onTransportReceiveMsg.call(this, e);
        }
    }

    if (data.match(/CSeq:\s*\d+\s+MESSAGE/i)) {
        const re = new RegExp(this.configuration.viaHost + ':\\d+', 'g');
        const newData = e.data.replace(re, this.configuration.viaHost);
        Object.defineProperty(e, 'data', {
            value: newData,
            writable: false
        });
    }

    return this.__onTransportReceiveMsg.call(this, e);
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

    console.log(options);

    this.audioHelper.playOutgoing(true);
    return patchSession(this.__invite(number, options) as any);
}
