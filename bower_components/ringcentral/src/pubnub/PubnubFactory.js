import PubnubMock from './PubnubMock.js';
import {PUBNUB} from '../core/Externals';

export default class PubnubMockFactory {

    constructor() {
        this.crypto_obj = PUBNUB.crypto_obj;
    }

    init(options) {
        return new PubnubMock(options);
    }

}