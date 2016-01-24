import {expect, getSdk, getMock, getRegistry} from '../test/test';
import SDK from '../SDK';

describe('RingCentral.core.Queue', function() {

    var pollInterval = SDK.core.Queue._pollInterval,
        releaseTimeout = SDK.core.Queue._releaseTimeout;

    function getQueue() {
        return new SDK.core.Queue(new SDK.core.Cache({}), 'foo');
    }

    describe('poll', function() {

        it('resumes after timeout if not resumed before', function(done) {

            getQueue().pause()
                .poll()
                .then(()=> {
                    done();
                }).catch(done);

        });

        it('can be resumed externally before timeout', function(done) {

            var queue = getQueue(),
                flag = false;

            queue.pause()
                .poll()
                .then(()=> {
                    expect(flag).to.equal(true);
                    done();
                });

            setTimeout(()=> {
                flag = true;
                queue.resume();
            }, releaseTimeout / 2);

        });

    });

});
