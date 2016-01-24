import {expect, getSdk, getMock} from '../test/test';
import SDK from '../SDK';

describe('RingCentral.core.Cache', function() {

    var Cache = SDK.core.Cache;

    describe('getItem', function() {

        it('returns a previously set item', function() {

            var cache = new Cache({'rc-foo': '"bar"'});

            expect(cache.getItem('foo')).to.equal('bar');

        });

        it('returns null if item not found', function() {

            var cache = new Cache({});

            expect(cache.getItem('foo')).to.equal(null);

        });

    });

    describe('setItem', function() {

        it('sets an item in storage', function() {

            var cache = new Cache({});

            expect(cache.setItem('foo', {foo: 'bar'}).getItem('foo')).to.deep.equal({foo: 'bar'});

        });

    });

});
