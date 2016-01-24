import Observable from '../core/Observable';
import Queue from '../core/Queue';
import Auth from './Auth';
import {Promise} from '../core/Externals';
import {queryStringify, parseQueryString, delay} from '../core/Utils';

export default class Platform extends Observable {

    static _urlPrefix = '/restapi';
    static _apiVersion = 'v1.0';
    static _accessTokenTtl = null; // Platform server by default sets it to 60 * 60 = 1 hour
    static _refreshTokenTtl = 10 * 60 * 60; // 10 hours
    static _refreshTokenTtlRemember = 7 * 24 * 60 * 60; // 1 week
    static _tokenEndpoint = '/restapi/oauth/token';
    static _revokeEndpoint = '/restapi/oauth/revoke';
    static _authorizeEndpoint = '/restapi/oauth/authorize';
    static _refreshDelayMs = 100;
    static _cacheId = 'platform';
    static _clearCacheOnRefreshError = true;

    events = {
        beforeLogin: 'beforeLogin',
        loginSuccess: 'loginSuccess',
        loginError: 'loginError',
        beforeRefresh: 'beforeRefresh',
        refreshSuccess: 'refreshSuccess',
        refreshError: 'refreshError',
        beforeLogout: 'beforeLogout',
        logoutSuccess: 'logoutSuccess',
        logoutError: 'logoutError'
    };

    constructor(client, cache, server, appKey, appSecret) {

        super();

        this._server = server;
        this._appKey = appKey;
        this._appSecret = appSecret;

        /** @type {Cache} */
        this._cache = cache;

        /** @type {Client} */
        this._client = client;

        this._queue = new Queue(this._cache, Platform._cacheId + '-refresh');

        this._auth = new Auth(this._cache, Platform._cacheId);

    }

    /**
     * @return {Auth}
     */
    auth() {
        return this._auth;
    }

    /**
     * @return {Client}
     */
    client() {
        return this._client;
    }

    /**
     * @param {string} path
     * @param {object} [options]
     * @param {boolean} [options.addServer]
     * @param {string} [options.addMethod]
     * @param {boolean} [options.addToken]
     * @return {string}
     */
    createUrl(path, options) {

        path = path || '';
        options = options || {};

        var builtUrl = '',
            hasHttp = path.indexOf('http://') != -1 || path.indexOf('https://') != -1;

        if (options.addServer && !hasHttp) builtUrl += this._server;

        if (path.indexOf(Platform._urlPrefix) == -1 && !hasHttp) builtUrl += Platform._urlPrefix + '/' + Platform._apiVersion;

        builtUrl += path;

        if (options.addMethod || options.addToken) builtUrl += (path.indexOf('?') > -1 ? '&' : '?');

        if (options.addMethod) builtUrl += '_method=' + options.addMethod;
        if (options.addToken) builtUrl += (options.addMethod ? '&' : '') + 'access_token=' + this._auth.accessToken();

        return builtUrl;

    }

    /**
     * @param {string} options.redirectUri
     * @param {string} options.state
     * @param {string} options.brandId
     * @param {string} options.display
     * @param {string} options.prompt
     * @return {string}
     */
    authUrl(options) {

        options = options || {};

        return this.createUrl(Platform._authorizeEndpoint + '?' + queryStringify({
                'response_type': 'code',
                'redirect_uri': options.redirectUri || '',
                'client_id': this._appKey,
                'state': options.state || '',
                'brand_id': options.brandId || '',
                'display': options.display || '',
                'prompt': options.prompt || ''
            }), {addServer: true})

    }

    /**
     * @param {string} url
     * @return {Object}
     */
    parseAuthRedirectUrl(url) {

        var qs = parseQueryString(url.split('?').reverse()[0]),
            error = qs.error_description || qs.error;

        if (error) {
            var e = new Error(error);
            e.error = qs.error;
            throw e;
        }

        return qs;

    }

    /**
     * @return {Promise<boolean>}
     */
    async loggedIn() {

        try {
            await this._ensureAuthentication();
            return true;
        } catch (e) {
            return false;
        }

    }

    /**
     * @param {string} options.username
     * @param {string} options.password
     * @param {string} options.extension
     * @param {string} options.code
     * @param {string} options.redirectUri
     * @param {string} options.endpointId
     * @returns {Promise<ApiResponse>}
     */
    async login(options) {

        try {

            options = options || {};

            options.remember = options.remember || false;

            this.emit(this.events.beforeLogin);

            var body = {
                "access_token_ttl": Platform._accessTokenTtl,
                "refresh_token_ttl": options.remember ? Platform._refreshTokenTtlRemember : Platform._refreshTokenTtl
            };

            if (!options.code) {

                body.grant_type = 'password';
                body.username = options.username;
                body.password = options.password;
                body.extension = options.extension || '';

            } else if (options.code) {

                body.grant_type = 'authorization_code';
                body.code = options.code;
                body.redirect_uri = options.redirectUri;
                //body.client_id = this.getCredentials().key; // not needed

            }

            if (options.endpointId) body.endpoint_id = options.endpointId;

            var apiResponse = await this._tokenRequest(Platform._tokenEndpoint, body),
                json = apiResponse.json();

            this._auth
                .setData(json)
                .setRemember(options.remember);

            this.emit(this.events.loginSuccess, apiResponse);

            return apiResponse;

        } catch (e) {

            this._cache.clean();

            this.emit(this.events.loginError, e);

            throw e;

        }

    }

