export const messages = {
    park: {reqid: 1, command: 'callpark'},
    startRecord: {reqid: 2, command: 'startcallrecord'},
    stopRecord: {reqid: 3, command: 'stopcallrecord'},
    flip: {reqid: 3, command: 'callflip', target: ''},
    monitor: {reqid: 4, command: 'monitor'},
    barge: {reqid: 5, command: 'barge'},
    whisper: {reqid: 6, command: 'whisper'},
    takeover: {reqid: 7, command: 'takeover'},
    toVoicemail: {reqid: 11, command: 'toVoicemail'},
    ignore: {reqid: 12, command: 'ignore'},
    receiveConfirm: {reqid: 17, command: 'receiveConfirm'},
    replyWithMessage: {reqid: 14, command: 'replyWithMessage'}
};

export const uuidKey = 'rc-webPhone-uuid';

export const responseTimeout = 60000;

export const defaultMediaConstraints = {
    audio: true,
    video: false
};
