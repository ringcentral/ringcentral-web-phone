import {expect, getSdk, getMock, getRegistry} from './test/test';
import SDK from './SDK';

describe('RingCentral', function() {

    async function test(suite, server, done) {

        suite.timeout(10000); // Per SLA should be 3 seconds

        var sdk = new SDK({server: server, appKey: '', appSecret: ''});

        try {

            var response = await sdk.platform().get('', null, {skipAuthCheck: true});

            expect(response.json().uri).to.equal(server + '/restapi/v1.0');

            sdk.cache().clean();

        } catch (e) {
            throw e;
        }

    }

    it.skip('connects to sandbox', function() {
        return test(this, SDK.server.sandbox);
    });

    it('connects to production', function() {
        return test(this, SDK.server.production);
    });

});
