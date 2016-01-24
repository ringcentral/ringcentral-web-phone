import ApiResponse from '../http/ApiResponse';
import {delay} from '../core/Utils';
import {createResponse} from '../http/Utils';

export default class Mock {

    constructor(method, path, json, status, statusText, delay) {
        this._method = method.toUpperCase();
        this._path = path;
        this._json = json || {};
        this._delay = delay || 10;
        this._status = status || 200;
        this._statusText = statusText || 'OK';
    }

    path() {
        return this._path;
    }

    method() {
        return this._method;
    }

    test(request) {

        return request.url.indexOf(this._path) > -1 &&
               request.method.toUpperCase() == this._method;

    }

    async getResponse(request) {

        await delay(this._delay);

        return this.createResponse(this._json);

    }

    createResponse(json, init) {

        init = init || {};

        init.status = init.status || this._status;
        init.statusText = init.statusText || this._statusText;

        var str = JSON.stringify(json),
            res = createResponse(str, init);

        res.headers.set(ApiResponse._contentType, ApiResponse._jsonContentType);

        return res;

    }

}