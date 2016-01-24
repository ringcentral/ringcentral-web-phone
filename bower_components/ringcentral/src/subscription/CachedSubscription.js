import Subscription from './Subscription';
import Queue from '../core/Queue';

export default class CachedSubscription extends Subscription {

    constructor(pubnubFactory, platform, cache, cacheKey) {

        super(pubnubFactory, platform);

        this._cache = cache;
        this._cacheKey = cacheKey;
        this._renewQueue = new Queue(this._cache, cacheKey + '-renew');
        this._resubscribeQueue = new Queue(this._cache, cacheKey + '-resubscribe');

        this.events = {
            ...this.events,
            queuedRenewSuccess: 'queuedRenewSuccess',
            queuedRenewError: 'queuedRenewError',
            queuedResubscribeSuccess: 'queuedResubscribeSuccess',
            queuedResubscribeError: 'queuedResubscribeError'
        };

        this.on(this.events.renewError, () => {
            this.resubscribe();
        });

        this.on([this.events.subscribeSuccess, this.events.renewSuccess], () => {
            this._cache.setItem(this._cacheKey, this.subscription());
        });

        this.on(this.events.removeSuccess, () => {
            this._cache.removeItem(this._cacheKey);
        });

    }

    /**
     * TODO Combine with Platform.refresh and move elsewhere
     * @param actionCb
     * @param queue
     * @param successEvent
     * @param errorEvent
     * @param errorMessage
     * @return {*}
     * @private
     */
    async _queue(actionCb, queue, successEvent, errorEvent, errorMessage) {

        try {

            if (queue.isPaused()) {

                await queue.poll();

                if (!this.alive()) {
                    throw new Error(errorMessage);
                }

                this.emit(successEvent, null);

                return null;

            }

            queue.pause();

            var res = await actionCb.call(this);

            queue.resume();

            this.emit(successEvent, res);

            return res;

        } catch (e) {

            this.emit(errorEvent, e);

            throw e;

        }

    }

    /**
     * @returns {Promise<ApiResponse>}
     */
    renew() {

        return this._queue(
            super.renew,
            this._renewQueue,
            this.events.queuedRenewSuccess,
            this.events.queuedRenewError,
            'Subscription is not alive after renew timeout'
        );

    }

    /**
     * @returns {Promise<ApiResponse>}
     */
    resubscribe() {

        return this._queue(
            super.resubscribe,
            this._resubscribeQueue,
            this.events.queuedResubscribeSuccess,
            this.events.queuedResubscribeError,
            'Subscription is not alive after resubscribe timeout'
        );

    }

    /**
     * @param {string[]} events
     * @return {CachedSubscription}
     */
    restore(events) {

        var cachedSubscriptionData = this._cache.getItem(this._cacheKey);

        if (cachedSubscriptionData) {
            try {
                this.setSubscription(cachedSubscriptionData);
            } catch (e) {}
        } else {
            this.setEventFilters(events);
        }

        return this;

    }

}