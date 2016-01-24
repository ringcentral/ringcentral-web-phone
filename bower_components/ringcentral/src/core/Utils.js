import {Promise} from './Externals.js';

/**
 * TODO Replace with something better
 * @see https://github.com/joyent/node/blob/master/lib/querystring.js
 * @param {object} parameters
 * @returns {string}
 */
export function queryStringify(parameters) {

    var array = [];

    parameters = parameters || {};

    Object.keys(parameters).forEach((k) => {

        var v = parameters[k];

        if (isArray(v)) {
            v.forEach((vv) => {
                array.push(encodeURIComponent(k) + '=' + encodeURIComponent(vv));
            });
        } else {
            array.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }

    });

    return array.join('&');

}

/**
 * TODO Replace with something better
 * @see https://github.com/joyent/node/blob/master/lib/querystring.js
 * @param {string} queryString
 * @returns {object}
 */
export function parseQueryString(queryString) {

    var argsParsed = {};

    queryString.split('&').forEach((arg) => {

        arg = decodeURIComponent(arg);

        if (arg.indexOf('=') == -1) {

            argsParsed[arg.trim()] = true;

        } else {

            var pair = arg.split('='),
                key = pair[0].trim(),
                value = pair[1].trim();

            if (key in argsParsed) {
                if (key in argsParsed && !isArray(argsParsed[key])) argsParsed[key] = [argsParsed[key]];
                argsParsed[key].push(value);
            } else {
                argsParsed[key] = value;
            }

        }

    });

    return argsParsed;

}

/**
 * @param obj
 * @return {boolean}
 */
export function isFunction(obj) {
    return typeof obj === "function";
}

/**
 * @param obj
 * @return {boolean}
 */
export function isArray(obj) {
    return Array.isArray ? Array.isArray(obj) : typeof obj === "array";
}

/**
 * @param fn
 * @param interval
 * @param timeout
 */
export function poll(fn, interval, timeout) { //NodeJS.Timer|number

    module.exports.stopPolling(timeout);

    interval = interval || 1000;

    var next = (delay) => {

        delay = delay || interval;

        interval = delay;

        return setTimeout(() => {

            fn(next, delay);

        }, delay);

    };

    return next();

}

export function stopPolling(timeout) {
    if (timeout) clearTimeout(timeout);
}

export function isNodeJS() {
    return (typeof process !== 'undefined');
}

export function isBrowser() {
    return (typeof window !== 'undefined');
}

export function delay(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(null);
        }, timeout);
    });
}