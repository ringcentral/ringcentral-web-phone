import ES6Promise from 'es6-promise';
import nodeFetch from 'node-fetch';
import pubnub from 'pubnub';

var root = (new Function('return this'))();

export var Promise = (ES6Promise && ES6Promise.Promise) || root.Promise;

export var fetch = root.fetch || nodeFetch;
export var Request = root.Request || fetch.Request;
export var Response = root.Response || fetch.Response;
export var Headers = root.Headers || fetch.Headers;

export var PUBNUB = root.PUBNUB || pubnub;

export var localStorage = (typeof root.localStorage !== 'undefined') ? root.localStorage : {};