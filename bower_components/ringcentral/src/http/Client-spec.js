import {expect, getSdk, getMock} from '../test/test';
import SDK from '../SDK';

describe('RingCentral.http.Client', function() {

    var Client = SDK.http.Client;

    function getClient(cb) {

        var client = new Client();

        // hijack into private property to bypass any fetch-related stuff
        client['_loadResponse'] = cb ? cb : async function() {
            throw new Error('No resolver provided for _loadResponse');
        };

        return client;

    }

    describe('createRequest', function() {

        it('sets default headers & properties', function() {

            var request = getClient().createRequest({url: 'http://foo/bar'});

            expect(request.headers.get('Content-Type')).to.equal('application/json');
            expect(request.headers.get('Accept')).to.equal('application/json');

            expect(request.url).to.equal('http://foo/bar');
            expect(request.method).to.equal('GET');

        });

        it('validates the method', function() {

            expect(() => {
                getClient().createRequest({url: 'http://foo/bar', method: 'foo'});
            }).to.throw(Error);

        });

    });

});
