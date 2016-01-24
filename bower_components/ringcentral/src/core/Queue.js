import {Promise} from '../core/Externals';
import {poll, stopPolling} from './Utils';

export default class Queue {

    static _pollInterval = 250;
    static _releaseTimeout = 5000;

    constructor(cache, cacheId) {

        this._cache = cache;
        this._cacheId = cacheId;
        this._promise = null;

    }

    isPaused() {

        var time = this._cache.getItem(this._cacheId);

        return !!time && Date.now() - parseInt(time) < Queue._releaseTimeout;
    }

    pause() {
        this._cache.setItem(this._cacheId, Date.now());
        return this;
    }

    resume() {
        this._cache.removeItem(this._cacheId);
        return this;
    }

    poll() {

        if (this._promise) return this._promise;

        this._promise = new Promise((resolve, reject) => {

            poll((next) => {

                if (this.isPaused()) return next();

                this._promise = null;

                this.resume(); // this is actually not needed but why not

                resolve(null);

            }, Queue._pollInterval);

        });

        return this._promise;

    }

}