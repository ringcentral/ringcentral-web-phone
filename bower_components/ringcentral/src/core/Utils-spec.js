import {expect, getSdk, getMock} from '../test/test';
import SDK from '../SDK';

describe('RingCentral.core.Utils', function() {

    var utils = SDK.core.Utils;

    describe('parseQueryString & queryStringify', function() {

        it('parses queryStrings', function() {

            expect(utils.parseQueryString('foo=bar&bar=baz')).to.deep.equal({foo: 'bar', bar: 'baz'});
            expect(utils.parseQueryString('foo=bar&foo=baz')).to.deep.equal({foo: ['bar', 'baz']});
            expect(utils.parseQueryString('foo')).to.deep.equal({foo: true});

        });

        it('builds queryStrings', function() {

            expect(utils.queryStringify({foo: 'bar', bar: 'baz'})).to.equal('foo=bar&bar=baz');
            expect(utils.queryStringify({foo: ['bar', 'baz']})).to.equal('foo=bar&foo=baz');

        });

        it('decodes pre-encoded string representation of object to be equal to original object', function() {

            function encodeDecode(v) {
                return utils.parseQueryString(utils.queryStringify(v));
            }

            var simple = {foo: 'bar'},
                array = {foo: ['bar', 'baz']};

            expect(encodeDecode(simple)).to.deep.equal(simple);
            expect(encodeDecode(array)).to.deep.equal(array);

        });

    });

    describe('poll & stopPolling', function() {

        it('allows to set custom delay', function(done) {

            utils.poll(function(next, delay) {

                expect(delay).to.equal(10);
                done();

            }, 10);

        });

        it('provides a method to do it continuously', function(done) {

            var i = 0;

            utils.poll(function(next) {

                i++;

                if (i < 3) next(); else done();

            }, 1);

            after(function() {

                expect(i).to.equal(3);

            });

        });

        it('provides a method stop', function(done) {

            var timeout = utils.poll(function(next) {

                done(new Error('This should never be reached'));

            }, 10);

            utils.stopPolling(timeout);

            done();

        });

        it('cancels a previous timeout if provided', function(done) {

            var timeout = utils.poll(function(next) {

                done(new Error('This should never be reached'));

            }, 10);

            var timeout2 = utils.poll(function(next) {

                done();

            }, 10, timeout);

        });

    });

});
