import {fetch, Request, Response, Headers, Promise} from '../core/Externals';
import * as utils from './Utils';

export default class ApiResponse {

    static _contentType = 'Content-Type';
    static _jsonContentType = 'application/json';
    static _multipartContentType = 'multipart/mixed';
    static _urlencodedContentType = 'application/x-www-form-urlencoded';
    static _headerSeparator = ':';
    static _bodySeparator = '\n\n';
    static _boundarySeparator = '--';

    /**
     * @param {Request} request
     * @param {Response} response
     * @param {string} responseText
     */
    constructor(request, response, responseText) {

        /** @type {Request} */
        this._request = request;

        /** @type {Response} */
        this._response = response;

        this._text = responseText;
        this._json = null;
        this._multipart = [];

    }

    /**
     * @return {Response}
     */
    response() {
        return this._response;
    }

    /**
     * @return {Request}
     */
    request() {
        return this._request;
    }

    /**
     * @return {boolean}
     */
    ok() {
        return this._response && this._response.ok;
    }

    /**
     * @return {string}
     */
    text() {
        if (!this._isJson() && !this._isMultipart()) throw new Error('Response is not text');
        return this._text;
    }

    /**
     * @return {object}
     */
    json() {
        if (!this._isJson()) throw new Error('Response is not JSON');
        if (!this._json) {
            this._json = this._text ? JSON.parse(this._text) : null;
        }
        return this._json;
    }

    /**
     * @param [skipOKCheck]
     * @return {string}
     */
    error(skipOKCheck) {

        if (this.ok() && !skipOKCheck) return null;

        var message = (this._response && this._response.status ? this._response.status + ' ' : '') +
                      (this._response && this._response.statusText ? this._response.statusText : '');

        try {

            if (this.json().message) message = this.json().message;
            if (this.json().error_description) message = this.json().error_description;
            if (this.json().description) message = this.json().description;

        } catch (e) {}

        return message;

    }

    /**
     * @return {ApiResponse[]}
     */
    multipart() {

        if (!this._isMultipart()) throw new Error('Response is not multipart');

        if (!this._multipart.length) {

            // Step 1. Split multipart response

            var text = this.text();

            if (!text) throw new Error('No response body');

            var boundary = this._getContentType().match(/boundary=([^;]+)/i)[1];

            if (!boundary) throw new Error('Cannot find boundary');

            var parts = text.toString().split(ApiResponse._boundarySeparator + boundary);

            if (parts[0].trim() === '') parts.shift();
            if (parts[parts.length - 1].trim() == ApiResponse._boundarySeparator) parts.pop();

            if (parts.length < 1) throw new Error('No parts in body');

            // Step 2. Parse status info

            var statusInfo = ApiResponse.create(parts.shift(), this._response.status, this._response.statusText).json();

            // Step 3. Parse all other parts

            this._multipart = parts.map((part, i) => {

                var status = statusInfo.response[i].status;

                return ApiResponse.create(part, status);

            });

        }

        return this._multipart;

    }

    _isContentType(contentType) {
        return this._getContentType().indexOf(contentType) > -1;
    }

    _getContentType() {
        return this._response.headers.get(ApiResponse._contentType) || '';
    }

    _isMultipart() {
        return this._isContentType(ApiResponse._multipartContentType);
    }

    _isUrlEncoded() {
        return this._isContentType(ApiResponse._urlencodedContentType);
    }

    _isJson() {
        return this._isContentType(ApiResponse._jsonContentType);
    }

    /**
     * Method is used to create ApiResponse object from string parts of multipart/mixed response
     * @param {string} [text]
     * @param {number} [status]
     * @param {string} [statusText]
     * @return {ApiResponse}
     */
    static create(text, status, statusText) {

        text = text || '';
        status = status || 200;
        statusText = statusText || 'OK';

        text = text.replace(/\r/g, '');

        var headers = new Headers(),
            headersAndBody = text.split(ApiResponse._bodySeparator),
            headersText = (headersAndBody.length > 1) ? headersAndBody.shift() : '';

        text = headersAndBody.join(ApiResponse._bodySeparator);

        (headersText || '')
            .split('\n')
            .forEach((header) => {

                var split = header.trim().split(ApiResponse._headerSeparator),
                    key = split.shift().trim(),
                    value = split.join(ApiResponse._headerSeparator).trim();

                if (key) headers.append(key, value);

            });

        return new ApiResponse(null, utils.createResponse(text, {
            headers: headers,
            status: status,
            statusText: statusText
        }), text);

    }

}