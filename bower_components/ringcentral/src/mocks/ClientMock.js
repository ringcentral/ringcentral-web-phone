import Registry from './Registry';
import {default as HttpClient} from '../http/Client';

export default class Client extends HttpClient {

    constructor() {
        super();
        this._registry = new Registry();
    }

    registry() {
        return this._registry;
    }

    async _loadResponse(request) {

        var mock = this._registry.find(request);

        return await mock.getResponse(request);

    }

}