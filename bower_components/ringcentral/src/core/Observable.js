export default class Observable {

    constructor() {
        this.off();
    }

    hasListeners(event) {
        return (event in this._listeners);
    }

    on(events, callback) {

        if (typeof events == 'string') events = [events];
        if (!events) throw new Error('No events to subscribe to');
        if (typeof callback !== 'function') throw new Error('Callback must be a function');

        events.forEach((event) => {

            if (!this.hasListeners(event)) this._listeners[event] = [];

            this._listeners[event].push(callback);

        });

        return this;

    }

    emit(event, ...args) {

        var result = null;

        if (!this.hasListeners(event)) return null;

        this._listeners[event].some((callback) => {

            result = callback.apply(this, args);
            return (result === false);

        });

        return result;

    }

    off(event, callback) {

        if (!event) {

            this._listeners = {};

        } else {

            if (!callback) {

                delete this._listeners[event];

            } else {

                if (!this.hasListeners(event)) return this;

                this._listeners[event].forEach((cb, i) => {

                    if (cb === callback) delete this._listeners[event][i];

                });

            }

        }

        return this;

    }

}