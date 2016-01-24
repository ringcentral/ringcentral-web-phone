import Observable from '../core/Observable';
import {PUBNUB} from '../core/Externals';

export default class PubnubMock extends Observable {

    constructor(options) {
        super();
        this.options = options;
        this.crypto_obj = PUBNUB.crypto_obj;
    }

    ready() {}

    subscribe(options) {
        this.on('message-' + options.channel, options.message);
    }

    unsubscribe(options) {
        this.off('message-' + options.channel);
    }

    receiveMessage(msg, channel) {
        this.emit('message-' + channel, msg, 'env', channel);
    }

}