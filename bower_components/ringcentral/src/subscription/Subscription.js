import Observable from '../core/Observable';
import Client from '../http/Client';
import {poll, stopPolling, delay} from '../core/Utils';

export default class Subscription extends Observable {

    static _renewHandicapMs = 2 * 60 * 1000;
    static _pollInterval = 10 * 1000;

    events = {
        notification: 'notification',
        removeSuccess: 'removeSuccess',
        removeError: 'removeError',
        renewSuccess: 'renewSuccess',
        renewError: 'renewError',
        subscribeSuccess: 'subscribeSuccess',
        subscribeError: 'subscribeError'
    };

    constructor(pubnubFactory, platform) {

        super();

        this._pubnubFactory = pubnubFactory;
        this._platform = platform;
        this._pubnub = null;
        this._timeout = null;
        this._subscription = {};

    }

    subscribed(){

        return !!(this._subscription.id &&
                  this._subscription.deliveryMode &&
                  this._subscription.deliveryMode.subscriberKey &&
                  this._subscription.deliveryMode.address);

    }

    /**
     * @return {boolean}
     */
    alive() {
        return this.subscribed() && Date.now() < this.expirationTime();
    }

    expirationTime() {
        return new Date(this._subscription.expirationTime || 0).getTime() - Subscription._renewHandicapMs;
    }

    setSubscription(subscription) {

        subscription = subscription || {};

        this._clearTimeout();

        this._subscription = subscription;

        if (!this._pubnub) this._subscribeAtPubnub();

        this._setTimeout();

        return this;

    }

    subscription() {
        return this._subscription;
    }

    /**
     * Creates or updates subscription if there is an active one
     * @returns {Promise<ApiResponse>}
     */
    async register() {

        if (this.alive()) {
            return await this.renew();
        } else {
            return await this.subscribe();
        }

    }

    eventFilters() {
        return this._subscription.eventFilters || [];
    }

    /**
     * @param {string[]} events
     * @return {Subscription}
     */
    addEventFilters(events) {
        this.setEventFilters(this.eventFilters().concat(events));
        return this;
    }

    /**
     * @param {string[]} events
     * @return {Subscription}
     */
    setEventFilters(events) {
        this._subscription.eventFilters = events;
        return this;
    }

    /**
     * @returns {Promise<ApiResponse>}
     */
    async subscribe() {

        try {

            this._clearTimeout();

            if (!this.eventFilters().length) throw new Error('Events are undefined');

            var response = await this._platform.post('/restapi/v1.0/subscription', {
                    eventFilters: this._getFullEventFilters(),
                    deliveryMode: {
                        transportType: 'PubNub'
                    }
                }),
                json = response.json();

            this.setSubscription(json)
                .emit(this.events.subscribeSuccess, response);

            return response;


        } catch (e) {

            e = this._platform.client().makeError(e);

            this.reset()
                .emit(this.events.subscribeError, e);

            throw e;

        }

    }

    /**
     * @returns {Promise<ApiResponse>}
     */
    async renew() {

        try {

            this._clearTimeout();

            if (!this.subscribed()) throw new Error('No subscription');

            if (!this.eventFilters().length) throw new Error('Events are undefined');

            var response = await this._platform.put('/restapi/v1.0/subscription/' + this._subscription.id, {
                eventFilters: this._getFullEventFilters()
            });

            var json = response.json();

            this.setSubscription(json)
                .emit(this.events.renewSuccess, response);

            return response;

        } catch (e) {

            e = this._platform.client().makeError(e);

            this.reset()
                .emit(this.events.renewError, e);

            throw e;

        }

    }

    /**
     * @returns {Promise<ApiResponse>}
     */
    async remove() {

        try {

            if (!this.subscribed()) throw new Error('No subscription');

            var response = await this._platform.delete('/restapi/v1.0/subscription/' + this._subscription.id);

            this.reset()
                .emit(this.events.removeSuccess, response);

            return response;

        } catch (e) {

            e = this._platform.client().makeError(e);

            this.emit(this.events.removeError, e);

            throw e;

        }

    }

    /**
     * @returns {Promise<ApiResponse>}
     */
    resubscribe() {

        return this.reset().setEventFilters(this.eventFilters()).subscribe();

    }

    /**
     * Remove subscription and disconnect from PUBNUB
     * This method resets subscription at client side but backend is not notified
     */
    reset() {
        this._clearTimeout();
        if (this.subscribed() && this._pubnub) this._pubnub.unsubscribe({channel: this._subscription.deliveryMode.address});
        this._subscription = {};
        return this;
    }

    _getFullEventFilters() {

        return this.eventFilters().map((event) => {
            return this._platform.createUrl(event);
        });

    }

    _setTimeout() {

        this._clearTimeout();

        if (!this.alive()) throw new Error('Subscription is not alive');

        poll((next)=> {

            if (this.alive()) return next();

            this.renew();

        }, Subscription._pollInterval, this._timeout);

        return this;

    }

    _clearTimeout() {

        stopPolling(this._timeout);

        return this;

    }

    _decrypt(message) {

        if (!this.subscribed()) throw new Error('No subscription');

        if (this._subscription.deliveryMode.encryptionKey) {

            var PUBNUB = this._pubnubFactory;

            message = PUBNUB.crypto_obj.decrypt(message, this._subscription.deliveryMode.encryptionKey, {
                encryptKey: false,
                keyEncoding: 'base64',
                keyLength: 128,
                mode: 'ecb'
            });

        }

        return message;

    }

    _notify(message) {

        this.emit(this.events.notification, this._decrypt(message));

        return this;

    }

    _subscribeAtPubnub() {

        if (!this.alive()) throw new Error('Subscription is not alive');

        var PUBNUB = this._pubnubFactory;

        this._pubnub = PUBNUB.init({
            ssl: true,
            subscribe_key: this._subscription.deliveryMode.subscriberKey
        });

        this._pubnub.ready();

        this._pubnub.subscribe({
            channel: this._subscription.deliveryMode.address,
            message: this._notify.bind(this),
            connect: () => {}
        });

        return this;

    }

}

//export interface ISubscription {
//    id?:string;
//    uri?: string;
//    eventFilters?:string[];
//    expirationTime?:string; // 2014-03-12T19:54:35.613Z
//    expiresIn?:number;
//    deliveryMode?: {
//        transportType?:string;
//        encryption?:boolean;
//        address?:string;
//        subscriberKey?:string;
//        encryptionKey?:string;
//        secretKey?:string;
//    };
//    creationTime?:string; // 2014-03-12T19:54:35.613Z
//    status?:string; // Active
//}
