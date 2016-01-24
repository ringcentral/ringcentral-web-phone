import _mocha from 'mocha';
import _chai from 'chai';
import _sinon from 'sinon';
import _sinonChai from 'sinon-chai';
import SDK from '../SDK';

export var chai = _chai || window.chai;
export var sinon = _sinon || window.sinon;
export var expect = chai.expect;
export var spy = sinon.spy;

var client = new SDK.mocks.Client();
var pubnub = new SDK.pubnub.PubnubMockFactory();

// Alter default settings
SDK.platform.Platform._refreshDelayMs = 1;
SDK.core.Queue._pollInterval = 1;
SDK.core.Queue._releaseTimeout = 50;
SDK.subscription.Subscription._pollInterval = 1;

export function getRegistry() {
    return client.registry();
}

/**
 * @return {SDK}
 */
export function getSdk() {

    return new SDK({
        server: 'http://whatever',
        appKey: 'whatever',
        appSecret: 'whatever',
        client: client,
        pubnubFactory: pubnub
    });

}

export async function getMock(fn) {

    var sdk = getSdk();

    function clean() {
        sdk.cache().clean();
        client.registry().clear();
    }

    try {

        getRegistry().authentication();

        var platofrm = sdk.platform();

        await platofrm.login({
            username: 'whatever',
            password: 'whatever'
        });

        var res = await fn(sdk);

        clean();

        return res;

    } catch (e) {
        clean();
        throw e;
    }

}

export function asyncTest(fn) {

    return function(){
        return getMock(fn);
    };

}