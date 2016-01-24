import {expect, getSdk, getMock} from '../test/test';
import SDK from '../SDK';

describe('RingCentral.core.Observable', function() {

    var Observable = SDK.core.Observable;

    describe('Regular events', function() {

        it('binds and fires events', function() {

            var o = new Observable(),
                a = 0;

            o.on('event', function() {
                a++;
            });

            o.emit('event');
            expect(a).to.be.equal(1);

            o.emit('event');
            expect(a).to.be.equal(2);

        });

        it('binds and unbinds events', function() {

            var o = new Observable(),
                a = 0,
                c = function() {
                    a++;
                };

            o.on('event', c);
            o.off('event', c);

            o.emit('event');
            expect(a).to.be.equal(0);

        });

        it('don\'t share events', function() {

            var o1 = new Observable(),
                o2 = new Observable(),
                a = 0,
                c = function() {
                    a++;
                };

            o1.on('event', c);
            o2.on('event', c);

            o1.emit('event');
            o2.emit('event');

            expect(a).to.be.equal(2);

        });

    });

});
