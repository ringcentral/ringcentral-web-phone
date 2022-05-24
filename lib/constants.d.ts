export declare const messages: {
    park: {
        reqid: number;
        command: string;
    };
    startRecord: {
        reqid: number;
        command: string;
    };
    stopRecord: {
        reqid: number;
        command: string;
    };
    flip: {
        reqid: number;
        command: string;
        target: string;
    };
    monitor: {
        reqid: number;
        command: string;
    };
    barge: {
        reqid: number;
        command: string;
    };
    whisper: {
        reqid: number;
        command: string;
    };
    takeover: {
        reqid: number;
        command: string;
    };
    toVoicemail: {
        reqid: number;
        command: string;
    };
    ignore: {
        reqid: number;
        command: string;
    };
    receiveConfirm: {
        reqid: number;
        command: string;
    };
    replyWithMessage: {
        reqid: number;
        command: string;
    };
};
export declare const uuidKey = "rc-webPhone-uuid";
export declare const responseTimeout = 60000;
export declare const defaultMediaConstraints: {
    audio: boolean;
    video: boolean;
};
