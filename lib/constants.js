"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMediaConstraints = exports.responseTimeout = exports.uuidKey = exports.messages = void 0;
exports.messages = {
    park: { reqid: 1, command: 'callpark' },
    startRecord: { reqid: 2, command: 'startcallrecord' },
    stopRecord: { reqid: 3, command: 'stopcallrecord' },
    flip: { reqid: 3, command: 'callflip', target: '' },
    monitor: { reqid: 4, command: 'monitor' },
    barge: { reqid: 5, command: 'barge' },
    whisper: { reqid: 6, command: 'whisper' },
    takeover: { reqid: 7, command: 'takeover' },
    toVoicemail: { reqid: 11, command: 'toVoicemail' },
    ignore: { reqid: 12, command: 'ignore' },
    receiveConfirm: { reqid: 17, command: 'receiveConfirm' },
    replyWithMessage: { reqid: 14, command: 'replyWithMessage' }
};
exports.uuidKey = 'rc-webPhone-uuid';
exports.responseTimeout = 60000;
exports.defaultMediaConstraints = {
    audio: true,
    video: false
};
//# sourceMappingURL=constants.js.map