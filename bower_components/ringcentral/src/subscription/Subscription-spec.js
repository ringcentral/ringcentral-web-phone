import {expect, getSdk, getMock, getRegistry, spy} from '../test/test';
import SDK from '../SDK';

describe('RingCentral.subscription.Subscription', function() {

    var expiresIn = SDK.subscription.Subscription._renewHandicapMs * 2;

    describe('subscribe', function() {

        it('automatically renews subscription', function() {

            return getMock((sdk)=> {

                var subscription = sdk.createSubscription();

                getRegistry().subscribeGeneric(expiresIn);

                return subscription
                    .setEventFilters(['foo', 'bar'])
                    .register()
                    .then((res)=> {
                        expect(res.json().expiresIn).to.equal(expiresIn);
                    });

            });

        });

    });

    describe('notify', function() {

        it('fires a notification event when the notify method is called and passes the message object', function() {

            return getMock((sdk)=> {

                return new Promise((resolve)=> {

                    var subscription = sdk.createSubscription();

                    subscription.setSubscription({
                        id: 'foo',
                        expirationTime: new Date(Date.now() + expiresIn).toISOString(),
                        deliveryMode: {
                            subscriberKey: 'foo',
                            address: 'foo'
                        }
                    });

                    subscription.on(subscription.events.notification, function(event) {
                        expect(event).to.deep.equal({foo: 'bar'});
                        resolve();
                    });

                    subscription['_notify']({foo: 'bar'}); // using private API

                })

            });

        });

    });

    describe('renew', function() {

        it('fails when no subscription', function() {

            return getMock((sdk)=> {

                return sdk.createSubscription()
                    .renew()
                    .then(function() {
                        throw new Error('This should not be reached');
                    })
                    .catch(function(e) {
                        expect(e.message).to.equal('No subscription');
                    });

            });

        });

        it('fails when no eventFilters', function() {

            return getMock((sdk)=> {

                var subscription = sdk.createSubscription();

                subscription.setSubscription({
                    id: 'foo',
                    expirationTime: new Date(Date.now() + expiresIn).toISOString(),
                    deliveryMode: {
                        subscriberKey: 'foo',
                        address: 'foo'
                    }
                });

                return subscription
                    .renew()
                    .then(function() {
                        throw new Error('This should not be reached');
                    })
                    .catch(function(e) {
                        expect(e.message).to.equal('Events are undefined');
                    });

            });

        });

        it.skip('automatically renews when subscription is going to expire');

    });

    describe('subscribe', function() {

        it('fails when no eventFilters', function() {

            return getMock((sdk)=> {

                return sdk.createSubscription()
                    .subscribe()
                    .then(function() {
                        throw new Error('This should not be reached');
                    })
                    .catch(function(e) {
                        expect(e.message).to.equal('Events are undefined');
                    });

            });

        });

        it('calls the success callback and passes the subscription provided from the platform', function() {

            return getMock((sdk)=> {

                var event = 'foo',
                    subscription = sdk.createSubscription();

                getRegistry().subscribeGeneric();

                return subscription
                    .setEventFilters([event])
                    .subscribe()
                    .then(function() {
                        expect(subscription.subscription().eventFilters.length).to.equal(1);
                    });

            });

        });

        it('calls the error callback and passes the error provided from the platform', function() {

            return getMock((sdk)=> {

                var subscription = sdk.createSubscription();

                getRegistry()
                    .apiCall('POST', '/restapi/v1.0/subscription', {'message': 'Subscription failed'}, 400, 'Bad Request');

                return subscription
                    .setEventFilters(['foo'])
                    .subscribe()
                    .then(function() {
                        throw new Error('This should never be reached');
                    })
                    .catch(function(e) {

                        expect(e.message).to.equal('Subscription failed');
                        expect(e).to.be.an.instanceOf(Error);

                    });

            });

        });

    });

    describe('decrypt', function() {

        it('decrypts AES-encrypted messages when the subscription has an encryption key', function() {

            var subscription = getSdk().createSubscription().setSubscription({
                    id: 'foo',
                    expirationTime: new Date(Date.now() + expiresIn).toISOString(),
                    deliveryMode: {
                        encryptionKey: 'e0bMTqmumPfFUbwzppkSbA==',
                        subscriberKey: 'foo',
                        address: 'foo'
                    }
                }),
                aesMessage = 'gkw8EU4G1SDVa2/hrlv6+0ViIxB7N1i1z5MU/Hu2xkIKzH6yQzhr3vIc27IAN558kTOkacqE5DkLpRdnN1orwtI' +
                             'BsUHmPMkMWTOLDzVr6eRk+2Gcj2Wft7ZKrCD+FCXlKYIoa98tUD2xvoYnRwxiE2QaNywl8UtjaqpTk1+WDImBrt' +
                             '6uabB1WICY/qE0It3DqQ6vdUWISoTfjb+vT5h9kfZxWYUP4ykN2UtUW1biqCjj1Rb6GWGnTx6jPqF77ud0XgV1r' +
                             'k/Q6heSFZWV/GP23/iytDPK1HGJoJqXPx7ErQU=';

            expect(subscription['_decrypt'](aesMessage)).to.deep.equal({
                "timestamp": "2014-03-12T20:47:54.712+0000",
                "body": {
                    "extensionId": 402853446008,
                    "telephonyStatus": "OnHold"
                },
                "event": "/restapi/v1.0/account/~/extension/402853446008/presence",
                "uuid": "db01e7de-5f3c-4ee5-ab72-f8bd3b77e308"
            });

        });

    });

    describe('restoreFromCache', function() {

        it.skip('sets appropriate event filters if subscription is not alive', function() {});
        it.skip('sets appropriate event filters if subscription is never existed', function() {});
        it.skip('renews subscription if cache data is OK', function() {});
        it.skip('re-subscribes with default event filters when renew fails', function() {});

    });

});
