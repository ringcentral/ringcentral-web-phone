import { ClientContext, UA } from 'sip.js';
import { AudioHelper } from './audioHelper';
import { WebPhoneSession } from './session';
import { WebPhoneSIPTransport } from './sipTransportConstructor';
export interface WebPhoneUserAgent extends UA {
    media: any;
    defaultHeaders: any;
    enableQos: boolean;
    enableMediaReportLogging: boolean;
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
    __onTransportConnected: () => void;
    invite: (number: string, options: InviteOptions) => WebPhoneSession;
    switchFrom: (activeCall: ActiveCallInfo, options: InviteOptions) => WebPhoneSession;
    onTransportConnected: typeof onTransportConnected;
    configuration: typeof UA.prototype.configuration;
    transport: WebPhoneSIPTransport;
}
export declare const patchUserAgent: (userAgent: WebPhoneUserAgent, sipInfo: any, options: any, id: any) => WebPhoneUserAgent;
declare function onTransportConnected(this: WebPhoneUserAgent): any;
declare function createRcMessage(this: WebPhoneUserAgent, options: any): string;
declare function sendMessage(this: WebPhoneUserAgent, to: string, messageData: string): Promise<ClientContext>;
export interface InviteOptions {
    fromNumber?: string;
    homeCountryId?: string;
    extraHeaders?: any;
    RTCConstraints?: any;
}
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
export {};