    /**
     * @returns {Promise<ApiResponse>}
     */
    async refresh() {

        try {

            this.emit(this.events.beforeRefresh);

            if (this._queue.isPaused()) {

                await this._queue.poll();

                if (!this._isAccessTokenValid()) {
                    throw new Error('Automatic authentification timeout');
                }

                this.emit(this.events.refreshSuccess, null);

                return null;

            }

            this._queue.pause();

            // Make sure all existing AJAX calls had a chance to reach the server
            await delay(Platform._refreshDelayMs);

            // Perform sanity checks
            if (!this._auth.refreshToken()) throw new Error('Refresh token is missing');
            if (!this._auth.refreshTokenValid()) throw new Error('Refresh token has expired');
            if (!this._queue.isPaused()) throw new Error('Queue was resumed before refresh call');

            /** @type {ApiResponse} */
            var res = await this._tokenRequest(Platform._tokenEndpoint, {
                    "grant_type": "refresh_token",
                    "refresh_token": this._auth.refreshToken(),
                    "access_token_ttl": Platform._accessTokenTtl,
                    "refresh_token_ttl": this._auth.remember() ? Platform._refreshTokenTtlRemember : Platform._refreshTokenTtl
                }),
                json = res.json();

            if (!json.access_token) {
                throw this._client.makeError(new Error('Malformed OAuth response'), res);
            }

            this._auth.setData(json);
            this._queue.resume();

            this.emit(this.events.refreshSuccess, res);

            return res;

        } catch (e) {

            e = this._client.makeError(e);

            if (Platform._clearCacheOnRefreshError) {
                this._cache.clean();
            }

            this.emit(this.events.refreshError, e);

            throw e;

        }

    }

    /**
     * @returns {Promise<ApiResponse>}
     */
    async logout() {

        try {

            this.emit(this.events.beforeLogout);

            this._queue.pause();

            var res = await this._tokenRequest(Platform._revokeEndpoint, {
                token: this._auth.accessToken()
            });

            this._queue.resume();
            this._cache.clean();

            this.emit(this.events.logoutSuccess, res);

            return res;

        } catch (e) {

            this._queue.resume();

            this.emit(this.events.logoutError, e);

            throw e;

        }

    }

    /**
     * @param {Request} request
     * @param {object} [options]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<Request>}
     */
    async inflateRequest(request, options) {

        options = options || {};

        if (options.skipAuthCheck) return request;

        await this._ensureAuthentication();

        request.headers.set('Authorization', this._authHeader());
        //request.url = this.createUrl(request.url, {addServer: true}); //FIXME Spec prevents this...

        //TODO Add User-Agent here

        return request;

    }

    /**
     * @param {Request} request
     * @param {object} [options]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */
    async sendRequest(request, options) {

        try {

            request = await this.inflateRequest(request, options);

            return (await this._client.sendRequest(request));

        } catch (e) {

            // Guard is for errors that come from polling
            if (!e.apiResponse || !e.apiResponse.response() || (e.apiResponse.response().status != 401)) throw e;

            this._auth.cancelAccessToken();

            return (await this.sendRequest(request, options));

        }

    }

    /**
     * General purpose function to send anything to server
     * @param {string} options.url
     * @param {object} [options.body]
     * @param {string} [options.method]
     * @param {object} [options.query]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */
    async send(options = {}) {

        //FIXME https://github.com/bitinn/node-fetch/issues/43
        options.url = this.createUrl(options.url, {addServer: true});

        return await this.sendRequest(this._client.createRequest(options), options);

    }

    /**
     * @param {string} url
     * @param {object} [query]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */
    async get(url, query, options) {
        options = options || {};
        options.method = 'GET';
        options.url = url;
        options.query = query;
        return await this.send(options);
    }

    /**
     * @param {string} url
     * @param {object} body
     * @param {object} [query]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */
    async post(url, body, query, options) {
        options = options || {};
        options.method = 'POST';
        options.url = url;
        options.query = query;
        options.body = body;
        return await this.send(options);
    }

    /**
     * @param {string} url
     * @param {object} [body]
     * @param {object} [query]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */
    async put(url, body, query, options) {
        options = options || {};
        options.method = 'PUT';
        options.url = url;
        options.query = query;
        options.body = body;
        return await this.send(options);
    }

    /**
     * @param {string} url
     * @param {string} [query]
     * @param {object} [options]
     * @param {object} [options.headers]
     * @param {boolean} [options.skipAuthCheck]
     * @return {Promise<ApiResponse>}
     */
    async 'delete'(url, query, options) {
        options = options || {};
        options.method = 'DELETE';
        options.url = url;
        options.query = query;
        return await this.send(options);
    }

    async _tokenRequest(path, body) {

        return await this.send({
            url: path,
            skipAuthCheck: true,
            body: body,
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + this._apiKey(),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

    }

    async _ensureAuthentication() {

        if (this._isAccessTokenValid()) return null;
        return await this.refresh();

    }

    _isAccessTokenValid() {

        return (this._auth.accessTokenValid() && !this._queue.isPaused());

    }

    _apiKey() {
        var apiKey = this._appKey + ':' + this._appSecret;
        return (typeof btoa == 'function') ? btoa(apiKey) : new Buffer(apiKey).toString('base64');
    }

    _authHeader() {
        var token = this._auth.accessToken();
        return this._auth.tokenType() + (token ? ' ' + token : '');
    }

}