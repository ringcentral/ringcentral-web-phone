export default class Cache {

    static defaultPrefix = 'rc-';

    constructor(storage, prefix) {
        this.setPrefix(prefix);
        this._storage = storage;
    }

    setPrefix(prefix) {
        this._prefix = prefix || Cache.defaultPrefix;
        return this;
    }

    setItem(key, data) {
        this._storage[this._prefixKey(key)] = JSON.stringify(data);
        return this;
    }

    removeItem(key) {
        delete this._storage[this._prefixKey(key)];
        return this;
    }

    getItem(key) {
        var item = this._storage[this._prefixKey(key)];
        if (!item) return null;
        return JSON.parse(item);
    }

    clean() {

        for (var key in this._storage) {

            if (!this._storage.hasOwnProperty(key)) continue;

            if (key.indexOf(this._prefix) === 0) {
                delete this._storage[key];
            }

        }

        return this;

    }

    _prefixKey(key) {
        return this._prefix + key;
    }

}