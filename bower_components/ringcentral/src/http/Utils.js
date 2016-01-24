import {fetch, Request, Response, Headers, Promise} from '../core/Externals';
import * as utils from '../core/Utils';

/**
 * Creates a response
 * @param stringBody
 * @param init
 * @return {Response}
 */
export function createResponse(stringBody, init) {

    init = init || {};

    var response = new Response(stringBody, init);

    //TODO Wait for https://github.com/bitinn/node-fetch/issues/38
    if (utils.isNodeJS()) {

        response._text = stringBody;
        response._decode = function() {
            return this._text;
        };

    }

    return response;

}

export function findHeaderName(name, headers) {
    name = name.toLowerCase();
    return Object.keys(headers).reduce(function(res, key) {
        if (res) return res;
        if (name == key.toLowerCase()) return key;
        return res;
    }, null);
}